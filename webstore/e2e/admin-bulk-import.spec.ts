import { test, expect } from '@playwright/test';

test.describe('Admin Bulk Import Flow', () => {
    test('Login and Bulk Paste Validation', async ({ page }) => {
        // 1. Mock Login (Assuming dev environment bypass or simple form)
        await page.goto('/admin/bulk-import');
        
        // 2. Prepare 50 lines of mixed valid/invalid data
        const bulkData = Array.from({ length: 50 }, (_, i) => {
            if (i % 10 === 0) return `invalid_card_${i}_1`; // Malformed
            return `ygo_001_${i + 1}`; // Valid
        }).join('\n');

        // 3. Paste into Terminal
        const terminal = page.locator('textarea');
        await terminal.fill(bulkData);

        // 4. Verify Validation Preview
        const preview = page.locator('.bg-white.rounded-3xl.border'); // The preview container
        await expect(preview).toBeVisible();

        const invalidBadges = page.locator('span:has-text("INVALID")');
        const invalidCount = await invalidBadges.count();
        expect(invalidCount).toBeGreaterThanOrEqual(5);

        // 5. Submit and check for loading state
        const submitBtn = page.getByRole('button', { name: /sync/i });
        await expect(submitBtn).toBeEnabled();
        await submitBtn.click();

        await expect(page.locator('.animate-spin')).toBeVisible();
    });

    test('Responsive Mobile Sidebar', async ({ page, isMobile }) => {
        test.skip(!isMobile, 'This test is for mobile viewports only');
        
        await page.goto('/search');
        
        // Check if filter button is present instead of full sidebar
        const filterBtn = page.getByRole('button', { name: /filter/i });
        await expect(filterBtn).toBeVisible();
        await filterBtn.click();
        
        // Verify overlay/drawer appears
        const drawer = page.locator('aside');
        await expect(drawer).toBeVisible();
    });
});
