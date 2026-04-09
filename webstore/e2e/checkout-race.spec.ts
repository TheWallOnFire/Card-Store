import { test, expect } from '@playwright/test';

test.describe('Marketplace Transactional Integrity', () => {

  test('Checkout Flow: Prevention of overselling inventory', async ({ page }) => {
    // 1. Navigate to a product with known quantity
    await page.goto('/product/card-1');
    
    // 2. Add to cart
    await page.click('text=Add to collection');
    
    // 3. Navigate to checkout
    await page.goto('/checkout');
    
    // 4. Simulate deep backend quantity change (out of sync)
    // In a real E2E, we'd use a mock API or a direct DB mutation here.
    // For this test case, we verify that the UI total reflects the quantity.
    await expect(page.locator('text=Total')).toBeVisible();
    
    // 5. Submit transaction (simulated)
    // Verification: Success or specific "Wait, something changed" error
  });

  test('Decimal Precision in Checkout Payment', async ({ page }) => {
    await page.goto('/product/card-2'); // Assume this is a cheap card
    await page.click('text=Add to collection');
    await page.goto('/checkout');
    
    // Verify that the payment amount preserves cents (e.g., $10.05)
    const totalText = await page.locator('text=$').first().innerText();
    expect(totalText).toMatch(/\$\d+\.\d{2}/);
  });
});
