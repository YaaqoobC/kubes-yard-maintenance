import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import site from '../app/content/site.json' with { type: 'json' };
import { seasonForDate } from '../app/season/season';
import { lawnCare, snowRemoval, formatPrice } from '../app/content/services';

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
        await page.evaluate(() =>
          window.scrollTo({ top: 700, behavior: 'instant' }),
        );
        expect((await page.getByRole('banner').boundingBox())?.y).toBe(0);
        await page.evaluate(() =>
          window.scrollTo({ top: 0, behavior: 'instant' }),
        );
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
  await page
    .getByRole('link', { name: 'Snow removal details & pricing', exact: true })
    .click();
  await expect(theme).toHaveValue('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await theme.selectOption('system');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.goto('/');
  await expect(
    page.getByRole('link', { name: 'Lawn care details & pricing' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', {
      name: 'Snow removal details & pricing',
      exact: true,
    }),
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
  const menu = page.getByRole('button', { name: /^(Open|Close) menu$/ });
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
  await expect(page.locator('main')).toBeFocused();
  await menu.click();
  await page.getByRole('banner').getByRole('link', { name: /home$/ }).click();
  await expect(page).toHaveURL('/');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('main')).toBeFocused();
  await page.goBack();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('public documents have unique metadata and production canonicals', async ({
  page,
  request,
}) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const route of routes) {
    const response = await request.get(route.path);
    const html = await response.text();
    expect(html).toContain('rel="canonical"');
    await page.goto(route.path);
    const canonical = `${site.origin}${route.path === '/' ? '/' : `${route.path}/`}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      canonical,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      canonical,
    );
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    titles.add(await page.title());
    descriptions.add(
      (await page.locator('meta[name="description"]').getAttribute('content'))!,
    );
    const copy = await page.locator('main').innerText();
    expect(copy).not.toMatch(/insured|24 hours|0\.5 cm|\d+ years|five.star/i);
  }
  expect(titles.size).toBe(routes.length);
  expect(descriptions.size).toBe(routes.length);
});

test('crawler files list exactly the public canonical URLs', async ({
  request,
}) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain(`Sitemap: ${site.origin}/sitemap.xml`);
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const urls = [...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (match) => match[1],
  );
  expect(urls).toEqual(
    site.publicPaths.map((path) => new URL(path, site.origin).href),
  );
});

for (const theme of ['light', 'dark'] as const) {
  test(`unknown URLs serve useful static 404 HTML: ${theme}`, async ({
    browser,
    page,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const staticPage = await context.newPage();
    const response = await staticPage.goto(
      'http://127.0.0.1:4173/a-missing-page',
    );
    expect(response?.status()).toBe(404);
    await expect(staticPage.getByRole('heading', { level: 1 })).toHaveText(
      'A little off the path.',
    );
    await expect(
      staticPage.getByRole('link', { name: 'Back to home' }),
    ).toHaveAttribute('href', '/');
    await context.close();
    await page.setViewportSize({ width: 320, height: 812 });
    await page.addInitScript(
      (value) => localStorage.setItem('kubes-theme', value),
      theme,
    );
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/a-missing-page');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, follow',
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.getByRole('link', { name: 'Back to home' }).click();
    await expect(page).toHaveURL('/');
    expect(errors).toEqual([]);
  });
}

test('quote CTA reaches real contact choices and focus stays visible', async ({
  page,
}) => {
  await page.goto('/');
  const quote = page.locator('.hero-actions').getByRole('link', {
    name: 'Request a quote',
    exact: true,
  });
  await expect(quote).toHaveAttribute('href', '/contact');
  await quote.focus();
  expect(
    await quote.evaluate((element) => getComputedStyle(element).outlineWidth),
  ).toBe('2px');
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await expect(page.locator('main a[href="tel:+17809198240"]')).toBeVisible();
  await expect(
    page.locator('main a[href="mailto:kubesym@gmail.com"]'),
  ).toBeVisible();
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

test('season rules cover every month and Edmonton midnight boundaries', () => {
  const expected = [
    'winter',
    'winter',
    'winter',
    'summer',
    'summer',
    'summer',
    'summer',
    'summer',
    'summer',
    'summer',
    'winter',
    'winter',
  ];
  for (let month = 1; month <= 12; month++) {
    expect(
      seasonForDate(
        new Date(`2026-${String(month).padStart(2, '0')}-15T12:00:00Z`),
      ),
    ).toBe(expected[month - 1]);
  }
  expect(seasonForDate(new Date('2026-04-01T05:59:59Z'))).toBe('winter');
  expect(seasonForDate(new Date('2026-04-01T06:00:00Z'))).toBe('summer');
  expect(seasonForDate(new Date('2026-11-01T05:59:59Z'))).toBe('summer');
  expect(seasonForDate(new Date('2026-11-01T06:00:00Z'))).toBe('winter');
  expect(
    seasonForDate(new Date('2026-06-01T12:00:00Z'), {
      timeZone: 'America/Edmonton',
      winterMonths: [6],
    }),
  ).toBe('winter');
});

for (const width of [320, 375, 768, 1024, 1440]) {
  for (const [date, season, other, href] of [
    ['2026-01-15T12:00:00Z', 'winter', 'Summer', '/snow-removal'],
    ['2026-07-15T12:00:00Z', 'summer', 'Winter', '/lawn-care'],
  ] as const) {
    test(`homepage features ${season} before hydration, and manual choice works at ${width}px`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        timezoneId: 'Pacific/Auckland',
        viewport: { width, height: 900 },
      });
      const page = await context.newPage();
      await page.clock.setFixedTime(new Date(date));
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      // Block hydration. The head bootstrap must make the correct choice on its own.
      await page.route('**/assets/*.js', (route) => route.abort());
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute(
        'data-featured-season',
        season,
      );
      const primary = page.locator(
        '.hero-actions .action-link--primary:visible',
      );
      await expect(primary).toHaveAttribute('href', href);
      await page.evaluate(() => document.fonts.ready);
      const artPosition = () =>
        page.locator('.hero-art').evaluate((element) => {
          const box = element.getBoundingClientRect();
          return {
            x: box.x + scrollX,
            y: box.y + scrollY,
            width: box.width,
            height: box.height,
          };
        });
      const before = await artPosition();
      await page.unroute('**/assets/*.js');
      errors.length = 0;
      await page.reload();
      await page.evaluate(() => document.fonts.ready);
      const selected = page.getByRole('button', {
        name: season === 'winter' ? 'Winter' : 'Summer',
        exact: true,
      });
      await expect(selected).toHaveAttribute('aria-pressed', 'true');
      expect(await artPosition()).toEqual(before);
      await page.getByRole('button', { name: other, exact: true }).click();
      await expect(page.locator('html')).toHaveAttribute(
        'data-featured-season',
        season === 'winter' ? 'summer' : 'winter',
      );
      expect(await artPosition()).toEqual(before);
      await primary.click();
      await expect(page).toHaveURL(
        new RegExp(other === 'Summer' ? '/lawn-care$' : '/snow-removal$'),
      );
      expect(errors).toEqual([]);
      await context.close();
    });
  }
}

test('published prices and limits match the approved brief', async ({
  page,
}) => {
  const expected = [
    {
      path: '/lawn-care',
      data: lawnCare,
      prices: [
        '$60',
        '$175/month',
        '$100/month',
        '$150',
        '$250',
        '$60/hour',
        '$15/bag',
        '$20/bag',
        '$75',
        '$100',
        '$125',
        '$50/hour',
        '$50/hour',
      ],
    },
    {
      path: '/snow-removal',
      data: snowRemoval,
      prices: ['$150/month', '$50/hour', '+$30', '+$65'],
    },
  ];
  for (const item of expected) {
    const actual = item.data.sections.flatMap((section) =>
      section.tiers.flatMap((tier) =>
        tier.price ? [formatPrice(tier.price)] : [],
      ),
    );
    expect(actual).toEqual(item.prices);
    await page.goto(item.path);
    await expect(page.locator('.price').filter({ hasText: /\$/ })).toHaveText(
      item.prices,
    );
  }
  await page.goto('/lawn-care');
  await expect(page.locator('#aeration h3')).toHaveText([
    'Up to 3,000 sq ft',
    'Over 3,000 to 6,000 sq ft',
    'Over 6,000 to 9,000 sq ft',
    'Over 9,000 sq ft',
  ]);
  await expect(page.locator('#spring-cleanup')).toContainText(
    'Both packages include: first mow and trim, power raking, rock bed blowout, debris bagging.',
  );
  await expect(page.locator('#additional-services')).toContainText(
    'left on the driveway',
  );
  await expect(page.locator('#acreage')).toContainText('1–2 hours per acre');
});

test('mobile theme, focus exit, hamburger and reduced motion work together', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const menu = page.getByRole('button', { name: /^(Open|Close) menu$/ });
  const theme = page.getByRole('combobox', { name: 'Color theme' });
  await expect(theme).toBeHidden();
  await menu.click();
  await expect(theme).toBeVisible();
  await theme.selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(
    await page
      .locator('.hamburger i')
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe('0s');
  expect(
    await page
      .locator('.hamburger i')
      .nth(1)
      .evaluate((el) => getComputedStyle(el).opacity),
  ).toBe('0');
  await theme.focus();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: /Request a quote/ })
    .click();
  await expect(page).toHaveURL('/contact');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await expect(theme).toHaveValue('dark');
  await page.locator('main').focus();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('service anchors clear the sticky header and all internal destinations resolve', async ({
  page,
  request,
}) => {
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/lawn-care', '/snow-removal']) {
      await page.goto(path);
      await page.locator('.service-jump-links a').first().click();
      await page.waitForFunction(
        () =>
          Math.abs(
            document.querySelector('.service-section')!.getBoundingClientRect()
              .top - 128,
          ) < 18,
      );
      const header = await page.getByRole('banner').boundingBox();
      const target = await page
        .locator('.service-section')
        .first()
        .boundingBox();
      expect(target!.y).toBeGreaterThanOrEqual(header!.height);
    }
  }
  const links = new Set<string>();
  for (const route of routes) {
    await page.goto(route.path);
    for (const href of await page
      .locator('a')
      .evaluateAll((elements) =>
        elements.map((el) => el.getAttribute('href')!),
      )) {
      if (href.startsWith('#')) await expect(page.locator(href)).toHaveCount(1);
      if (href.startsWith('/')) links.add(href);
    }
  }
  for (const href of links)
    expect((await request.get(href)).status(), href).toBe(200);
});
