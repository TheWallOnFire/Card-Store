import { test, expect } from '@playwright/test';

test.describe('Marketplace Flow', () => {
  test('Search, Filter, and Add to Cart', async ({ page }) => {
    // 1. Navigate to search page
    await page.goto('/search');
    
    // 2. Search for a card
    const searchInput = page.getByPlaceholder(/search cards/i);
    await searchInput.fill('Black Lotus');
    await searchInput.press('Enter');
    
    // 3. Filter by Rarity
    // Default state: Rarity group is open. Just click the 'Rare' option.
    // Radix UI checkboxes use role="checkbox" on a button, so we use click() instead of check().
    const rareFilter = page.getByLabel(/rare/i).first();
    await expect(rareFilter).toBeVisible();
    await rareFilter.click();
    
    // 4. Select a Listing
    const firstCard = page.locator('a[href*="/product/"]').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();
    
    // 5. Add to Cart
    const addToCartBtn = page.getByRole('button', { name: /add to collection/i });
    await expect(addToCartBtn).toBeEnabled();
    await addToCartBtn.click();
    
    // 6. Verify total price in Drawer
    const drawer = page.getByText(/your bag/i);
    await expect(drawer).toBeVisible();
    
    const totalDisplay = page.locator('span:has-text("$")').last();
    await expect(totalDisplay).not.toHaveText('$0.00');

    // 7. Visual Regression Check
    // We will use a descriptive name for the snapshot
    await expect(page).toHaveScreenshot('marketplace-product-page.png', {
        mask: [page.locator('.animate-pulse')], // Mask loading states
    });
  });
});
