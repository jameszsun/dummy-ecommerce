const { test, expect } = require('@playwright/test');

test.describe('Product Browsing and Details', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/shop');
		// Wait for products to load from API
		await page.waitForTimeout(3000);
	});

	test('should display product list in shop', async ({ page }) => {
		// Check that add to cart buttons are displayed (indicates products loaded)
		const addToCartButtons = page.getByRole('button', { name: /add to cart/i });
		await expect(addToCartButtons.first()).toBeVisible();
		
		const count = await addToCartButtons.count();
		expect(count).toBeGreaterThan(0);
	});

	test('should display product information on cards', async ({ page }) => {
		// Check for product images
		const productImages = page.locator('img[alt*="kitchen"], img[alt*="smartphone"], img[alt*="laptop"]');
		await expect(productImages.first()).toBeVisible();
		
		// Check for add to cart button (indicates product cards are rendered)
		await expect(page.getByRole('button', { name: /add to cart/i }).first()).toBeVisible();
		
		// Check for price - should have $ symbol
		const pageText = await page.textContent('body');
		expect(pageText).toMatch(/\$\d+/);
	});

	test('should navigate to product details page', async ({ page }) => {
		// Click on first product link (product title/image)
		const productLinks = page.locator('a[href^="/shop/product/"]');
		await productLinks.first().click();
		
		// Should navigate to product detail page
		await expect(page).toHaveURL(/.*\/shop\/product\/\d+/);
	});

	test('should display full product details on detail page', async ({ page }) => {
		// Navigate to first product
		const productLinks = page.locator('a[href^="/shop/product/"]');
		await productLinks.first().click();
		
		await page.waitForLoadState('networkidle');
		
		// Check for product heading (h1)
		const heading = page.locator('h1').first();
		await expect(heading).toBeVisible();
		
		// Check for product description
		await expect(page.getByText(/product description/i)).toBeVisible();
		
		// Check for price
		const pageText = await page.textContent('body');
		expect(pageText).toMatch(/\$\d+/);
	});

	test('should have add to cart button on product detail page', async ({ page }) => {
		// Navigate to first product
		await page.locator('a[href^="/shop/product/"]').first().click();
		await page.waitForLoadState('networkidle');
		
		// Look for add to cart button
		const addToCartBtn = page.getByRole('button', { name: /add to cart/i });
		await expect(addToCartBtn).toBeVisible();
	});

	test('should show related products on detail page', async ({ page }) => {
		// Navigate to first product
		await page.locator('a[href^="/shop/product/"]').first().click();
		await page.waitForLoadState('networkidle');
		
		// Check for related products section
		await expect(page.getByRole('heading', { name: /related products/i })).toBeVisible();
	});

	test('should be able to navigate back to shop from product page', async ({ page }) => {
		// Navigate to a product
		await page.locator('a[href^="/shop/product/"]').first().click();
		await page.waitForURL(/.*\/shop\/product\/\d+/);
		
		// Click browser back
		await page.goBack();
		await expect(page).toHaveURL(/.*\/shop/);
		
		// Products should still be visible
		await page.waitForTimeout(2000);
		const hasProducts = await page.getByRole('button', { name: /add to cart/i }).count() > 0;
		expect(hasProducts).toBeTruthy();
	});

	test('should display product rating on cards', async ({ page }) => {
		// Check for star rating symbol
		const pageText = await page.textContent('body');
		expect(pageText).toMatch(/★/);
	});

	test('should display discount information', async ({ page }) => {
		// Check for SAVE text
		const pageText = await page.textContent('body');
		expect(pageText).toMatch(/SAVE/i);
	});
});
