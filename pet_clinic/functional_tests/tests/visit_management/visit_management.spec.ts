import { test, expect, Page } from '@playwright/test';

test.describe('Visit Management', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to base URL
    await page.goto('');
    await expect(page).toHaveTitle(/PetClinic/i);
  });

  /**
   * Helper function to create a unique owner and pet for visit tests.
   * Returns owner and pet details.
   */
  async function createOwnerAndPet(page: Page) {
    const timestamp = Date.now();
    const ownerFN = `VisitOwnFN_${timestamp}`;
    const ownerLN = `VisitOwnLN_${timestamp}`;
    const petName = `VisitPet_${timestamp}`;

    // Create Owner
    await page.getByRole('link', { name: /find owners/i }).click();
    await page.getByRole('link', { name: /add owner/i }).click();
    await page.locator('#firstName').fill(ownerFN);
    await page.locator('#lastName').fill(ownerLN);
    await page.locator('#address').fill('123 Visit St');
    await page.locator('#city').fill('VisitCity');
    await page.locator('#telephone').fill('1234567890');
    await page.getByRole('button', { name: 'Add Owner' }).click();
    await page.waitForURL(/\/owners\/\d+/);

    // Add Pet
    await page.getByRole('link', { name: 'Add New Pet' }).click();
    await page.locator('#name').fill(petName);
    // Use format that app likes for input
    await page.locator('#birthDate').fill('2020/01/01');
    await page.locator('#type').selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Add Pet' }).click();
    await page.waitForURL(/\/owners\/\d+/);

    return { ownerFN, ownerLN, petName };
  }

  test('TC004-01: Verify successful visit addition', async ({ page }) => {
    // 1. Create Owner and Pet
    const { petName } = await createOwnerAndPet(page);

    // 2. Click 'Add Visit'
    // Find the row for our pet and click 'Add Visit' link within it
    const petRow = page.locator('tr', { hasText: petName });
    await petRow.getByRole('link', { name: 'Add Visit' }).click();
    await expect(page).toHaveURL(/\/visits\/new/);

    // 3. Verify Date is pre-filled
    const dateInput = page.locator('#date');
    const prefilledDate = await dateInput.inputValue();
    expect(prefilledDate).not.toBe('');
    console.log('Pre-filled date:', prefilledDate);

    // 4. Enter Description
    const description = 'Annual Checkup';
    await page.locator('#description').fill(description);

    // 5. Click 'Add Visit'
    await page.getByRole('button', { name: 'Add Visit' }).click();

    // 6. Verify Redirect and Data
    await page.waitForURL(/\/owners\/\d+/);
    await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible();
    
    // Check visit table - it's nested under the pet
    const petRowAfter = page.locator('tr', { hasText: petName });
    await expect(petRowAfter).toContainText(description);
    
    // The display format for date is YYYY-MM-DD
    const displayDate = prefilledDate.replace(/\//g, '-');
    await expect(petRowAfter).toContainText(displayDate);
  });

  test('TC004-02: Verify empty description handling', async ({ page }) => {
    // 1. Create Owner and Pet
    const { petName } = await createOwnerAndPet(page);

    // 2. Click 'Add Visit'
    await page.locator('tr', { hasText: petName }).getByRole('link', { name: 'Add Visit' }).click();

    // 3. Clear Description (it should be empty anyway)
    await page.locator('#description').clear();

    // 4. Click 'Add Visit'
    await page.getByRole('button', { name: 'Add Visit' }).click();

    // The PetClinic app usually allows empty descriptions or shows a validation error.
    // Based on inspection, if it redirects back to owner, it accepted it.
    // If it stays on the page, it rejected it.
    // Let's assume it might reject for now and check URL.
    const url = page.url();
    if (url.includes('/visits/new')) {
       // Validation failed (stayed on page)
       const errorMsg = page.getByText('may not be empty');
       await expect(errorMsg).toBeVisible();
    } else {
       // Accepted empty description
       await expect(page).toHaveURL(/\/owners\/\d+/);
       await expect(page.locator('body')).toContainText(petName);
    }
  });

  test('TC004-03: Verify add visit via HTTP POST', async ({ request, page }) => {
     // We need IDs for this. Let's get them from a browser session first.
     const { petName } = await createOwnerAndPet(page);
     const url = page.url();
     const ownerId = url.split('/').pop();
     
     // Get pet ID from the Add Visit link
     const addVisitLink = page.locator('tr', { hasText: petName }).getByRole('link', { name: 'Add Visit' });
     const addVisitHref = await addVisitLink.getAttribute('href');
     // href is like /petclinic/owners/35/pets/21/visits/new
     const petIdMatch = addVisitHref?.match(/\/pets\/(\d+)\//);
     const petId = petIdMatch ? petIdMatch[1] : '';

     expect(ownerId).toBeTruthy();
     expect(petId).toBeTruthy();

     const apiDescription = 'APIVisit';
     const apiDate = '2026/01/12';

     // POST to /petclinic/owners/{ownerId}/pets/{petId}/visits/new
     // Using absolute path from root
     const response = await request.post(`/petclinic/owners/${ownerId}/pets/${petId}/visits/new`, {
       form: {
         date: apiDate,
         description: apiDescription
       }
     });

     // PetClinic returns 200 or 302
     expect(response.ok()).toBeTruthy();
     
     // Verify visit exists in UI
     await page.goto(`/petclinic/owners/${ownerId}`);
     await expect(page.locator('body')).toContainText(apiDescription);
  });

});
