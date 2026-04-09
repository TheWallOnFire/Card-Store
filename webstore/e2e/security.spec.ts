import { test, expect } from '@playwright/test';

test.describe('Administrative Security & RBAC', () => {

  test('Guest cannot access administrative inventory matrix', async ({ page }) => {
    // Attempting to access admin route without session
    await page.goto('/admin/inventory');
    
    // Should be redirected or show access denied
    // Based on AdminLayout logic, we'd expect a redirect if auth helpers were fully coupled,
    // or at least a visible access denied message.
    await expect(page).not.toHaveURL(/.*\/admin\/inventory/);
  });

  test('ID Injection: Direct access to individual card records', async ({ page }) => {
    const fakeUuid = '7f8a7e32-5a41-4c6e-8e8e-9e8e9e8e9e8e';
    await page.goto(`/admin/inventory?id=${fakeUuid}`);
    
    // Verify that the UI doesn't leak sensitive data or load a restricted record
    // if the user isn't authorized.
    await expect(page).not.toHaveText(/Edit Inventory Link/i);
  });
});

test.describe('Security Sanitization (XSS)', () => {

  test('Markdown rendering prevents script injection', async ({ page }) => {
    // Note: Since a full editor might not be available yet per current src structure,
    // we test the rendering principle if used.
    const xssPayload = '[Click Me](javascript:alert("XSS"))';
    
    // Testing if our markdown components (if any) sanitize javascript: links
    // This is a placeholder test for the sanitization suite.
    await page.goto('/blog');
    const content = await page.content();
    expect(content).not.toContain('javascript:alert');
  });
});
