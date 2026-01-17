import { test, expect, APIResponse } from '@playwright/test';

// Base URL for the Petclinic application
// BASE_URL removed in favor of Playwright config

test.describe('Petclinic Application E2E and API Tests', () => {
  const uniqueSuffix = Date.now().toString();
  const commonPrefix = `TestGroup${uniqueSuffix}`;
  let testData = {
    testUserOwnerId: '',
    davisOwnerId: '',
    ownerWithPetId: '',
    petIdForVisit: '',
    davisName: `${commonPrefix}Davis`,
    jonesName: `${commonPrefix}Jones`,
    estebanName: `${commonPrefix}Esteban`,
    userName: `${commonPrefix}User`,
    commonPrefix: commonPrefix,
  };

  // Setup initial data required for various tests using API for speed and reliability
  test.beforeAll(async ({ browser, request }) => {
    // TC_FO_01 Precondition: Create owner 'Davis'
    const davisResponse = await request.post(`owners/new`, {
      form: { firstName: 'George', lastName: testData.davisName, address: '110 W. Liberty St.', city: 'Madison', telephone: '6085551023' },
      maxRedirects: 0,
    });
    expect(davisResponse.status()).toBe(302);
    testData.davisOwnerId = davisResponse.headers().location.split('/').pop()!;

    // TC_FO_02 Precondition: Create owner 'Jones'
    const jonesResponse = await request.post(`owners/new`, {
      form: { firstName: 'Peter', lastName: testData.jonesName, address: '123 Test Ave', city: 'Testville', telephone: '1231231234' },
      maxRedirects: 0,
    });
    expect(jonesResponse.status()).toBe(302);

    // TC_FO_02 Precondition: Create owner 'Esteban'
    const estebanResponse = await request.post(`owners/new`, {
      form: { firstName: 'Carlos', lastName: testData.estebanName, address: '456 API Road', city: 'Automated City', telephone: '4564564567' },
      maxRedirects: 0,
    });
    expect(estebanResponse.status()).toBe(302);

    // TC_AP_01 Precondition: Create 'Test User'
    const testUserResponse = await request.post(`owners/new`, {
      form: { firstName: 'Test', lastName: testData.userName, address: '789 QA Lane', city: 'Scripting', telephone: '7897897890' },
      maxRedirects: 0,
    });
    expect(testUserResponse.status()).toBe(302);
    testData.testUserOwnerId = testUserResponse.headers().location.split('/').pop()!;
    
    // TC_AV_01 Precondition: Create an owner and a pet to add a visit to
    const ownerResponse = await request.post(`owners/new`, {
        form: { firstName: 'Visit', lastName: 'Owner', address: '101 Visit Street', city: 'Appointment', telephone: '1112223333' },
        maxRedirects: 0,
    });
    expect(ownerResponse.status()).toBe(302);
    testData.ownerWithPetId = ownerResponse.headers().location.split('/').pop()!;

    const petResponse = await request.post(`owners/${testData.ownerWithPetId}/pets/new`, {
        form: { name: 'VisitPet', birthDate: '2021/01/01', type: 'hamster' },
        maxRedirects: 0,
    });
    expect(petResponse.status()).toBe(302);

    // To get the pet ID, we need to visit the owner page and scrape it.
    const context = await browser.newContext();
    const page = await context.newPage();
    console.log(`Navigating to owners/${testData.ownerWithPetId}`);
    await page.goto(`owners/${testData.ownerWithPetId}`);
    // The "Add Visit" link contains the pet ID.
    // Use getByRole which is more robust than href selector
    const addVisitLink = page.getByRole('link', { name: 'Add Visit' }).first();
    await expect(addVisitLink).toBeVisible();
    const href = await addVisitLink.getAttribute('href');
    console.log(`Found Add Visit link with href: ${href}`);
    // Extract ID using regex to be safe against different context paths
    const match = href!.match(/pets\/(\d+)\/visits/);
    if (match && match[1]) {
        testData.petIdForVisit = match[1];
    } else {
        throw new Error(`Could not extract pet ID from href: ${href}`);
    }
    await page.close();
    await context.close();
  });

  // User Story 1: Create Owner
  test.describe('User Story 1: Create Owner', () => {

    test('TC_CO_01: Verify navigation from Home Page to New Owner page', async ({ page }) => {
      await test.step('Navigate to Home Page', async () => {
        await page.goto('./');
        await expect(page).toHaveTitle(/PetClinic/);
      });

      await test.step("1. Click on the 'Find owners' link in the navigation bar", async () => {
        await page.getByRole('link', { name: 'Find owners' }).click();
        await expect(page).toHaveURL(/owners\/find/);
        await expect(page.getByRole('heading', { name: 'Find Owners' })).toBeVisible();
      });

      await test.step("2. On the 'Find Owners' page, click the 'Add Owner' button", async () => {
        await page.getByRole('link', { name: 'Add Owner' }).click();
        await expect(page).toHaveURL(/owners\/new/);
        await expect(page.getByRole('heading', { name: 'New Owner' })).toBeVisible();
      });
    });

    test('TC_CO_02: Verify successful creation of a new owner with valid data', async ({ page }) => {
      const owner = {
        firstName: 'John',
        lastName: `Doe${Date.now()}`, // Unique last name to avoid conflicts
        address: '123 Main St',
        city: 'Metropolis',
        telephone: '1234567890',
      };

      await test.step("Precondition: Navigate to 'New Owner' page", async () => {
        await page.goto(`owners/new`);
        await expect(page.getByRole('heading', { name: 'New Owner' })).toBeVisible();
      });

      await test.step("1. Enter a valid 'First Name'", async () => {
        await page.locator('#firstName').fill(owner.firstName);
        await expect(page.locator('#firstName')).toHaveValue(owner.firstName);
      });

      await test.step("2. Enter a valid 'Last Name'", async () => {
        await page.locator('#lastName').fill(owner.lastName);
        await expect(page.locator('#lastName')).toHaveValue(owner.lastName);
      });

      await test.step("3. Enter a valid 'Address'", async () => {
        await page.locator('#address').fill(owner.address);
        await expect(page.locator('#address')).toHaveValue(owner.address);
      });

      await test.step("4. Enter a valid 'City'", async () => {
        await page.locator('#city').fill(owner.city);
        await expect(page.locator('#city')).toHaveValue(owner.city);
      });

      await test.step("5. Enter a valid 'Telephone'", async () => {
        await page.locator('#telephone').fill(owner.telephone);
        await expect(page.locator('#telephone')).toHaveValue(owner.telephone);
      });

      await test.step("6. Click the 'Add Owner' button", async () => {
        await page.getByRole('button', { name: 'Add Owner' }).click();
        await expect(page).toHaveURL(new RegExp(`owners/\\d+`));
        await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible();

        // Verify displayed information
        const ownerInfoTable = page.locator('h2:has-text("Owner Information") + table');
        await expect(ownerInfoTable.getByText(`${owner.firstName} ${owner.lastName}`)).toBeVisible();
        await expect(ownerInfoTable.getByText(owner.address)).toBeVisible();
        await expect(ownerInfoTable.getByText(owner.city)).toBeVisible();
        await expect(ownerInfoTable.getByText(owner.telephone)).toBeVisible();
      });
    });

    test('TC_CO_03: Verify owner creation via a valid HTTP POST request', async ({ request }) => {
        await test.step('1. Send an HTTP POST request to create a new owner', async () => {
            const response = await request.post(`owners/new`, {
                form: {
                    firstName: "Api",
                    lastName: "User",
                    address: "456 API Ave",
                    city: "Testville",
                    telephone: "0987654321"
                },
                maxRedirects: 0,
            });

            // Expected Result 1: Assert status 302 and Location header
            expect(response.status()).toBe(302);
            const locationHeader = response.headers().location;
            expect(locationHeader).toMatch(/\/petclinic\/owners\/\d+/);
        });
    });
  });

  // User Story 2: Find Owner
  test.describe('User Story 2: Find Owner', () => {

    test.beforeEach(async ({ page }) => {
      // Precondition: Navigate to Find Owners page
      await page.goto(`owners/find`);
      await expect(page.getByRole('heading', { name: 'Find Owners' })).toBeVisible();
    });

    test('TC_FO_01: Verify finding a single owner using an exact last name search', async ({ page }) => {
      await test.step("1. Enter 'Davis' in the 'Last name' search field", async () => {
        await page.locator('input#lastName').fill(testData.davisName);
        await expect(page.locator('input#lastName')).toHaveValue(testData.davisName);
      });

      await test.step("2. Click the 'Find Owner' button", async () => {
        await page.getByRole('button', { name: 'Find Owner' }).click();
        await expect(page).toHaveURL(new RegExp(`owners/${testData.davisOwnerId}`));
        await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible();
        await expect(page.getByText(`George ${testData.davisName}`)).toBeVisible();
      });
    });

    test('TC_FO_02: Verify listing multiple owners with a partial last name search', async ({ page }) => {
      await test.step("1. Enter 'es' in the 'Last name' search field", async () => {
        // Search by unique common prefix to find the owners created in this run
        await page.locator('input#lastName').fill(testData.commonPrefix);
        await expect(page.locator('input#lastName')).toHaveValue(testData.commonPrefix);
      });

      await test.step("2. Click the 'Find Owner' button", async () => {
        await page.getByRole('button', { name: 'Find Owner' }).click();
        await expect(page).toHaveURL(/owners.*lastName=/);
        await expect(page.getByRole('heading', { name: 'Owners' })).toBeVisible();
        
        const resultsTable = page.locator('#owners');
        await expect(resultsTable).toBeVisible();
        // Assert table headers
        await expect(resultsTable.locator('th', { hasText: 'Name' })).toBeVisible();
        await expect(resultsTable.locator('th', { hasText: 'Address' })).toBeVisible();
        await expect(resultsTable.locator('th', { hasText: 'City' })).toBeVisible();
        await expect(resultsTable.locator('th', { hasText: 'Telephone' })).toBeVisible();
        await expect(resultsTable.locator('th', { hasText: 'Pets' })).toBeVisible();
        
        // Assert at least two results are present
        const rows = resultsTable.locator('tbody tr');
        expect(await rows.count()).toBeGreaterThanOrEqual(2);
        
        // Assert specific names are in the results
        await expect(page.getByRole('link', { name: `Peter ${testData.jonesName}` })).toBeVisible();
        await expect(page.getByRole('link', { name: `Carlos ${testData.estebanName}` })).toBeVisible();
      });
    });

    test('TC_FO_03: Verify listing all owners with an empty search field', async ({ page }) => {
      await test.step("1. Leave the 'Last name' search field empty", async () => {
        await expect(page.locator('input#lastName')).toBeEmpty();
      });

      await test.step("2. Click the 'Find Owner' button", async () => {
        await page.getByRole('button', { name: 'Find Owner' }).click();
        await expect(page).toHaveURL(/owners.*lastName=/);
        await expect(page.getByRole('heading', { name: 'Owners' })).toBeVisible();

        const resultsTable = page.locator('#owners');
        await expect(resultsTable).toBeVisible();
        
        // Assert at least one owner is listed
        const rows = resultsTable.locator('tbody tr');
        expect(await rows.count()).toBeGreaterThan(0);
      });
    });
  });

  // User Story 3: Add Pet
  test.describe('User Story 3: Add Pet', () => {

    test('TC_AP_01: Verify successful addition of a new pet to an existing owner', async ({ page }) => {
      const pet = {
        name: 'Fido',
        birthDate: '2020/01/15',
        type: 'dog',
      };
      
      await test.step("Precondition: Navigate to 'Test User' Owner Information page", async () => {
        await page.goto(`owners/${testData.testUserOwnerId}`);
        await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible();
      });

      await test.step("1. Click the 'Add New Pet' button", async () => {
        await page.getByRole('link', { name: 'Add New Pet' }).click();
        await expect(page).toHaveURL(/owners\/.*\/pets\/new/);
        await expect(page.getByRole('heading', { name: 'New Pet' })).toBeVisible();
        await expect(page.getByText(`Test ${testData.userName}`)).toBeVisible();
      });

      await test.step("2. Enter a 'Name' for the pet", async () => {
        await page.locator('#name').fill(pet.name);
        await expect(page.locator('#name')).toHaveValue(pet.name);
      });

      await test.step("3. Enter a valid 'Birth Date'", async () => {
        await page.locator('#birthDate').fill(pet.birthDate);
        await expect(page.locator('#birthDate')).toHaveValue(pet.birthDate);
      });

      await test.step("4. Select a 'Type' from the dropdown", async () => {
        await page.locator('#type').selectOption({ label: pet.type });
        await expect(page.locator('#type')).toHaveValue(pet.type);
      });

      await test.step("5. Click the 'Add Pet' button", async () => {
        await page.getByRole('button', { name: 'Add Pet' }).click();
        await expect(page).toHaveURL(`owners/${testData.testUserOwnerId}`);
        
        // Verify the new pet is in the 'Pets and Visits' table
        const petTable = page.locator('h2:has-text("Pets and Visits") + table');
        const petRow = petTable.locator('tbody tr', { has: page.getByText(pet.name, { exact: true }) });

        await expect(petRow).toBeVisible();
        await expect(petRow.locator('td').nth(0)).toContainText(pet.name);
        const expectedDate = pet.birthDate.replace(/\//g, '-');
        await expect(petRow.locator('td').nth(0)).toContainText(expectedDate);
        await expect(petRow.locator('td').nth(0)).toContainText(pet.type);
      });
    });

    test('TC_AP_02: Verify pet creation for an owner via a valid HTTP POST request', async ({ request }) => {
        await test.step('1. Send an HTTP POST request to add a new pet', async () => {
            // Using the 'davis' owner created in beforeAll
            const ownerId = testData.davisOwnerId;
            const response = await request.post(`owners/${ownerId}/pets/new`, {
                form: {
                    name: "API-Pet",
                    birthDate: "2022/02/20",
                    type: "cat"
                },
                maxRedirects: 0,
            });

            // Expected Result 1: Assert status 302 and Location header
            expect(response.status()).toBe(302);
            expect(response.headers().location).toContain(`/owners/${ownerId}`);
        });
    });
  });

  // User Story 4: Add Visit
  test.describe('User Story 4: Add Visit', () => {

    test('TC_AV_01: Verify successful addition of a new visit for a pet', async ({ page }) => {
      const visitDescription = 'Annual check-up';
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const todayInput = today.replace(/-/g, '/'); // YYYY/MM/DD

      await test.step("Precondition: Navigate to owner page with a pet", async () => {
        await page.goto(`owners/${testData.ownerWithPetId}`);
        await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible();
      });

      await test.step("1. Click the 'Add Visit' button", async () => {
        const petRow = page.locator('h2:has-text("Pets and Visits") + table').locator('tbody tr').first();
        await petRow.getByRole('link', { name: 'Add Visit' }).click();
        
        await expect(page).toHaveURL(new RegExp(`owners/${testData.ownerWithPetId}/pets/\\d+/visits/new`));
        await expect(page.getByRole('heading', { name: 'New Visit' })).toBeVisible();
        await expect(page.getByText('VisitPet')).toBeVisible(); // Pet's name is displayed
      });

      await test.step("2. Verify the 'Date' field is pre-filled with the current date", async () => {
        await expect(page.locator('#date')).toHaveValue(todayInput);
      });

      await test.step("3. Enter a 'Description' for the visit", async () => {
        await page.locator('#description').fill(visitDescription);
        await expect(page.locator('#description')).toHaveValue(visitDescription);
      });

      await test.step("4. Click the 'Add Visit' button", async () => {
        await page.getByRole('button', { name: 'Add Visit' }).click();
        await expect(page).toHaveURL(`owners/${testData.ownerWithPetId}`);

        // Verify the new visit is in the visits table for the pet
        const visitsTable = page.locator('table.table-condensed');
        const visitRow = visitsTable.locator('tbody tr').first();
        
        await expect(visitRow).toBeVisible();
        await expect(visitRow.locator('td').nth(0)).toHaveText(today);
        await expect(visitRow.locator('td').nth(1)).toHaveText(visitDescription);
      });
    });

    test('TC_AV_02: Verify visit creation for a pet via a valid HTTP POST request', async ({ request }) => {
        await test.step('1. Send an HTTP POST request to add a new visit', async () => {
            const ownerId = testData.ownerWithPetId;
            const petId = testData.petIdForVisit;

            const response = await request.post(`owners/${ownerId}/pets/${petId}/visits/new`, {
                form: {
                    date: "2023/10/26",
                    description: "API Test Visit"
                },
                maxRedirects: 0,
            });

            // Expected Result 1: Assert status 302 and Location header
            expect(response.status()).toBe(302);
            expect(response.headers().location).toContain(`/owners/${ownerId}`);
        });
    });
  });

  // User Story 5: View Veterinarians
  test.describe('User Story 5: View Veterinarians', () => {

    test('TC_VV_01: Verify the Veterinarians list is displayed on the UI', async ({ page }) => {
      await test.step('Precondition: Navigate to Home Page', async () => {
        await page.goto('./');
        await expect(page).toHaveTitle(/PetClinic/);
      });

      await test.step("1. Click on the 'Veterinarians' link in the navigation bar", async () => {
        await page.getByRole('link', { name: 'Veterinarians' }).click();
        
        // Expected results
        await expect(page).toHaveURL(/vets\.html/);
        await expect(page.getByRole('heading', { name: 'Veterinarians' })).toBeVisible();

        const vetsTable = page.locator('#vets');
        await expect(vetsTable).toBeVisible();
        await expect(vetsTable.getByText('Name')).toBeVisible();
        await expect(vetsTable.getByText('Specialties')).toBeVisible();
        
        const rows = vetsTable.locator('tbody tr');
        expect(await rows.count()).toBeGreaterThan(0);
        
        await expect(page.getByRole('link', { name: 'View as XML' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'View as JSON' })).toBeVisible();
      });
    });

    test('TC_VV_02: Verify API endpoint for Veterinarians returns a valid JSON response', async ({ request }) => {
        await test.step('1. Send an HTTP GET request for vets.json', async () => {
            const response = await request.get(`vets.json`);

            // Expected Result 1
            expect(response.status()).toBe(200);
            expect(response.headers()['content-type']).toContain('application/json');
            
            const jsonBody = await response.json();
            // Handle wrapper object if present (e.g. { vetList: [...] })
            const vetList = Array.isArray(jsonBody) ? jsonBody : jsonBody.vetList;
            expect(Array.isArray(vetList)).toBe(true);
            expect(vetList.length).toBeGreaterThan(0);

            // Assert properties of the first vet object
            const firstVet = vetList[0];
            expect(firstVet).toHaveProperty('id');
            expect(firstVet).toHaveProperty('firstName');
            expect(firstVet).toHaveProperty('lastName');
            expect(firstVet).toHaveProperty('specialties');
            expect(Array.isArray(firstVet.specialties)).toBe(true);
        });
    });

    test('TC_VV_03: Verify API endpoint for Veterinarians returns a valid XML response', async ({ request }) => {
        await test.step('1. Send an HTTP GET request for vets.xml', async () => {
            const response = await request.get(`vets.xml`);
            
            // Expected Result 1
            expect(response.status()).toBe(200);
            expect(response.headers()['content-type']).toContain('application/xml');
            
            const xmlBody = await response.text();
            expect(xmlBody).toContain('<?xml');
            expect(xmlBody).toContain('<vets>');
            expect(xmlBody).toContain('<vetList>');
            expect(xmlBody).toContain('</vetList>');
            expect(xmlBody).toContain('</vets>');
        });
    });
  });
});
