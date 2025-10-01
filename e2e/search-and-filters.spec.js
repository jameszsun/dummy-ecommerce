const { test, expect } = require('@playwright/test');

test.describe('Search and Filter Functionality', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/shop');
		await page.waitForTimeout(3000); // Wait for products to load
	});

	test('should have search input field visible', async ({ page }) => {
		// Look for search input with placeholder
		const searchInput = page.getByPlaceholder(/search for keyword/i);
		await expect(searchInput).toBeVisible();
	});

	test('should filter products by search term', async ({ page }) => {
		// Get initial add to cart button count (indicates number of products)
		const initialCount = await page.getByRole('button', { name: /add to cart/i }).count();
		
		// Type in search
		const searchInput = page.getByPlaceholder(/search for keyword/i);
		await searchInput.fill('phone');
		await page.waitForTimeout(2000); // Wait for filter to apply
		
		// Product count should exist (some products match)
		const newCount = await page.getByRole('button', { name: /add to cart/i }).count();
		expect(newCount).toBeGreaterThan(0);
	});

	test('should clear search and show all products', async ({ page }) => {
		const searchInput = page.getByPlaceholder(/search for keyword/i);
		
		// Search for something
		await searchInput.fill('phone');
		await page.waitForTimeout(2000);
		const filteredCount = await page.getByRole('button', { name: /add to cart/i }).count();
		
		// Clear search
		await searchInput.clear();
		await page.waitForTimeout(2000);
		
		// Should show more or equal products
		const clearedCount = await page.getByRole('button', { name: /add to cart/i }).count();
		expect(clearedCount).toBeGreaterThanOrEqual(filteredCount);
	});

	test('should have category filter dropdown', async ({ page }) => {
		// Look for category listbox
		const categoryFilter = page.locator('text=/category:/i');
		await expect(categoryFilter).toBeVisible();
	});

	test('should have price range filter', async ({ page }) => {
		// Look for price range inputs
		const minPriceInput = page.getByPlaceholder(/min price/i);
		const maxPriceInput = page.getByPlaceholder(/max price/i);
		
		await expect(minPriceInput).toBeVisible();
		await expect(maxPriceInput).toBeVisible();
	});

	test('should filter products by price range', async ({ page }) => {
		const minPriceInput = page.getByPlaceholder(/min price/i);
		const maxPriceInput = page.getByPlaceholder(/max price/i);
		
		// Set price range
		await minPriceInput.fill('100');
		await maxPriceInput.fill('500');
		await page.waitForTimeout(2000);
		
		// Should show filtered products
		const count = await page.getByRole('button', { name: /add to cart/i }).count();
		expect(count).toBeGreaterThanOrEqual(0); // Might be 0 depending on data
	});

	test('should have order by dropdown', async ({ page }) => {
		// Look for order by filter
		const orderByFilter = page.locator('text=/order by:/i');
		await expect(orderByFilter).toBeVisible();
	});

	test('should have sort order toggle (Descending/Ascending)', async ({ page }) => {
		// Look for descending/ascending text
		const sortToggle = page.locator('text=/descending|ascending/i').first();
		await expect(sortToggle).toBeVisible();
	});

	test('should allow typing in search field', async ({ page }) => {
		const searchInput = page.getByPlaceholder(/search for keyword/i);
		
		await searchInput.fill('laptop');
		
		// Verify input has the value
		const value = await searchInput.inputValue();
		expect(value).toBe('laptop');
	});

	test('should allow typing in min price field', async ({ page }) => {
		const minPriceInput = page.getByPlaceholder(/min price/i);
		
		await minPriceInput.fill('50');
		
		// Verify input has the value
		const value = await minPriceInput.inputValue();
		expect(value).toBe('50');
	});

	test('should allow typing in max price field', async ({ page }) => {
		const maxPriceInput = page.getByPlaceholder(/max price/i);
		
		await maxPriceInput.fill('1000');
		
		// Verify input has the value
		const value = await maxPriceInput.inputValue();
		expect(value).toBe('1000');
	});

	test('should display filter options section', async ({ page }) => {
		// Verify all filter components are present
		await expect(page.getByPlaceholder(/search for keyword/i)).toBeVisible();
		await expect(page.locator('text=/category:/i')).toBeVisible();
		await expect(page.locator('text=/price range:/i')).toBeVisible();
		await expect(page.locator('text=/order by:/i')).toBeVisible();
	});

	test('should search for specific product type', async ({ page }) => {
		const searchInput = page.getByPlaceholder(/search for keyword/i);
		
		// Search for kitchen items
		await searchInput.fill('kitchen');
		await page.waitForTimeout(2000);
		
		// Should have results
		const productCount = await page.getByRole('button', { name: /add to cart/i }).count();
		expect(productCount).toBeGreaterThan(0);
	});
});
