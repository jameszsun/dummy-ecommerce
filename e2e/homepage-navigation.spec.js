const { test, expect } = require('@playwright/test');

test.describe('Homepage and Navigation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should load homepage successfully', async ({ page }) => {
		await expect(page).toHaveTitle(/Themerc/i);
		
		// Check for main elements
		await expect(page.locator('header, .App > div').first()).toBeVisible();
		await expect(page.locator('footer, .App > div').last()).toBeVisible();
	});

	test('should display header with logo and navigation', async ({ page }) => {
		// Check logo exists (may be hidden on small viewports)
		await expect(page.locator('img[alt*="logo"]').first()).toBeAttached();
		
		// Check navigation menu - Shop link
		await expect(page.getByRole('link', { name: /shop/i })).toBeVisible();
	});

	test('should navigate to shop page', async ({ page }) => {
		await page.getByRole('link', { name: /shop/i }).first().click();
		await expect(page).toHaveURL(/.*\/shop/);
		
		// Wait for products to load
		await page.waitForTimeout(3000);
		const hasProducts = await page.getByRole('button', { name: /add to cart/i }).count() > 0;
		expect(hasProducts).toBeTruthy();
	});

	test('should navigate to cart page', async ({ page }) => {
		// Find cart link in the navigation
		const cartLink = page.locator('a[href="/cart"]');
		await cartLink.click();
		await expect(page).toHaveURL(/.*\/cart/);
	});

	test('should show empty cart initially', async ({ page }) => {
		await page.locator('a[href="/cart"]').click();
		
		// Check for empty cart message
		await expect(page.getByText(/your cart is empty/i)).toBeVisible();
	});

	test('should display footer', async ({ page }) => {
		// Check for copyright link in footer
		await expect(page.getByRole('link', { name: /themerc/i })).toBeVisible();
		
		// Check for social buttons
		await expect(page.getByRole('button', { name: /facebook/i })).toBeVisible();
	});

	test('should have working logo link to homepage', async ({ page }) => {
		// Navigate to shop first
		await page.getByRole('link', { name: /shop/i }).first().click();
		await expect(page).toHaveURL(/.*\/shop/);
		
		// Wait for logo link to be clickable, then click
		const logoLink = page.locator('a[href="/"]').first();
		await logoLink.waitFor({ state: 'visible', timeout: 5000 });
		await logoLink.click();
		await expect(page).toHaveURL(/^.*\/$/);
	});
});
