import { expect, type Page } from '@playwright/test';

export async function openThemeOptions(page: Page) {
  const trigger = page.getByRole('button', { name: 'Choose color theme' });
  if (await trigger.isVisible()) {
    if ((await trigger.getAttribute('aria-expanded')) !== 'true')
      await trigger.click();
  } else if (
    !(await page.getByRole('menu', { name: 'Color theme' }).isVisible())
  ) {
    await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  }
}
export async function chooseTheme(
  page: Page,
  value: 'light' | 'dark' | 'system',
) {
  await openThemeOptions(page);
  await page
    .getByRole('menuitemradio', { name: new RegExp(`^${value}$`, 'i') })
    .click();
}
export async function expectThemePreference(
  page: Page,
  value: 'light' | 'dark' | 'system',
) {
  await openThemeOptions(page);
  await expect(
    page.getByRole('menuitemradio', { name: new RegExp(`^${value}$`, 'i') }),
  ).toHaveAttribute('aria-checked', 'true');
}
