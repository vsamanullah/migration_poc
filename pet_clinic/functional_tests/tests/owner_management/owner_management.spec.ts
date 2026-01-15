import { test, expect } from '@playwright/test';

test.describe('Owner Management', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate strictly to the base URL (empty string appends nothing to baseURL)
    await page.goto(''); 
    await expect(page).toHaveTitle(/PetClinic/i);
  });

  test('@sanity TC001-01: Verify navigation to Add Owner page', async ({ page }) => {
    await page.getByRole('link', { name: /find owners/i }).click();
    await page.getByRole('link', { name: /add owner/i }).click();
    
    await expect(page).toHaveURL(/\/owners\/new/);
    await expect(page.locator('#firstName')).toBeVisible();
    await expect(page.locator('#lastName')).toBeVisible();
    await expect(page.locator('#address')).toBeVisible();
    await expect(page.locator('#city')).toBeVisible();
    await expect(page.locator('#telephone')).toBeVisible();
  });

  test('TC001-02: Verify successful owner creation with valid data', async ({ page }) => {
    // Generate unique data
    const timestamp = Date.now();
    const firstName = `TestFirstName_${timestamp}`;
    const lastName = `TestLastName_${timestamp}`;
    const address = '123 Test St';
    const city = 'TestCity';
    const telephone = '1234567890';

    // Navigate to Add Owner
    await page.getByRole('link', { name: /find owners/i }).click();
    await page.getByRole('link', { name: /add owner/i }).click();

    // Fill form
    await page.locator('#firstName').fill(firstName);
    await page.locator('#lastName').fill(lastName);
    await page.locator('#address').fill(address);
    await page.locator('#city').fill(city);
    await page.locator('#telephone').fill(telephone);
    
    // Submit
    await page.getByRole('button', { name: 'Add Owner' }).click();

    // Validation
    await expect(page).toHaveURL(/\/owners\/\d+/);
    await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible();
    
    // Verify details on page
    await expect(page.locator('body')).toContainText(firstName);
    await expect(page.locator('body')).toContainText(lastName);
    await expect(page.locator('body')).toContainText(telephone);
  });

  test('@sanity TC001-03: Verify validation for empty required fields', async ({ page }) => {
    await page.getByRole('link', { name: /find owners/i }).click();
    await page.getByRole('link', { name: /add owner/i }).click();

    // Leave empty and submit
    await page.getByRole('button', { name: 'Add Owner' }).click();

    // Expect validation errors
    await expect(page).toHaveURL(/\/owners\/new/);
    // Generic check for validation text
    await expect(page.locator('body')).toContainText('may not be empty'); 
  });

  test('@sanity TC001-04: Verify validation for numeric telephone', async ({ page }) => {
    await page.getByRole('link', { name: /find owners/i }).click();
    await page.getByRole('link', { name: /add owner/i }).click();

    await page.locator('#firstName').fill('Test');
    await page.locator('#lastName').fill('User');
    await page.locator('#address').fill('123 St');
    await page.locator('#city').fill('City');
    await page.locator('#telephone').fill('INV@LID'); // Non-numeric

    await page.getByRole('button', { name: 'Add Owner' }).click();

    await expect(page).toHaveURL(/\/owners\/new/);
    await expect(page.locator('body')).toContainText('numeric value out of bounds'); 
  });

  test('TC002-01: Verify find owner by last name (Exact match)', async ({ page }) => {
    // Navigate
    await page.getByRole('link', { name: /find owners/i }).click();

    // Search for an existing owner (defaults to Davis)
    const searchName = 'Davis';
    await page.locator('input[name="lastName"]').fill(searchName);
    await page.getByRole('button', { name: 'Find Owner' }).click();

    // If no results, create an owner and re-run the search for stability
    const bodyText = await page.locator('body').innerText();
    if (bodyText.includes('has not been found')) {
      // Create an owner with a unique last name and search for that instead
      const timestamp = Date.now();
      const newLast = `AutoOwner_${timestamp}`;
      await page.getByRole('link', { name: /add owner/i }).click();
      await page.locator('#firstName').fill('Auto');
      await page.locator('#lastName').fill(newLast);
      await page.locator('#address').fill('123 Test St');
      await page.locator('#city').fill('City');
      await page.locator('#telephone').fill('0000000000');
      await page.getByRole('button', { name: 'Add Owner' }).click();

      // Now go back to find owners and search for the created last name
      await page.getByRole('link', { name: /find owners/i }).click();
      await page.locator('input[name="lastName"]').fill(newLast);
      await page.getByRole('button', { name: 'Find Owner' }).click();
      await expect(page.locator('body')).toContainText(newLast);
    } else {
      await expect(page.locator('body')).toContainText(searchName);
    }
  });

  test('TC002-04: Verify search for non-existent owner', async ({ page }) => {
    await page.getByRole('link', { name: /find owners/i }).click();
    await page.locator('input[name="lastName"]').fill('NonExistentXYZ_' + Date.now());
    await page.getByRole('button', { name: 'Find Owner' }).click();

    await expect(page.locator('body')).toContainText('has not been found');
  });

});
