import { test, expect } from '@playwright/test';

test.describe('Veterinarian Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await expect(page).toHaveTitle(/PetClinic/i);
  });

  test('@sanity TC005-01: Verify veterinarians list display', async ({ page }) => {
    // Navigate to Veterinarians
    await page.getByRole('link', { name: /veterinarians/i }).click();

    // Expect table visible and columns present
    const table = page.locator('#vets');
    await expect(table).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /name/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /specialties/i })).toBeVisible();

    // Check for JSON/XML view links if present
    const jsonLink = page.getByRole('link', { name: /json/i });
    const xmlLink = page.getByRole('link', { name: /xml/i });
    // Links may be present or not depending on app; assert if visible or at least not throw
    if (await jsonLink.count() > 0) await expect(jsonLink).toBeVisible();
    if (await xmlLink.count() > 0) await expect(xmlLink).toBeVisible();
  });

  test('@sanity TC005-02: Verify Veterinarians JSON Endpoint', async ({ request }) => {
    // Use absolute path to avoid baseURL/path confusion
    const res = await request.get('/petclinic/vets.json');
    expect(res.status()).toBe(200);
    const ct = res.headers()['content-type'] || '';
    expect(ct.toLowerCase()).toContain('application/json');
    const body = await res.json();
    // Some deployments wrap the list; handle both [] and {vetList: []}
    const isArray = Array.isArray(body) || Array.isArray(body?.vetList);
    expect(isArray).toBeTruthy();
  });

  test('@sanity TC005-03: Verify Veterinarians XML Endpoint', async ({ request }) => {
    const res = await request.get('/petclinic/vets.xml');
    expect(res.status()).toBe(200);
    const ct = res.headers()['content-type'] || '';
    expect(ct.toLowerCase()).toContain('xml');
    const text = await res.text();
    expect(text).toContain('<vets'); // basic sanity check for XML structure
  });

});
