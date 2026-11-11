import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const baseURL = process.argv[2] ?? 'http://127.0.0.1:4174';
const output = process.argv[3] ?? 'artifacts/milestone-2.2/review';
const channel = process.env.PLAYWRIGHT_CHANNEL ?? 'chrome';
const routes = [
  { path: '/lawn-care', id: 'aeration' },
  { path: '/snow-removal', id: 'snow-add-ons' },
];
const report = { cases: [], zoom: [], screenshots: [] };
await mkdir(output, { recursive: true });

async function capture(page, file, zoom) {
  if (zoom) {
    // Preserve actual browser zoom: Playwright's viewport normalization can blank it.
    const cdp = await page.context().newCDPSession(page);
    const result = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      captureBeyondViewport: false,
    });
    await writeFile(`${output}/${file}`, Buffer.from(result.data, 'base64'));
    await cdp.detach();
  } else {
    await page.screenshot({
      path: `${output}/${file}`,
      animations: 'disabled',
    });
  }
}

async function inspect(page, route, theme, width, zoom = false) {
  await page.goto(`${baseURL}${route.path}`);
  await expect(page.locator('.theme-control > .sr-only')).toContainText(
    `Preference: ${theme}`,
  );
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(
    (id) =>
      document
        .getElementById(id)
        .scrollIntoView({ behavior: 'instant', block: 'start' }),
    route.id,
  );
  const nav = page.getByRole('navigation', { name: /service directory$/ });
  await expect(nav.locator('a[aria-current="location"]')).toHaveAttribute(
    'href',
    new RegExp(`#${route.id}$`),
  );
  const measure = () =>
    page.evaluate((id) => {
      const box = (selector) => {
        const r = document.querySelector(selector).getBoundingClientRect();
        return {
          top: r.top,
          bottom: r.bottom,
          left: r.left,
          right: r.right,
          height: r.height,
        };
      };
      return {
        viewport: innerWidth,
        outerWidth,
        dpr: devicePixelRatio,
        scrollWidth: document.documentElement.scrollWidth,
        header: box('.site-header'),
        directory: box('.service-directory'),
        heading: box(`#${id} h2`),
        contact: box('.contact-cta'),
        stickyTop: parseFloat(
          getComputedStyle(document.querySelector('.service-directory')).top,
        ),
      };
    }, route.id);
  const before = await measure();
  expect(before.scrollWidth).toBeLessThanOrEqual(before.viewport);
  expect(before.directory.top).toBeCloseTo(before.stickyTop, 0);
  expect(before.heading.top).toBeGreaterThanOrEqual(
    before.viewport < 1000 ? before.directory.bottom : before.header.bottom,
  );
  const axe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(axe.violations).toEqual([]);
  await page.evaluate(
    (id) => document.getElementById(id).scrollIntoView({ behavior: 'instant' }),
    route.id,
  );
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  const shouldCapture = zoom || [375, 1440].includes(width);
  const prefix = `${route.path.slice(1)}-${zoom ? 'zoom-200' : width}-${theme}`;
  if (shouldCapture) {
    const file = `${prefix}-reading.png`;
    await capture(page, file, zoom);
    report.screenshots.push({
      file,
      label: `${route.path} · ${zoom ? '200% browser zoom' : `${width}px`} · ${theme} · reading`,
    });
  }
  await page.evaluate(() => {
    const c = document.querySelector('.contact-cta').getBoundingClientRect();
    window.scrollTo({
      top:
        c.top +
        scrollY -
        document.querySelector('.site-header').getBoundingClientRect().height,
      behavior: 'instant',
    });
  });
  const released = await measure();
  expect(released.directory.bottom).toBeLessThanOrEqual(
    released.contact.top + 1,
  );
  if (shouldCapture) {
    const file = `${prefix}-release.png`;
    await capture(page, file, zoom);
    report.screenshots.push({
      file,
      label: `${route.path} · ${zoom ? '200% browser zoom' : `${width}px`} · ${theme} · contact boundary`,
    });
  }
  return {
    route: route.path,
    width,
    theme,
    before,
    released,
    violations: axe.violations,
  };
}

const browser = await chromium.launch({ channel, args: ['--disable-gpu'] });
try {
  for (const width of [320, 375, 768, 1024, 1440]) {
    for (const theme of ['light', 'dark']) {
      for (const route of routes) {
        const context = await browser.newContext({
          viewport: { width, height: 900 },
          reducedMotion: 'reduce',
        });
        await context.addInitScript(
          (value) => localStorage.setItem('kubes-theme', value),
          theme,
        );
        const page = await context.newPage();
        report.cases.push(await inspect(page, route, theme, width));
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
}

// Full Chrome UI changes actual page zoom in an isolated profile; no viewport emulation.
for (const theme of ['light', 'dark']) {
  const profile = await mkdtemp(join(tmpdir(), 'kubes-service-zoom-'));
  let context;
  try {
    context = await chromium.launchPersistentContext(profile, {
      channel,
      viewport: null,
      reducedMotion: 'reduce',
      args: ['--window-size=1440,1000', '--force-device-scale-factor=1'],
    });
    const page = await context.newPage();
    await page.goto('chrome://settings/appearance');
    await page.locator('#zoomLevel').selectOption({ label: '200%' });
    await expect(page.locator('#zoomLevel')).toHaveValue('2');
    await context.addInitScript(
      (value) => localStorage.setItem('kubes-theme', value),
      theme,
    );
    for (const route of routes) {
      const result = await inspect(page, route, theme, 1440, true);
      expect(result.before.outerWidth / result.before.viewport).toBeCloseTo(
        2,
        1,
      );
      expect(result.before.dpr).toBeCloseTo(2, 1);
      report.zoom.push(result);
    }
  } finally {
    await context?.close();
    await rm(profile, { recursive: true, force: true });
  }
}
await writeFile(
  `${output}/report.json`,
  JSON.stringify(report, null, 2) + '\n',
);
await writeFile(
  `${output}/gallery.html`,
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Milestone 2.2 service navigation review</title><style>body{font:16px/1.6 system-ui;background:#f6f5ef;color:#10291f;margin:32px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}figure{margin:0;padding:16px;border:1px solid #cbd4dc}img{display:block;max-width:100%;height:480px;object-fit:contain;object-position:top;margin:16px auto}a{color:inherit}a:focus-visible{outline:2px solid #194b35;outline-offset:4px}</style><h1>Milestone 2.2 — service navigation</h1><p>Actual static-build viewport captures while reading services and at the contact boundary. Zoom captures use Chrome’s own 200% setting, with a 1440px window and 720px CSS viewport.</p><main>${report.screenshots.map(({ file, label }) => `<figure><figcaption>${label}</figcaption><a href="${file}"><img src="${file}" alt="${label}" loading="lazy">Open full size</a></figure>`).join('')}</main></html>`,
);
console.log(
  JSON.stringify(
    {
      cases: report.cases.length,
      zoomCases: report.zoom.length,
      screenshots: report.screenshots.length,
      output,
    },
    null,
    2,
  ),
);
