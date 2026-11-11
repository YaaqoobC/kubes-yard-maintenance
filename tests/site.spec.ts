import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = [
  { path: '/', heading: 'Good yards. Clear paths. Every season.' },
  { path: '/lawn-care', heading: 'Lawn & yard care.' },
  { path: '/snow-removal', heading: 'Snow removal.' },
  { path: '/about', heading: 'Care for the place you call home.' },
  { path: '/contact', heading: 'A good place to start.' },
];

for (const route of routes) {
  test(`static HTML works without JavaScript: ${route.path}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    const response = await page.goto(`http://127.0.0.1:4173${route.path}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      route.heading,
      { useInnerText: true },
    );
    await expect(
      page.locator('a[href="tel:+17809198240"]').first(),
    ).toBeVisible();
    await expect(
      page.locator('a[href="mailto:kubesym@gmail.com"]').first(),
    ).toBeVisible();
    await expect(page).toHaveTitle(/Kube’s Yard Maintenance/);
    await context.close();
  });
}

for (const theme of ['light', 'dark'] as const) {
  test(`all routes fit requested screen sizes: ${theme}`, async ({ page }) => {
    await page.addInitScript(
      (value) => localStorage.setItem('kubes-theme', value),
      theme,
    );
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of routes) {
        await page.goto(route.path);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        const size = await page.evaluate(() => ({
          scroll: document.documentElement.scrollWidth,
          viewport: window.innerWidth,
        }));
        expect(
          size.scroll,
          `${route.path} at ${width}px in ${theme}`,
        ).toBeLessThanOrEqual(size.viewport);
        const brokenImages = await page
          .locator('img')
          .evaluateAll(
            (images) =>
              images.filter(
                (image) =>
                  image instanceof HTMLImageElement &&
                  (!image.complete || image.naturalWidth === 0),
              ).length,
          );
        expect(brokenImages).toBe(0);
      }
    }
    expect(errors).toEqual([]);
  });

  test(`public pages pass automated accessibility scan: ${theme}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.addInitScript(
      (value) => localStorage.setItem('kubes-theme', value),
      theme,
    );
    for (const route of routes) {
      await page.goto(route.path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(results.violations, `${route.path} in ${theme}`).toEqual([]);
    }
  });
}

test('theme persists, follows system changes, and does not change seasonal content', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const theme = page.getByRole('combobox', { name: 'Color theme' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(theme).toHaveValue('system');
  await theme.selectOption('light');
  await page.reload();
  await expect(theme).toHaveValue('light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await theme.selectOption('dark');
  await page.getByRole('link', { name: 'Explore snow removal' }).click();
  await expect(theme).toHaveValue('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await theme.selectOption('system');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.goto('/');
  await expect(
    page.getByRole('link', { name: 'Explore lawn & yard care' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Explore snow removal' }),
  ).toBeVisible();
});

test('mobile navigation supports keyboard, Escape, and route changes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  const menu = page.getByRole('button', { name: /^(Menu|Close)$/ });
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Tab');
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(
    nav.getByRole('link', { name: 'Lawn & yard care' }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await nav.getByRole('link', { name: 'Snow removal' }).click();
  await expect(page).toHaveURL(/\/snow-removal$/);
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Snow removal.',
  );
});

test('theme storage failure is safe and reduced motion removes transitions', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('Storage blocked');
    };
    Storage.prototype.getItem = () => {
      throw new Error('Storage blocked');
    };
  });
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto('/');
  await page
    .getByRole('combobox', { name: 'Color theme' })
    .selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(
    await page
      .locator('.arrow')
      .first()
      .evaluate((element) => getComputedStyle(element).transitionDuration),
  ).toBe('0s');
});

test('homepage contains no placeholder or broken internal actions', async ({
  page,
}) => {
  await page.goto('/');
  const links = await page
    .locator('a')
    .evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('href')),
    );
  for (const href of links) {
    expect(href).toBeTruthy();
    expect(href).not.toBe('#');
    if (href?.startsWith('#')) await expect(page.locator(href)).toHaveCount(1);
    if (href?.startsWith('/'))
      expect(routes.some((route) => route.path === href)).toBe(true);
  }
  await expect(page.locator('form')).toHaveCount(0);
});
