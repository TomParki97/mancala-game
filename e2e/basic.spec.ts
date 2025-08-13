import { test, expect } from '@playwright/test';

test('play one move', async ({ page }) => {
  await page.goto('http://localhost:4173/');
  await page.click('text=New');
  const firstPit = page.locator('div[role=button]').first();
  await firstPit.click();
  await expect(page.locator('body')).toContainText('Player');
});
