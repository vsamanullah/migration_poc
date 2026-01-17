# Pet Clinic Functional Test Cases

## Common Configuration
| Variable | Value | Description |
|---|---|---|
| `{{BASE_URL}}` | `http://petclinic-legacy.ucgpoc.com` | The base URL of the Pet Clinic application (e.g., Target Environment) |

## Table of Contents
- [User Story 1: Create Owner](#user-story-1-create-owner)
- [User Story 2: Find Owner](#user-story-2-find-owner)
- [User Story 3: Add Pet](#user-story-3-add-pet)
- [User Story 4: Add Visit](#user-story-4-add-visit)
- [User Story 5: View Veterinarians](#user-story-5-view-veterinarians)

---

## User Story 1: Create Owner

### TC_CO_01: Verify navigation from Home Page to 'New Owner' page
| ID | Title | Priority | Type |
|---|---|---|---|
| TC_CO_01 | Verify navigation from Home Page to 'New Owner' page | High | Functional |

**Preconditions:**
1. User is on the Petclinic Home Page at `{{BASE_URL}}/petclinic/`.

**Test Steps:**
1. Click on the 'Find owners' link in the navigation bar.
2. On the 'Find Owners' page, click the 'Add Owner' button.

**Expected Results:**
1. The user is redirected to the 'Find Owners' page. The URL should be `{{BASE_URL}}/petclinic/owners/find`. The page title is 'Find Owners'.
2. The user is redirected to the 'New Owner' page. The page title is 'Owner' and the form heading is 'New Owner'.

---

### TC_CO_02: Verify successful creation of a new owner with valid data
| ID | Title | Priority | Type |
|---|---|---|---|
| TC_CO_02 | Verify successful creation of a new owner with valid data | High | Functional |

**Preconditions:**
1. User is on the 'New Owner' page at `{{BASE_URL}}/petclinic/owners/new`.

**Test Steps:**
1. Enter a valid 'First Name' (e.g., "John").
2. Enter a valid 'Last Name' (e.g., "Doe").
3. Enter a valid 'Address' (e.g., "123 Main St").
4. Enter a valid 'City' (e.g., "Metropolis").
5. Enter a valid 'Telephone' (e.g., "1234567890").
6. Click the 'Add Owner' button.

**Expected Results:**
1. The 'First Name' field accepts the input.
2. The 'Last Name' field accepts the input.
3. The 'Address' field accepts the input.
4. The 'City' field accepts the input.
5. The 'Telephone' field accepts the input.
6. The user is redirected to the 'Owner Information' page. The page displays the correct information entered in the previous steps (Name: John Doe, Address: 123 Main St, City: Metropolis, Telephone: 1234567890). The URL contains the new owner's ID (e.g., `{{BASE_URL}}/petclinic/owners/11`).

---

### TC_CO_03: Verify owner creation via a valid HTTP POST request
| ID | Title | Priority | Type |
|---|---|---|---|
| TC_CO_03 | Verify owner creation via a valid HTTP POST request | High | API |

**Preconditions:**
1. The application is running and accessible.

**Test Steps:**
1. Send an HTTP POST request to `{{BASE_URL}}/petclinic/owners/new` with the following form data:
   - `firstName`: "Api"
   - `lastName`: "User"
   - `address`: "456 API Ave"
   - `city`: "Testville"
   - `telephone`: "0987654321"

**Expected Results:**
1. The server responds with an HTTP status code 302 (Found/Redirect). The `Location` header in the response points to the newly created owner's information page (e.g., `/petclinic/owners/12`).

---

## User Story 2: Find Owner

### TC_FO_01: Verify finding a single owner using an exact last name search
| ID | Title | Priority | Type |
|---|---|---|---|
| TC_FO_01 | Verify finding a single owner using an exact last name search | High | Functional |

**Preconditions:**
1. An owner with the last name "Davis" exists in the system.
2. User is on the 'Find Owners' page at `{{BASE_URL}}/petclinic/owners/find`.

**Test Steps:**
1. Enter "Davis" in the 'Last name' search field.
2. Click the 'Find Owner' button.

**Expected Results:**
1. The search field accepts the input "Davis".
2. The user is redirected to the 'Owner Information' page for the owner with the last name "Davis". All details for that specific owner are displayed correctly.

---

### TC_FO_02: Verify listing multiple owners with a partial last name search
| ID | Title | Priority | Type |
|---|---|---|---|
| TC_FO_02 | Verify listing multiple owners with a partial last name search | High | Functional |

**Preconditions:**
1. At least two owners with last names containing "es" exist in the system (e.g., "Esteban", "Jones").
2. User is on the 'Find Owners' page at `{{BASE_URL}}/petclinic/owners/find`.

**Test Steps:**
1. Enter "es" in the 'Last name' search field.
2. Click the 'Find Owner' button.

**Expected Results:**
1. The search field accepts the input "es".
2. The user is shown the 'Owners' results page, which displays a table of owners. The table includes all owners whose last names contain "es". The table has columns: 'Name', 'Address', 'City', 'Telephone', and 'Pets'.

---

### TC_FO_03: Verify listing all owners with an empty search field
| ID | Title | Priority | Type |
|---|---|---|---|
| TC_FO_03 | Verify listing all owners with an empty search field | High | Functional |

**Preconditions:**
1. Multiple owners exist in the system.
2. User is on the 'Find Owners' page at `{{BASE_URL}}/petclinic/owners/find`.

**Test Steps:**
1. Leave the 'Last name' search field empty.
2. Click the 'Find Owner' button.

**Expected Results:**
1. The search field remains empty.
2. The user is shown the 'Owners' results page, which displays a table listing all owners in the system. The table has columns: 'Name', 'Address', 'City', 'Telephone', and 'Pets'.

---

## User Story 3: Add Pet

### TC_AP_01: Verify successful addition of a new pet to an existing owner
| ID | Title | Priority | Type |
|---|---|---|---|
| TC_AP_01 | Verify successful addition of a new pet to an existing owner | High | Functional |

**Preconditions:**
1. An owner named 'Test User' exists in the system.
2. User is on the 'Owner Information' page for 'Test User'.

**Test Steps:**
1. Click the 'Add New Pet' button.
2. On the 'New Pet' page, enter a 'Name' for the pet (e.g., "Fido").
3. Enter a valid 'Birth Date' in YYYY/MM/DD format (e.g., "2020/01/15").
4. Select a 'Type' from the dropdown (e.g., "dog").
5. Click the 'Add Pet' button.

**Expected Results:**
1. The user is redirected to the 'New Pet' page. The 'Owner' field is pre-populated and read-only with 'Test User'.
2. The 'Name' field accepts the input.
3. The 'Birth Date' field accepts the input.
4. The 'Type' dropdown allows selection.
5. The user is redirected back to the 'Owner Information' page for 'Test User'. A new table entry for the pet "Fido" appears under the 'Pets and Visits' section, showing the correct Name, Birth Date, and Type.

---

### TC_AP_02: Verify pet creation for an owner via a valid HTTP POST request
| ID | Title | Priority | Type |
|---|---|---|---|
| TC_AP_02 | Verify pet creation for an owner via a valid HTTP POST request | High | API |

**Preconditions:**
1. An owner with a known ID exists (e.g., Owner ID `7`).
2. The application is running and accessible.

**Test Steps:**
1. Send an HTTP POST request to `{{BASE_URL}}/petclinic/owners/7/pets/new` with the following form data:
   - `name`: "API-Pet"
   - `birthDate`: "2022/02/20"
   - `type`: "cat"

**Expected Results:**
1. The server responds with an HTTP status code 302 (Found/Redirect). The `Location` header in the response points back to the owner's information page (`/petclinic/owners/7`).

---

## User Story 4: Add Visit

### TC_AV_01: Verify successful addition of a new visit for a pet
| ID | Title | Priority | Type |
|---|---|---|---|
| TC_AV_01 | Verify successful addition of a new visit for a pet | High | Functional |

**Preconditions:**
1. An owner with a pet exists in the system.
2. User is on the 'Owner Information' page for that owner.

**Test Steps:**
1. Locate the pet in the 'Pets and Visits' section and click the 'Add Visit' button next to its name.
2. Verify the 'Date' field is pre-filled with the current date.
3. Enter a 'Description' for the visit (e.g., "Annual check-up").
4. Click the 'Add Visit' button.

**Expected Results:**
1. The user is redirected to the 'New Visit' page. The pet's name is displayed.
2. The 'Date' field shows today's date in YYYY/MM/DD format.
3. The 'Description' field shows the input.
4. The user is redirected back to the 'Owner Information' page. Under the corresponding pet's details, a new entry in the visits table appears, showing the correct visit date and the description "Annual check-up".

---

### TC_AV_02: Verify visit creation for a pet via a valid HTTP POST request
| ID | Title | Priority | Type |
|---|---|---|---|
| TC_AV_02 | Verify visit creation for a pet via a valid HTTP POST request | High | API |

**Preconditions:**
1. An owner with a pet exists (e.g., Owner ID `7`, Pet ID `8`).
2. The application is running and accessible.

**Test Steps:**
1. Send an HTTP POST request to `{{BASE_URL}}/petclinic/owners/7/pets/8/visits/new` with the following form data:
   - `date`: "2023/10/26"
   - `description`: "API Test Visit"

**Expected Results:**
1. The server responds with an HTTP status code 302 (Found/Redirect). The `Location` header in the response points back to the owner's information page (`/petclinic/owners/7`).

---

## User Story 5: View Veterinarians

### TC_VV_01: Verify the Veterinarians list is displayed on the UI
| ID | Title | Priority | Type |
|---|---|---|---|
| TC_VV_01 | Verify the Veterinarians list is displayed on the UI | High | Functional |

**Preconditions:**
1. User is on the Petclinic Home Page at `{{BASE_URL}}/petclinic/`.

**Test Steps:**
1. Click on the 'Veterinarians' link in the navigation bar.

**Expected Results:**
1. The user is redirected to the 'Veterinarians' page. The page displays a table with 'Name' and 'Specialties' columns. The table is populated with veterinarian data. 'View as XML' and 'View as JSon' links are present at the bottom of the page.

---

### TC_VV_02: Verify API endpoint for Veterinarians returns a valid JSON response
| ID | Title | Priority | Type |
|---|---|---|---|
| TC_VV_02 | Verify API endpoint for Veterinarians returns a valid JSON response | High | API |

**Preconditions:**
1. The application is running and accessible.

**Test Steps:**
1. Send an HTTP GET request to `{{BASE_URL}}/petclinic/vets.json`.

**Expected Results:**
1. The server responds with an HTTP status code 200 (OK). The `Content-Type` header is `application/json`. The response body contains a valid JSON array of veterinarian objects.

---

### TC_VV_03: Verify API endpoint for Veterinarians returns a valid XML response
| ID | Title | Priority | Type |
|---|---|---|---|
| TC_VV_03 | Verify API endpoint for Veterinarians returns a valid XML response | High | API |

**Preconditions:**
1. The application is running and accessible.

**Test Steps:**
1. Send an HTTP GET request to `{{BASE_URL}}/petclinic/vets.xml`.

**Expected Results:**
1. The server responds with an HTTP status code 200 (OK). The `Content-Type` header is `application/xml`. The response body contains a valid XML document representing the list of veterinarians.
