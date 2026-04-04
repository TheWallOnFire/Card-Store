import { test, expect, Page } from '@playwright/test';

test('Marketplace navigation and search', async ({ page }: { page: Page }) => {
  await page.goto('/');

  // Check for the premium hero section
  await expect(page.locator('h1')).toContainText(/THE WALL/i);

  // Navigate to search
  await page.click('text=Marketplace');
  await expect(page).toHaveURL(/.*search/);

  // Check search results
  const cardCount = await page.locator('.product-card').count();
  expect(cardCount).toBeGreaterThan(0);

  // Apply a filter (simulated)
  await page.type('input[placeholder*="Search"]', 'Charizard');
  // In a real test, we'd wait for URL update or use debounce
});

test('Product detail page and cart', async ({ page }: { page: Page }) => {
  await page.goto('/product/card-1');

  // Verify product details
  await expect(page.locator('h1')).toContainText(/Charizard/i);
  await expect(page.locator('text=Market Price')).toBeVisible();

  // Add to cart
  await page.click('text=Add to collection');
  
  // Verify cart indicator (if exists)
  // await expect(page.locator('.cart-count')).toHaveText('1');
});
