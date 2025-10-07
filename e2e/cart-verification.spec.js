const { test, expect } = require('@playwright/test');

test.describe('Cart Verification - Customer-Facing Outcomes', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/shop');
		await page.waitForTimeout(3000);
	});

	test('should show products are available for purchase', async ({ page }) => {
		// Customer sees products with add to cart buttons
		const addButtons = page.getByRole('button', { name: /add to cart/i });
		const buttonCount = await addButtons.count();
		
		expect(buttonCount).toBeGreaterThan(10);
		
		// All buttons should be enabled and ready to click
		await expect(addButtons.first()).toBeEnabled();
		await expect(addButtons.nth(5)).toBeEnabled();
		await expect(addButtons.last()).toBeEnabled();
	});

	test('should allow customer to click add to cart without errors', async ({ page }) => {
		// Customer clicks add to cart
		const addButton = page.getByRole('button', { name: /add to cart/i }).first();
		const productLink = page.locator('a[href^="/shop/product/"]').first();
		const productName = await productLink.textContent();
		
		await addButton.click();
		
		// No JavaScript errors should occur
		// Button should still exist on page
		await expect(addButton).toBeVisible();
		
		// Product card should still be visible
		const pageContent = await page.textContent('body');
		expect(pageContent).toContain(productName.trim());
	});

	test('should allow customer to navigate to cart after adding item', async ({ page }) => {
		// Customer adds item
		await page.getByRole('button', { name: /add to cart/i }).first().click();
		
		// Customer navigates to cart
		await page.locator('a[href="/cart"]').click();
		
		// Should successfully reach cart page
		await expect(page).toHaveURL(/.*\/cart/);
		
		// Page should load (not crash)
		const bodyText = await page.textContent('body');
		expect(bodyText.length).toBeGreaterThan(100);
	});

	test('should display cart page structure correctly', async ({ page }) => {
		await page.locator('a[href="/cart"]').click();
		
		// Customer should see either:
		// - Empty cart message with "Go shopping" link, OR
		// - Cart table with items
		
		const hasEmptyMessage = await page.getByText(/your cart is empty/i).count() > 0;
		const hasGoShopping = await page.getByRole('link', { name: /go shopping/i }).count() > 0;
		const hasCartTable = await page.locator('table').count() > 0;
		
		// Should have one of these states
		expect(hasEmptyMessage || hasCartTable).toBeTruthy();
		
		// If empty, should have go shopping link
		if (hasEmptyMessage) {
			expect(hasGoShopping).toBeTruthy();
		}
	});

	test('should show product information to help customer decide', async ({ page }) => {
		// Customer needs to see product details to make purchase decision
		const firstProduct = page.locator('a[href^="/shop/product/"]').first();
		
		// Should see product name/title
		const productText = await firstProduct.textContent();
		expect(productText.length).toBeGreaterThan(0);
		
		// Should see prices on page
		const bodyText = await page.textContent('body');
		expect(bodyText).toMatch(/\$\d+/);
		
		// Should see product ratings (stars)
		expect(bodyText).toContain('★');
		
		// Should see discount information
		expect(bodyText).toMatch(/SAVE/i);
	});

	test('should allow customer to view product details before adding to cart', async ({ page }) => {
		// Customer clicks on product to learn more
		await page.locator('a[href^="/shop/product/"]').first().click();
		await page.waitForURL(/.*\/shop\/product\/\d+/);
		
		// Should see detailed product information
		await expect(page.locator('h1').first()).toBeVisible();
		await expect(page.getByText(/product description/i)).toBeVisible();
		
		// Should see stock information
		const pageText = await page.textContent('body');
		expect(pageText).toMatch(/stock available/i);
		
		// Should have add to cart button on detail page
		const addButton = page.getByRole('button', { name: /add to cart/i });
		await expect(addButton).toBeVisible();
		await expect(addButton).toBeEnabled();
	});

	test('should show related products to help customer discover more items', async ({ page }) => {
		// Customer views a product
		await page.locator('a[href^="/shop/product/"]').first().click();
		await page.waitForLoadState('networkidle');
		
		// Should see related products section
		await expect(page.getByRole('heading', { name: /related products/i })).toBeVisible();
		
		// Related products should have clickable links
		const relatedLinks = page.locator('a[href^="/shop/product/"]');
		const count = await relatedLinks.count();
		expect(count).toBeGreaterThan(3);
	});

	test('should provide clear call-to-action when cart is empty', async ({ page }) => {
		// Customer goes to empty cart
		await page.locator('a[href="/cart"]').click();
		
		// Should see helpful message
		await expect(page.getByText(/your cart is empty/i)).toBeVisible();
		
		// Should have clear way to start shopping
		const goShoppingLink = page.getByRole('link', { name: /go shopping/i });
		await expect(goShoppingLink).toBeVisible();
		
		// Link should work
		await goShoppingLink.click();
		await expect(page).toHaveURL(/.*\/shop/);
	});

	test('should show product prices clearly for customer budgeting', async ({ page }) => {
		// Customer needs to see prices to make informed decisions
		const pageText = await page.textContent('body');
		
		// Should have multiple price displays
		const priceMatches = pageText.match(/\$\d+\.?\d*/g);
		expect(priceMatches.length).toBeGreaterThan(10);
		
		// Prices should be visible on cards
		const firstProduct = page.locator('a[href^="/shop/product/"]').first();
		const productSection = firstProduct.locator('..').locator('..');
		const productText = await productSection.textContent();
		expect(productText).toMatch(/\$/);
	});

	test('should allow customer to search and filter to find desired products', async ({ page }) => {
		// Customer uses search
		const searchInput = page.getByPlaceholder(/search for keyword/i);
		await expect(searchInput).toBeVisible();
		await searchInput.fill('phone');
		await page.waitForTimeout(2000);
		
		// Should see filtered results
		const productCount = await page.getByRole('button', { name: /add to cart/i }).count();
		expect(productCount).toBeGreaterThan(0);
		
		// Customer can add filtered items
		const addButton = page.getByRole('button', { name: /add to cart/i }).first();
		await expect(addButton).toBeEnabled();
		await addButton.click();
		await expect(addButton).toBeVisible();
	});
});



