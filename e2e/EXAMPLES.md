# Playwright Test Examples and Patterns

This file contains common patterns and examples used in the e2e tests for reference.

## Common Selectors

### Flexible Selectors (Recommended)
```javascript
// Works with different implementations
page.locator('.card, [data-testid="product-card"]')

// Multiple text variations
page.locator('button:has-text("Add"), button:has-text("Cart")')

// Role-based (most stable)
page.getByRole('link', { name: /shop/i })

// Text content (case-insensitive)
page.locator('text=/empty|no items/i')
```

### Specific Selectors
```javascript
// Input by type or placeholder
page.locator('input[type="search"], input[placeholder*="search" i]')

// Buttons by class or text
page.locator('button:has-text("+"), button.increment')

// Navigation elements
page.locator('header img[alt*="logo"]')
```

## Wait Patterns

### Wait for Elements
```javascript
// Wait for specific element to be visible
await page.waitForSelector('.card', { timeout: 10000 });

// Wait for network to be idle
await page.waitForLoadState('networkidle');

// Wait for URL change
await page.waitForURL(/.*\/shop\/product\/\d+/);

// Simple timeout for state updates
await page.waitForTimeout(500);
```

### Wait for Conditions
```javascript
// Wait for element to be visible
await expect(element).toBeVisible();

// Wait for element to have text
await expect(element).toHaveText(/expected text/i);

// Wait for URL
await expect(page).toHaveURL(/expected-url/);
```

## Assertion Patterns

### Element Assertions
```javascript
// Visibility
await expect(page.locator('header')).toBeVisible();

// Count
const count = await page.locator('.card').count();
expect(count).toBeGreaterThan(0);

// Text content
const text = await element.textContent();
expect(text).toMatch(/\$\d+/);

// URL
await expect(page).toHaveURL(/.*\/shop/);
```

### Conditional Checks
```javascript
// Check if element exists
const hasElement = await page.locator('.element').count() > 0;
expect(hasElement).toBeTruthy();

// Either/or conditions
const hasMessage = await page.locator('text=/empty/i').count() > 0;
const noItems = await page.locator('.item').count() === 0;
expect(hasMessage || noItems).toBeTruthy();
```

## Navigation Patterns

### Direct Navigation
```javascript
await page.goto('/');
await page.goto('/shop');
await page.goto('/cart');
```

### Click Navigation
```javascript
// Click link
await page.getByRole('link', { name: /shop/i }).first().click();

// Click button
await page.locator('button:has-text("Add")').first().click();

// Browser navigation
await page.goBack();
await page.reload();
```

## Data Extraction Patterns

### Get Text Content
```javascript
// Single element
const text = await element.textContent();

// Multiple elements
const texts = await page.locator('.price').allTextContents();
```

### Parse Numbers from Text
```javascript
const totalText = await page.locator('text=/total/i').textContent();
const total = parseFloat(totalText.match(/\$(\d+\.?\d*)/)?.[1] || '0');
```

### Get Element Count
```javascript
const count = await page.locator('.card').count();
```

## Interaction Patterns

### Form Interactions
```javascript
// Fill input
await input.fill('search term');

// Clear input
await input.clear();

// Select dropdown
await dropdown.selectOption({ index: 1 });
await dropdown.selectOption({ value: 'option-value' });
```

### Button Clicks
```javascript
// Simple click
await button.click();

// Click with wait
await button.click();
await page.waitForTimeout(500);

// Click first match
await page.locator('button:has-text("Add")').first().click();

// Click nth match
await page.locator('.card').nth(1).click();
```

## Test Structure Patterns

### Basic Test
```javascript
test('should do something', async ({ page }) => {
	// Arrange
	await page.goto('/shop');
	
	// Act
	await page.locator('button').click();
	
	// Assert
	await expect(page.locator('.result')).toBeVisible();
});
```

### Test with beforeEach
```javascript
test.describe('Feature Tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/shop');
		await page.waitForSelector('.card', { timeout: 10000 });
	});

	test('should test feature', async ({ page }) => {
		// Test implementation
	});
});
```

### Test with Custom Timeout
```javascript
test('should complete long operation', async ({ page }) => {
	// Test implementation
}, 60000); // 60 second timeout
```

## Error Handling Patterns

### Check Before Action
```javascript
const hasDropdown = await dropdown.count() > 0;
if (hasDropdown) {
	await dropdown.selectOption({ index: 1 });
}
```

### Try Multiple Selectors
```javascript
const addButton = page.locator('button:has-text("Add"), button:has-text("Cart"), button.add-btn').first();
await addButton.click();
```

### Verify State Changes
```javascript
// Get initial state
const initialCount = await page.locator('.item').count();

// Perform action
await button.click();
await page.waitForTimeout(500);

// Verify change
const newCount = await page.locator('.item').count();
expect(newCount).toBeGreaterThan(initialCount);
```

## Performance Patterns

### Parallel Operations
```javascript
// Don't wait unnecessarily
const addBtn = page.locator('.card').first().locator('button');
await addBtn.click();
await page.waitForTimeout(300); // Short wait for state update
await addBtn.click(); // Second click
```

### Efficient Selectors
```javascript
// Cache selectors
const firstProduct = page.locator('.card').first();
const addButton = firstProduct.locator('button');
const title = firstProduct.locator('h3');

await addButton.click();
const titleText = await title.textContent();
```

## Debugging Tips

### Take Screenshots
```javascript
await page.screenshot({ path: 'debug-screenshot.png' });
```

### Console Logs
```javascript
console.log('Debug info:', await element.textContent());
```

### Pause Execution
```javascript
await page.pause(); // Opens Playwright Inspector
```

### Verbose Waits
```javascript
await page.waitForSelector('.element', { 
	timeout: 10000,
	state: 'visible' 
});
```

## Best Practices

1. **Use flexible selectors** - Works across different implementations
2. **Wait appropriately** - Don't use fixed timeouts unless necessary
3. **Test behavior, not implementation** - Focus on user actions
4. **Keep tests independent** - Each test should work standalone
5. **Use descriptive names** - Test names should explain what they verify
6. **Group related tests** - Use `test.describe()` for organization
7. **Handle async properly** - Always await Playwright operations
8. **Assert explicitly** - Make expectations clear
9. **Clean up after tests** - Reset state when needed
10. **Document complex logic** - Add comments for tricky selectors or flows



