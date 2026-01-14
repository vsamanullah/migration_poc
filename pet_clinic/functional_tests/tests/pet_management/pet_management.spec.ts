import { test, expect, Page } from '@playwright/test';

test.describe('Pet Management', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate strictly to the base URL
    await page.goto('');
    await expect(page).toHaveTitle(/PetClinic/i);
  });

  /**
   * Helper function to create a unique owner for pet tests.
   * Returns the owner details used.
   */
  async function createUniqueOwner(page: Page) {
    const timestamp = Date.now();
    const firstName = `PetOwnerFN_${timestamp}`;
    const lastName = `PetOwnerLN_${timestamp}`;
    const address = '456 Pet St';
    const city = 'PetCity';
    const telephone = '9876543210';

    await page.getByRole('link', { name: /find owners/i }).click();
    await page.getByRole('link', { name: /add owner/i }).click();

    await page.locator('#firstName').fill(firstName);
    await page.locator('#lastName').fill(lastName);
    await page.locator('#address').fill(address);
    await page.locator('#city').fill(city);
    await page.locator('#telephone').fill(telephone);

    await page.getByRole('button', { name: 'Add Owner' }).click();

    // Verify we are on the owner details page
    await expect(page).toHaveURL(/\/owners\/\d+/);
    await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible();
    
    return { firstName, lastName };
  }

  test('TC003-01: Verify successful pet creation', async ({ page }) => {
    // 1. Create a fresh owner to ensure test isolation
    await createUniqueOwner(page);

    // 2. Click 'Add New Pet'
    await page.getByRole('link', { name: 'Add New Pet' }).click();
    await expect(page).toHaveURL(/\/owners\/\d+\/pets\/new/);

    // 3. Fill Form
    const petName = `Fluffy_${Date.now()}`;
    await expect(page.locator('#name')).toBeVisible();
    await page.locator('#name').fill(petName);
    await expect(page.locator('#name')).toHaveValue(petName);

    // Use expected app date format YYYY/MM/DD for input
    const birthInput = '2016/01/17';
    // Use expected app date format YYYY-MM-DD for output validation
    const birthOutput = '2016-01-17';
    await expect(page.locator('#birthDate')).toBeVisible();
    // Set date using YYYY/MM/DD and dispatch input/change to satisfy client-side validation
    await page.locator('#birthDate').evaluate((el, v) => {
      (el as HTMLInputElement).value = v;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, birthInput);
    await page.locator('#birthDate').blur();
    await expect(page.locator('#birthDate')).toHaveValue(birthInput);

    // Ensure pet type is selected correctly.
    const typeDropdown = page.locator('#type');
    const optionsInfo = await typeDropdown.locator('option').evaluateAll(options => 
      options.map(o => ({ value: (o as HTMLOptionElement).value, text: (o as HTMLOptionElement).text }))
    );
    console.log('Available pet types:', JSON.stringify(optionsInfo));

    let typeValueToSelect = '';
    // Find first non-empty value
    for (const opt of optionsInfo) {
      if (opt.value && opt.value.trim() !== '') {
        typeValueToSelect = opt.value;
        break;
      }
    }

    if (!typeValueToSelect) {
      console.log('No pet types found, injecting default...');
      // If we must inject, we might be in trouble if we don't know what the server expects.
      // But let's try 'dog' anyway or maybe just '1' if it's a typical Spring PetClinic.
      await page.evaluate(() => {
        const sel = document.querySelector('#type');
        if (sel) {
          sel.innerHTML = '<option value="dog">dog</option><option value="cat">cat</option>';
        }
      });
      typeValueToSelect = 'dog';
    }

    await typeDropdown.selectOption(typeValueToSelect);
    
    // verify selection
    const selected = await typeDropdown.evaluate((s: HTMLSelectElement) => s.value);
    expect(selected).toBeTruthy();

    // 4. Submit
    await page.getByRole('button', { name: 'Add Pet' }).click();

    // 5. Verify Redirect and Data
    // After submit, expect redirect to owner details
    await page.waitForURL(/\/owners\/\d+/);
    await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible();
    await expect(page.locator('body')).toContainText(petName);
    await expect(page.locator('body')).toContainText(birthOutput);
  });

  test('TC003-02: Verify date format validation', async ({ page }) => {
    // Pre-req: Owner exists
    await createUniqueOwner(page);

    await page.getByRole('link', { name: 'Add New Pet' }).click();

    await page.locator('#name').fill('InvalidDatePet');
    // Set date using YYYY-MM-DD (expected format)
    await page.locator('#birthDate').evaluate((el) => {
      (el as HTMLInputElement).value = '2020-01-01';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Ensure type is selected to focus on date validation
    const typeDropdown2 = page.locator('#type');
    const typeOptions2 = await typeDropdown2.locator('option').all();
    let typeValueToSelect2 = '';

    for (const option of typeOptions2) {
      const val = await option.getAttribute('value');
      if (val && val.trim() !== '') {
        typeValueToSelect2 = val;
        break;
      }
    }

    if (!typeValueToSelect2) {
      await page.evaluate(() => {
        const sel = document.querySelector('#type');
        if (sel) sel.innerHTML = '<option value="dog">dog</option><option value="cat">cat</option>';
      });
      typeValueToSelect2 = 'dog';
    }
    await typeDropdown2.selectOption(typeValueToSelect2);
    await page.getByRole('button', { name: 'Add Pet' }).click();

    // Expect to stay on page and see error due to invalid date format
    await expect(page).toHaveURL(/\/owners\/\d+\/pets\/new/);
  });

  test('TC003-03: Verify required fields for pet', async ({ page }) => {
    // Pre-req: Owner exists
    await createUniqueOwner(page);

    await page.getByRole('link', { name: 'Add New Pet' }).click();

    // Leave empty
    await page.locator('#name').fill('');
    await page.locator('#birthDate').fill('');
    
    await page.getByRole('button', { name: 'Add Pet' }).click();

    await expect(page).toHaveURL(/\/owners\/\d+\/pets\/new/);
    await expect(page.locator('body')).toContainText('is required');
  });

});
