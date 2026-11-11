import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const baseURL = process.argv[2] ?? 'http://127.0.0.1:4174';
const output = process.argv[3] ?? 'artifacts/milestone-2/audit';
const routes = ['/', '/lawn-care', '/snow-removal', '/about', '/contact'];
const cases = [
  ...routes.map((route) => ({
    route,
    feature: route === '/' ? 'winter' : null,
  })),
  { route: '/', feature: 'summer' },
];
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL,
  args: ['--disable-gpu'],
});
const report = { baseURL, cases: [], http: [], interactions: {} };
try {
  for (const theme of ['light', 'dark']) {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    await context.addInitScript(
      (value) => localStorage.setItem('kubes-theme', value),
      theme,
    );
    const page = await context.newPage();
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const { route, feature } of cases) {
        await page.clock.setFixedTime(new Date('2026-11-15T12:00:00Z'));
        const errors = [];
        const onError = (error) => errors.push(error.message);
        page.on('pageerror', onError);
        const response = await page.goto(`${baseURL}${route}`);
        await page.evaluate(() => document.fonts.ready);
        if (feature === 'summer')
          await page
            .getByRole('button', { name: 'Summer', exact: true })
            .click();
        await page.evaluate(() =>
          window.scrollTo({ top: 0, behavior: 'instant' }),
        );
        const measurements = await page.evaluate(() => ({
          featuredSeason: document.documentElement.dataset.featuredSeason,
          scrollWidth: document.documentElement.scrollWidth,
          viewport: innerWidth,
          title: document.title,
          description: document.querySelector('meta[name="description"]')
            ?.content,
          canonical:
            document.querySelector('link[rel="canonical"]')?.href ?? null,
          h1: [...document.querySelectorAll('h1')].map(
            (element) => element.innerText,
          ),
          brokenImages: [...document.images].filter(
            (image) => !image.complete || !image.naturalWidth,
          ).length,
          smallText: [...document.querySelectorAll('p, li, a, select')]
            .filter(
              (element) =>
                element.getClientRects().length &&
                parseFloat(getComputedStyle(element).fontSize) < 12,
            )
            .map((element) => ({
              text: element.textContent.trim(),
              pixels: getComputedStyle(element).fontSize,
            })),
          primaryActions: [
            ...document.querySelectorAll(
              '.action-link--primary, .menu-toggle, select',
            ),
          ]
            .filter((element) => element.getClientRects().length)
            .map((element) => ({
              text: element.textContent.trim(),
              width: element.getBoundingClientRect().width,
              height: element.getBoundingClientRect().height,
            })),
        }));
        const axe = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();
        const screenshot = [375, 1440].includes(width)
          ? `${route === '/' ? `home-${feature}` : route.slice(1)}-${width}-${theme}.png`
          : null;
        if (screenshot) {
          await page.evaluate(() => {
            if (document.activeElement instanceof HTMLElement)
              document.activeElement.blur();
            window.scrollTo({ top: 0, behavior: 'instant' });
          });
          // A fresh page at document height prevents stale offscreen Chrome
          // raster tiles and sticky-header ghosts after resizing/scanning.
          const height = await page.evaluate(
            () => document.documentElement.scrollHeight,
          );
          const capture = await context.newPage();
          await capture.setViewportSize({ width, height });
          await capture.clock.setFixedTime(
            new Date(
              feature === 'summer'
                ? '2026-07-15T12:00:00Z'
                : '2026-11-15T12:00:00Z',
            ),
          );
          await capture.goto(`${baseURL}${route}`);
          await capture.evaluate(() => document.fonts.ready);
          await capture.evaluate(
            () =>
              new Promise((resolve) =>
                requestAnimationFrame(() => requestAnimationFrame(resolve)),
              ),
          );
          await capture.screenshot({
            path: `${output}/${screenshot}`,
            animations: 'disabled',
          });
          await capture.close();
        }
        report.cases.push({
          route,
          feature,
          width,
          theme,
          status: response.status(),
          ...measurements,
          errors,
          violations: axe.violations,
          screenshot,
        });
        page.off('pageerror', onError);
      }
    }
    await page.setViewportSize({ width: 375, height: 812 });
    await page.clock.setFixedTime(new Date('2026-11-15T12:00:00Z'));
    await page.goto(`${baseURL}/`);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.getByRole('button', { name: 'Open menu', exact: true }).click();
    const menuAxe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    report.interactions[`mobileMenuAxe-${theme}`] = menuAxe.violations;
    await page.screenshot({
      path: `${output}/menu-375-${theme}.png`,
      animations: 'disabled',
    });
    await context.close();
  }
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  for (const path of [
    ...routes,
    '/robots.txt',
    '/sitemap.xml',
    '/missing-audit-page',
  ]) {
    const response = await context.request.get(`${baseURL}${path}`);
    const body = await response.text();
    report.http.push({
      path,
      status: response.status(),
      contentType: response.headers()['content-type'],
      bytes: Buffer.byteLength(body),
      preview: routes.includes(path) ? undefined : body.slice(0, 500),
    });
  }
  await page.goto(`${baseURL}/lawn-care`);
  const menu = page.getByRole('button', { name: /^(Open|Close) menu$/ });
  await menu.click();
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Snow removal' })
    .focus();
  await page.keyboard.press('Enter');
  await page.waitForURL('**/snow-removal');
  report.interactions.focusAfterMenuNavigation = await page.evaluate(() => ({
    tag: document.activeElement.tagName,
    text: document.activeElement.textContent?.trim(),
    id: document.activeElement.id,
    visible: !!document.activeElement.getClientRects().length,
  }));
  await menu.click();
  await page.getByRole('banner').getByRole('link', { name: /home$/ }).click();
  await page.waitForURL(baseURL + '/');
  report.interactions.menuAfterLogoNavigation =
    await menu.getAttribute('aria-expanded');
  await context.close();
} finally {
  await browser.close();
  await writeFile(
    `${output}/report.json`,
    JSON.stringify(report, null, 2) + '\n',
  );
}
const captures = report.cases
  .filter((item) => item.screenshot)
  .map((item) => ({
    file: item.screenshot,
    label: `${item.route === '/' ? `Home · ${item.feature}` : item.route} · ${item.width}px · ${item.theme}`,
  }));
for (const theme of ['light', 'dark'])
  captures.push({
    file: `menu-375-${theme}.png`,
    label: `Expanded menu · 375px · ${theme}`,
  });
await writeFile(
  `${output}/gallery.html`,
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kube’s Milestone 2 screenshots</title><style>body{font:16px/1.6 system-ui;background:#f6f5ef;color:#10291f;margin:32px}h1{font-size:28px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px}figure{margin:0;padding:16px;border:1px solid #cbd4dc}img{display:block;max-width:100%;height:500px;object-fit:contain;object-position:top;margin:16px auto}a{color:inherit}a:focus-visible{outline:2px solid #194b35;outline-offset:4px}</style><h1>Kube’s Yard Maintenance — Milestone 2</h1><p>Production static build · Chrome · 375px / 1440px · light / dark. Select a screenshot for the full resolution image. Home is captured with both seasonal choices.</p><main>${captures.map((item) => `<figure><figcaption>${item.label}</figcaption><a href="${item.file}"><img src="${item.file}" alt="${item.label}" loading="lazy">Open full size</a></figure>`).join('')}</main></html>`,
);
console.log(
  JSON.stringify(
    {
      output,
      cases: report.cases.length,
      overflows: report.cases.filter((item) => item.scrollWidth > item.viewport)
        .length,
      seasonMismatches: report.cases.filter(
        (item) => item.route === '/' && item.feature !== item.featuredSeason,
      ).length,
      accessibilityFailures: report.cases.filter(
        (item) => item.violations.length,
      ).length,
      http: report.http,
      interactions: report.interactions,
    },
    null,
    2,
  ),
);
