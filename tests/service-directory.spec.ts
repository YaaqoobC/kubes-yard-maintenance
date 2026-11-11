import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  lawnCare,
  snowRemoval,
  serviceQuestions,
} from '../app/content/services';

const pages = [
  { path: '/lawn-care', service: lawnCare, middle: 'aeration' },
  { path: '/snow-removal', service: snowRemoval, middle: 'snow-add-ons' },
];
const directory = (page: Page) =>
  page.getByRole('navigation', { name: /service directory$/ });
async function selectService(page: Page, id: string, width: number) {
  if (width < 1000)
    await directory(page)
      .getByRole('combobox', { name: 'Jump to service' })
      .selectOption(id);
  else await directory(page).locator(`a[href$="#${id}"]`).click();
  await expect(page).toHaveURL(new RegExp(`#${id}$`));
  await expect(
    directory(page).locator('a[aria-current="location"]'),
  ).toHaveAttribute('href', new RegExp(`#${id}$`));
}
async function scrollToService(page: Page, id: string) {
  await page.evaluate(
    (value) =>
      document
        .getElementById(value)
        ?.scrollIntoView({ behavior: 'instant', block: 'start' }),
    id,
  );
  await expect(
    directory(page).locator('a[aria-current="location"]'),
  ).toHaveAttribute('href', new RegExp(`#${id}$`));
}
async function expectHeadingClear(page: Page, id: string, compact: boolean) {
  const heading = await page.locator(`#${id} h2`).boundingBox();
  const header = await page.getByRole('banner').boundingBox();
  const nav = await directory(page).boundingBox();
  expect(heading!.y).toBeGreaterThanOrEqual(
    compact ? nav!.y + nav!.height - 1 : header!.height,
  );
}

for (const width of [320, 375, 768, 1024, 1440]) {
  for (const theme of ['light', 'dark'] as const) {
    test(`service navigation stays bounded and tracks sections: ${width}px ${theme}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(
        (value) => localStorage.setItem('kubes-theme', value),
        theme,
      );
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      for (const item of pages) {
        await page.goto(item.path);
        await page.evaluate(() => document.fonts.ready);
        const nav = directory(page);
        const header = await page.getByRole('banner').boundingBox();
        expect((await nav.boundingBox())!.y).toBeGreaterThan(header!.height);
        const items = [...item.service.sections, serviceQuestions];
        expect(
          await nav
            .locator('a')
            .evaluateAll((links) =>
              links.map(
                (link) =>
                  new URL(link.getAttribute('href')!, location.href).hash,
              ),
            ),
        ).toEqual(items.map((section) => `#${section.id}`));
        const picker = nav.getByRole('combobox', { name: 'Jump to service' });
        if (width < 1000) {
          await expect(picker).toBeVisible();
          await expect(nav.locator('.service-directory-links')).toBeHidden();
          expect((await picker.boundingBox())!.height).toBeGreaterThanOrEqual(
            44,
          );
        } else {
          await expect(picker).toBeHidden();
          await expect(nav.locator('.service-directory-links')).toBeVisible();
        }
        await scrollToService(page, item.service.sections[0]!.id);
        await page.evaluate(() =>
          window.scrollBy({ top: 32, behavior: 'instant' }),
        );
        const sticky = await nav.boundingBox();
        const expectedTop = await nav.evaluate((el) =>
          parseFloat(getComputedStyle(el).top),
        );
        expect(sticky!.y).toBeCloseTo(expectedTop, 0);
        await scrollToService(page, item.middle);
        await expectHeadingClear(page, item.middle, width < 1000);
        const active = nav.locator('a[aria-current="location"]');
        expect(
          await active.evaluate(
            (el) => getComputedStyle(el).textDecorationLine,
          ),
        ).toContain('underline');
        if (width >= 1000) {
          const content = await page.locator('.service-content').boundingBox();
          expect(
            (await nav.boundingBox())!.x + (await nav.boundingBox())!.width,
          ).toBeLessThan(content!.x);
        } else {
          await expect(picker).toHaveValue(item.middle);
          const before = await page
            .locator('.service-layout')
            .evaluate((el) => el.getBoundingClientRect().height);
          await page
            .getByRole('button', { name: 'Open menu', exact: true })
            .click();
          await expect(nav).toBeHidden();
          await page.keyboard.press('Escape');
          await expect(
            page.getByRole('button', { name: 'Open menu', exact: true }),
          ).toBeFocused();
          await expect(nav).toBeVisible();
          expect(
            await page
              .locator('.service-layout')
              .evaluate((el) => el.getBoundingClientRect().height),
          ).toBe(before);
        }
        await selectService(page, item.service.sections[0]!.id, width);
        await expect(
          page.locator(`#${item.service.sections[0]!.id} h2`),
        ).toBeFocused();
        await expectHeadingClear(
          page,
          item.service.sections[0]!.id,
          width < 1000,
        );
        expect(
          (
            await new AxeBuilder({ page })
              .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
              .analyze()
          ).violations,
        ).toEqual([]);
        await page.evaluate(() => {
          const contact = document
            .querySelector('.contact-cta')!
            .getBoundingClientRect();
          window.scrollTo({
            top:
              contact.top +
              scrollY -
              document.querySelector('.site-header')!.getBoundingClientRect()
                .height,
            behavior: 'instant',
          });
        });
        const released = await nav.boundingBox();
        const contact = await page.locator('.contact-cta').boundingBox();
        expect(released!.y + released!.height).toBeLessThanOrEqual(
          contact!.y + 1,
        );
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
      expect(errors).toEqual([]);
    });
  }
}

for (const width of [320, 1440]) {
  test(`direct hashes, refresh and history preserve clear service headings at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const item of pages) {
      await page.goto(`${item.path}#${item.middle}`);
      await expect(
        directory(page).locator('a[aria-current="location"]'),
      ).toHaveAttribute('href', new RegExp(`#${item.middle}$`));
      await expectHeadingClear(page, item.middle, width < 1000);
      await page.reload();
      await expect(
        directory(page).locator('a[aria-current="location"]'),
      ).toHaveAttribute('href', new RegExp(`#${item.middle}$`));
      await expectHeadingClear(page, item.middle, width < 1000);
      await selectService(page, serviceQuestions.id, width);
      await expectHeadingClear(page, serviceQuestions.id, width < 1000);
      await page.goBack();
      await expect(page).toHaveURL(new RegExp(`#${item.middle}$`));
      await expect(
        directory(page).locator('a[aria-current="location"]'),
      ).toHaveAttribute('href', new RegExp(`#${item.middle}$`));
      await expectHeadingClear(page, item.middle, width < 1000);
      await page.goForward();
      await expect(page).toHaveURL(/#service-faq$/);
      await expect(
        directory(page).locator('a[aria-current="location"]'),
      ).toHaveAttribute('href', /#service-faq$/);
      await expectHeadingClear(page, serviceQuestions.id, width < 1000);
    }
  });
}

test('service navigation supports keyboard and progressive static HTML', async ({
  page,
  browser,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/lawn-care');
  const link = directory(page).getByRole('link', {
    name: 'Aeration',
    exact: true,
  });
  await link.focus();
  expect(await link.evaluate((el) => getComputedStyle(el).outlineWidth)).toBe(
    '2px',
  );
  await page.keyboard.press('Enter');
  await expect(page.locator('#aeration h2')).toBeFocused();
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/lawn-care#aeration');
  const picker = directory(page).getByRole('combobox', {
    name: 'Jump to service',
  });
  await expect(picker).toHaveValue('aeration');
  await expect(page.locator('#aeration h2')).toBeFocused();
  await picker.focus();
  expect(await picker.evaluate((el) => getComputedStyle(el).outlineWidth)).toBe(
    '2px',
  );
  await page.keyboard.press('Tab');
  await expect(page.locator('.faq-list summary').first()).toBeFocused();
  // Popup key simulation does not emit change in macOS headless Chrome.
  // Use Playwright's native-select API to exercise the committed change.
  await picker.selectOption('acreage');
  await expect(page).toHaveURL(/#acreage$/);
  await expect(page.locator('#acreage h2')).toBeFocused();
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 900 },
  });
  const staticPage = await context.newPage();
  await staticPage.goto('http://127.0.0.1:4173/snow-removal');
  await expect(
    directory(staticPage).getByRole('link', { name: 'Additional charges' }),
  ).toBeVisible();
  await directory(staticPage)
    .getByRole('link', { name: 'Additional charges' })
    .click();
  await expect(staticPage).toHaveURL(/#snow-add-ons$/);
  await expectHeadingClear(staticPage, 'snow-add-ons', false);
  await context.close();
});

test('picker reappears when resizing out of an expanded mobile site menu', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/snow-removal');
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await expect(directory(page)).toBeHidden();
  await page.setViewportSize({ width: 900, height: 900 });
  await expect(
    page.getByRole('button', { name: 'Close menu', exact: true }),
  ).toBeHidden();
  await expect(
    directory(page).getByRole('combobox', { name: 'Jump to service' }),
  ).toBeVisible();
});
