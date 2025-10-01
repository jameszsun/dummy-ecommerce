# E2E Tests for Dummy E-Commerce

This directory contains Playwright end-to-end tests for the Dummy E-Commerce application.

## ⚠️ Important: Selectors Updated Based on Browser Inspection

All selectors have been updated after inspecting the actual application using browser tools. See `SELECTOR_FIXES.md` for detailed changes.

## Test Coverage

### 1. Homepage and Navigation (`homepage-navigation.spec.js`)
- Homepage loading and basic elements
- Header navigation (logo, menu links)
- Navigation to shop and cart pages
- Empty cart state
- Footer visibility

### 2. Product Browsing (`product-browsing.spec.js`)
- Product list display in shop
- Product card information (image, title, price)
- Navigation to product detail pages
- Full product details display
- Add to cart button on detail page
- Related products section
- Navigation back to shop

### 3. Cart Operations (`cart-operations.spec.js`)
- Add items to cart from product listing
- Add items from product detail page
- Display correct item details in cart
- Increment/decrement item quantity
- Remove items when quantity reaches zero
- Remove items using remove button
- Update total price when quantity changes
- Clear all items from cart
- Cart persistence on page refresh

### 4. Search and Filters (`search-and-filters.spec.js`)
- Search input visibility and functionality
- Filter products by search term
- Handle no results for invalid search
- Clear search and restore all products
- Category filter options
- Filter by category
- Price range filter
- Filter by price range with validation
- Sort/order options
- Sort products by price
- Combine multiple filters
- Reset all filters

### 5. Complete Shopping Flow (`complete-shopping-flow.spec.js`)
- Full journey from homepage to checkout
- Add multiple quantities of same product
- Maintain cart state across navigation
- Update cart total with multiple operations
- Remove all items edge case
- Search, filter, and purchase flow
- Cart badge count in header
- Handle rapid cart operations

## Running the Tests

### Prerequisites
Make sure you have the application dependencies installed:
```bash
npm install
```

### Run all tests
```bash
npm run test:e2e
```

### Run tests in UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run specific test file
```bash
npx playwright test e2e/cart-operations.spec.js
```

### Run tests in headed mode (see the browser)
```bash
npx playwright test --headed
```

### Run tests in debug mode
```bash
npx playwright test --debug
```

### Run tests in a specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Configuration

The tests are configured in `playwright.config.js` at the root of the project:

- **Base URL**: `http://localhost:3000`
- **Test Directory**: `./e2e`
- **Browsers**: Chromium, Firefox, WebKit
- **Web Server**: Automatically starts with `npm start`
- **Screenshots**: Captured on failure
- **Trace**: Enabled on first retry

## Writing New Tests

When adding new tests:

1. Create a new `.spec.js` file in the `e2e` directory
2. Use descriptive test names that explain what is being tested
3. Group related tests using `test.describe()` blocks
4. Use `test.beforeEach()` for common setup
5. Wait for elements and network requests appropriately
6. Use flexible selectors that won't break easily

### Example Test Structure

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Name', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/shop');
		await page.waitForSelector('.card', { timeout: 10000 });
	});

	test('should do something specific', async ({ page }) => {
		// Arrange
		const element = page.locator('.some-element');
		
		// Act
		await element.click();
		
		// Assert
		await expect(page).toHaveURL(/expected-url/);
	});
});
```

## Viewing Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## Troubleshooting

### Tests timing out
- Increase timeout in specific tests: `test('name', async ({ page }) => { ... }, 60000);`
- Check if the dev server is running properly
- Ensure network connectivity to `dummyjson.com` API

### Flaky tests
- Add appropriate `waitForTimeout` or `waitForLoadState` calls
- Use more specific selectors
- Wait for network requests to complete

### Browser not launching
- Install browsers: `npx playwright install`
- Install system dependencies: `npx playwright install-deps`

## CI/CD Integration

For CI environments:
- Tests run with 2 retries on failure
- Single worker to avoid conflicts
- Web server must start successfully

Example GitHub Actions configuration:
```yaml
- name: Install dependencies
  run: npm ci
  
- name: Install Playwright browsers
  run: npx playwright install --with-deps
  
- name: Run Playwright tests
  run: npm run test:e2e
  
- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

