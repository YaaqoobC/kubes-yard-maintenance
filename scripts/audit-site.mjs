import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const baseURL = process.argv[2] ?? 'http://127.0.0.1:4174';
const output = process.argv[3] ?? 'artifacts/milestone-1.5/audit';
const routes = ['/', '/lawn-care', '/snow-removal', '/about', '/contact'];
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL,
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
      for (const route of routes) {
        const errors = [];
        const onError = (error) => errors.push(error.message);
        page.on('pageerror', onError);
        const response = await page.goto(`${baseURL}${route}`);
        await page.evaluate(() => document.fonts.ready);
        const measurements = await page.evaluate(() => ({
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
          ? `${route === '/' ? 'home' : route.slice(1)}-${width}-${theme}.png`
          : null;
        if (screenshot)
          await page.screenshot({
            path: `${output}/${screenshot}`,
            fullPage: true,
            animations: 'disabled',
          });
        report.cases.push({
          route,
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
  const menu = page.getByRole('button', { name: /^(Menu|Close)$/ });
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
console.log(
  JSON.stringify(
    {
      output,
      cases: report.cases.length,
      overflows: report.cases.filter((item) => item.scrollWidth > item.viewport)
        .length,
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
