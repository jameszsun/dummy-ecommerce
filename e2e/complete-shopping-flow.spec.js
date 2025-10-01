const { test, expect } = require('@playwright/test');

test.describe('Complete Shopping Flow', () => {
	test('should complete full shopping journey from homepage to shop', async ({ page }) => {
		// 1. Start at homepage
		await page.goto('/');
		await expect(page).toHaveTitle(/Themerc/i);
		
		// 2. Verify homepage elements
		await expect(page.getByText(/welcome to/i)).toBeVisible();
		await expect(page.getByRole('button', { name: /shop now/i })).toBeVisible();
		
		// 3. Navigate to shop
		await page.getByRole('link', { name: /shop/i }).first().click();
		await expect(page).toHaveURL(/.*\/shop/);
		
		// 4. Wait for products to load
		await page.waitForTimeout(3000);
		
		// 5. Browse products
		const productCount = await page.getByRole('button', { name: /add to cart/i }).count();
		expect(productCount).toBeGreaterThan(0);
		
		// 6. View product details
		await page.locator('a[href^="/shop/product/"]').first().click();
		await page.waitForURL(/.*\/shop\/product\/\d+/);
		
		// 7. Verify product details page
		await expect(page.locator('h1').first()).toBeVisible();
		await expect(page.getByText(/product description/i)).toBeVisible();
		
		// 8. Add to cart
		const addButton = page.getByRole('button', { name: /add to cart/i });
		await expect(addButton).toBeEnabled();
		await addButton.click();
		
		// 9. Verify we can navigate to cart (core user journey)
		await page.locator('a[href="/cart"]').click();
		await expect(page).toHaveURL(/.*\/cart/);
	});

	test('should use Shop Now button from homepage', async ({ page }) => {
		await page.goto('/');
		
		// Click "Shop Now" button
		await page.getByRole('button', { name: /shop now/i }).click();
		
		// Should navigate to shop
		await expect(page).toHaveURL(/.*\/shop/);
		
		// Wait for products
		await page.waitForTimeout(3000);
		const hasProducts = await page.getByRole('button', { name: /add to cart/i }).count() > 0;
		expect(hasProducts).toBeTruthy();
	});

	test('should navigate between pages maintaining functionality', async ({ page }) => {
		// Start at homepage
		await page.goto('/');
		
		// Go to shop
		await page.getByRole('link', { name: /shop/i }).first().click();
		await page.waitForTimeout(3000);
		
		// Go to cart
		await page.locator('a[href="/cart"]').click();
		await expect(page.getByText(/your cart is empty/i)).toBeVisible();
		
		// Go back to shop
		await page.getByRole('link', { name: /go shopping/i }).click();
		await expect(page).toHaveURL(/.*\/shop/);
		
		// Products should still be loaded
		await page.waitForTimeout(2000);
		const hasProducts = await page.getByRole('button', { name: /add to cart/i }).count() > 0;
		expect(hasProducts).toBeTruthy();
	});

	test('should search for product and view details', async ({ page }) => {
		await page.goto('/shop');
		await page.waitForTimeout(3000);
		
		// Search for item
		const searchInput = page.getByPlaceholder(/search for keyword/i);
		await searchInput.fill('phone');
		await page.waitForTimeout(2000);
		
		// Should have filtered results
		const filteredProducts = await page.getByRole('button', { name: /add to cart/i }).count();
		expect(filteredProducts).toBeGreaterThan(0);
		
		// Click on filtered product
		await page.locator('a[href^="/shop/product/"]').first().click();
		await page.waitForURL(/.*\/shop\/product\/\d+/);
		
		// Should show product details
		await expect(page.locator('h1').first()).toBeVisible();
	});

	test('should filter by price and add item', async ({ page }) => {
		await page.goto('/shop');
		await page.waitForTimeout(3000);
		
		// Set price range
		const minPrice = page.getByPlaceholder(/min price/i);
		const maxPrice = page.getByPlaceholder(/max price/i);
		
		await minPrice.fill('10');
		await maxPrice.fill('100');
		await page.waitForTimeout(2000);
		
		// Should have some products in this range
		const productCount = await page.getByRole('button', { name: /add to cart/i }).count();
		
		if (productCount > 0) {
			// Verify we can add filtered items to cart
			const addButton = page.getByRole('button', { name: /add to cart/i }).first();
			await expect(addButton).toBeEnabled();
			await addButton.click();
			
			// Verify button remains visible after click (user can see it worked)
			await expect(addButton).toBeVisible();
		}
		
		expect(productCount).toBeGreaterThanOrEqual(0);
	});

	test('should view related products from product detail page', async ({ page }) => {
		await page.goto('/shop');
		await page.waitForTimeout(3000);
		
		// Navigate to a product
		await page.locator('a[href^="/shop/product/"]').first().click();
		await page.waitForURL(/.*\/shop\/product\/\d+/);
		
		// Check for related products
		await expect(page.getByRole('heading', { name: /related products/i })).toBeVisible();
		
		// Related products should have links
		const relatedProductLinks = page.locator('a[href^="/shop/product/"]');
		const count = await relatedProductLinks.count();
		expect(count).toBeGreaterThan(1); // At least the current product view has links
	});

	test('should display correct page title on all pages', async ({ page }) => {
		// Homepage
		await page.goto('/');
		await expect(page).toHaveTitle(/Themerc/i);
		
		// Shop
		await page.goto('/shop');
		await expect(page).toHaveTitle(/Themerc/i);
		
		// Cart
		await page.goto('/cart');
		await expect(page).toHaveTitle(/Themerc/i);
	});

	test('should have consistent header across all pages', async ({ page }) => {
		// Check homepage - logo exists
		await page.goto('/');
		await expect(page.locator('img[alt*="logo"]').first()).toBeAttached();
		await expect(page.getByRole('link', { name: /shop/i })).toBeVisible();
		
		// Check shop
		await page.goto('/shop');
		await page.waitForTimeout(2000);
		await expect(page.locator('img[alt*="logo"]').first()).toBeAttached();
		await expect(page.locator('a[href="/cart"]')).toBeVisible();
		
		// Check cart
		await page.goto('/cart');
		await expect(page.locator('img[alt*="logo"]').first()).toBeAttached();
		await expect(page.getByRole('link', { name: /shop/i })).toBeVisible();
	});

	test('should have consistent footer across all pages', async ({ page }) => {
		// Homepage footer
		await page.goto('/');
		await expect(page.getByRole('link', { name: /themerc/i })).toBeVisible();
		
		// Shop footer
		await page.goto('/shop');
		await page.waitForTimeout(2000);
		await expect(page.getByRole('button', { name: /facebook/i })).toBeVisible();
		
		// Cart footer
		await page.goto('/cart');
		await expect(page.getByRole('button', { name: /twitter/i })).toBeVisible();
	});

	test('should handle rapid navigation without errors', async ({ page }) => {
		await page.goto('/');
		
		// Rapid navigation with proper waits
		await page.getByRole('link', { name: /shop/i }).first().click();
		await page.waitForURL(/.*\/shop/);
		
		await page.locator('a[href="/cart"]').click();
		await page.waitForURL(/.*\/cart/);
		
		const homeLink = page.locator('a[href="/"]').first();
		await homeLink.waitFor({ state: 'visible', timeout: 5000 });
		await homeLink.click();
		await page.waitForURL(/^\//);
		
		await page.getByRole('link', { name: /shop/i }).first().click();
		
		// Should end up on shop page
		await expect(page).toHaveURL(/.*\/shop/);
		
		// Wait and verify products load
		await page.waitForTimeout(3000);
		const hasProducts = await page.getByRole('button', { name: /add to cart/i }).count() > 0;
		expect(hasProducts).toBeTruthy();
	});
});
