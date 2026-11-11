import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHash } from 'node:crypto';
import assets from '../app/content/favicons.json' with { type: 'json' };
import { pageContextForPath, seasonForPage } from '../app/season/season';
import { chooseTheme } from './theme-helpers';

const paths = ['/', '/lawn-care', '/snow-removal', '/about', '/contact'];

test('route-season rules include shared pages, trailing slashes and missing pages', () => {
  for (const featured of ['summer', 'winter'] as const) {
    for (const path of ['/', '/about', '/contact', '/missing-page'])
      expect(seasonForPage(pageContextForPath(path), featured)).toBe(featured);
    expect(seasonForPage(pageContextForPath('/lawn-care/'), featured)).toBe(
      'summer',
    );
    expect(seasonForPage(pageContextForPath('/snow-removal/'), featured)).toBe(
      'winter',
    );
  }
});

for (const [date, featured] of [
  ['2026-01-15T12:00:00Z', 'winter'],
  ['2026-07-15T12:00:00Z', 'summer'],
] as const) {
  test(`direct favicon is correct before and after hydration: ${featured}`, async ({
    page,
  }) => {
    await page.clock.setFixedTime(new Date(date));
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (
        message.type() === 'error' &&
        /hydration|minified React/i.test(message.text())
      )
        errors.push(message.text());
    });
    const icon = page.locator('link[rel="icon"]');
    for (const path of paths) {
      const season =
        path === '/lawn-care'
          ? 'summer'
          : path === '/snow-removal'
            ? 'winter'
            : featured;
      await page.route('**/assets/*.js', (route) => route.abort());
      await page.goto(path);
      await expect(icon).toHaveCount(1);
      await expect(icon).toHaveAttribute('href', assets[season]['64']);
      await page.unroute('**/assets/*.js');
      await page.reload();
      await expect(
        page.getByRole('button', { name: 'Choose color theme' }),
      ).toBeVisible();
      await expect(icon).toHaveAttribute('href', assets[season]['64']);
    }
    expect(errors).toEqual([]);
  });
}

test('favicon follows client navigation, history, manual season, and refresh independently of theme', async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date('2026-01-15T12:00:00Z'));
  await page.goto('/');
  const icon = page.locator('link[rel="icon"]');
  await expect(icon).toHaveAttribute('href', assets.winter['64']);
  await page.getByRole('button', { name: 'Summer', exact: true }).click();
  await expect(icon).toHaveAttribute('href', assets.summer['64']);
  const nav = page.locator('.nav-links');
  await nav.getByRole('link', { name: 'About', exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(icon).toHaveAttribute('href', assets.summer['64']);
  await nav.getByRole('link', { name: 'Snow removal', exact: true }).click();
  await expect(page).toHaveURL(/\/snow-removal$/);
  await expect(icon).toHaveAttribute('href', assets.winter['64']);
  await page.goBack();
  await expect(page).toHaveURL(/\/about$/);
  await expect(icon).toHaveAttribute('href', assets.summer['64']);
  await page.goForward();
  await expect(page).toHaveURL(/\/snow-removal$/);
  await expect(icon).toHaveAttribute('href', assets.winter['64']);
  await chooseTheme(page, 'dark');
  await expect(icon).toHaveAttribute('href', assets.winter['64']);
  await nav
    .getByRole('link', { name: 'Lawn & yard care', exact: true })
    .click();
  await expect(icon).toHaveAttribute('href', assets.summer['64']);
  await nav.getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(icon).toHaveAttribute('href', assets.summer['64']);
  await page.reload();
  await expect(icon).toHaveAttribute('href', assets.winter['64']);
  await expect(icon).toHaveCount(1);
});

test('generated favicon assets have real square dimensions and content hashes; static fallback works', async ({
  browser,
  request,
}) => {
  for (const season of ['summer', 'winter'] as const) {
    for (const size of [16, 32, 64] as const) {
      const path = assets[season][size];
      const response = await request.get(path);
      expect(response.status()).toBe(200);
      const body = await response.body();
      expect(body.subarray(1, 4).toString()).toBe('PNG');
      expect(body.readUInt32BE(16)).toBe(size);
      expect(body.readUInt32BE(20)).toBe(size);
      expect(path).toContain(
        createHash('sha256').update(body).digest('hex').slice(0, 10),
      );
    }
  }
  const ico = await request.get('/favicon.ico');
  expect(ico.status()).toBe(200);
  expect((await ico.body()).readUInt16LE(2)).toBe(1);
  expect((await ico.body()).readUInt16LE(4)).toBe(3);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const [path, season] of [
    ['/lawn-care', 'summer'],
    ['/snow-removal', 'winter'],
    ['/about', 'summer'],
  ] as const) {
    await page.goto(`http://127.0.0.1:4173${path}`);
    await expect(page.locator('link[rel="icon"]')).toHaveCount(1);
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
      'href',
      assets[season]['64'],
    );
  }
  await context.close();
});

test('quote actions are arrow-free, consistent filled buttons, and keep their destinations on every route', async ({
  page,
}) => {
  for (const path of paths) {
    await page.goto(path);
    const quotes = page.getByRole('link', {
      name: 'Request a Quote',
      exact: true,
    });
    expect(await quotes.count()).toBeGreaterThan(0);
    for (const quote of await quotes.all()) {
      await expect(quote).toHaveAttribute('href', '/contact');
      await expect(quote.locator('svg')).toHaveCount(0);
    }
    const button = page
      .getByRole('banner')
      .getByRole('link', { name: 'Request a Quote', exact: true });
    await expect(button).toHaveClass(/action-link--primary/);
    expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await button.focus();
    expect(
      await button.evaluate((el) => getComputedStyle(el).outlineWidth),
    ).toBe('2px');
  }
});

test('desktop appearance menu supports keyboard, focus, dismissal, system icon and OS updates', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Choose color theme' });
  const menu = page.getByRole('menu', { name: 'Color theme' });
  await expect(menu).toBeHidden();
  await expect(page.locator('.theme-effective-dark')).toBeVisible();
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(
    page.getByRole('menuitemradio', { name: 'System', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Home');
  await expect(
    page.getByRole('menuitemradio', { name: 'Light', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(trigger).toBeFocused();
  await expect(menu).toBeHidden();
  await expect(page.locator('.theme-effective-light')).toBeVisible();
  await trigger.click();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(menu).toBeHidden();
  await trigger.click();
  await page.locator('h1').click();
  await expect(menu).toBeHidden();
  await trigger.click();
  await page.keyboard.press('Tab');
  await expect(menu).toBeHidden();
  await chooseTheme(page, 'system');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('.theme-effective-light')).toBeVisible();
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('.theme-effective-dark')).toBeVisible();
  await trigger.click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
});

for (const width of [320, 375, 768]) {
  test(`mobile appearance options stay in hamburger and fit at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 640 });
    await page.goto('/snow-removal');
    await expect(
      page.getByRole('button', { name: 'Choose color theme' }),
    ).toBeHidden();
    await page.getByRole('button', { name: 'Open menu', exact: true }).click();
    for (const value of ['light', 'dark', 'system'] as const) {
      await chooseTheme(page, value);
      const item = page.getByRole('menuitemradio', {
        name: new RegExp(`^${value}$`, 'i'),
      });
      await expect(item).toHaveAttribute('aria-checked', 'true');
      expect((await item.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      const box = await item.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    }
    const quote = page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Request a Quote', exact: true });
    await expect(quote).toBeVisible();
    expect(
      (await quote.boundingBox())!.y + (await quote.boundingBox())!.height,
    ).toBeLessThanOrEqual(640);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(
      page.getByRole('button', { name: 'Open menu', exact: true }),
    ).toBeFocused();
  });
}

test('effective appearance icon and theme are correct before hydration', async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem('kubes-theme', 'dark'));
  await page.emulateMedia({ colorScheme: 'light' });
  await page.route('**/assets/*.js', (route) => route.abort());
  await page.goto('/lawn-care');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('.theme-effective-dark')).toBeVisible();
  await expect(page.locator('.theme-effective-light')).toBeHidden();
});
