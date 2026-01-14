# Test Cases: Book Store Application

**Application URL:** `https://10.134.77.67/`  
**API Documentation:** `https://10.134.77.67/Help`
**Generated Date:** 2026-01-12

---

## 1. UI Test Cases

| Test Case ID | Module | Description | Type | Priority | Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-UI-001** | **Books** | Verify Book List visibility on Home Page | UI | High | 1. Navigate to home page.<br>2. Observe the "Book List" section. | "Book List" table is visible with columns: Author, Title, Genre, Year, Price. |
| **TC-UI-002** | **Books** | Add a new book with valid data | UI | High | 1. Navigate to home page.<br>2. In "Add New Book" section, select Author.<br>3. Enter Title, Year, Genre, Price.<br>4. Click "Save". | Book is added to the list and fields are cleared. |
| **TC-UI-003** | **Books** | Attempt to add book with empty required fields | UI | Medium | 1. Navigate to home page.<br>2. Leave Title empty.<br>3. Click "Save". | Error message displayed or save action prevented. |
| **TC-UI-004** | **Books** | Verify "Clear" button functionality | UI | Low | 1. Enter data into "Add New Book" fields.<br>2. Click "Clear". | All input fields are reset to default/empty. |
| **TC-UI-005** | **Authors** | Verify Author List visibility | UI | High | 1. Click "Authors" in navigation bar.<br>2. Observe "Author List" section. | "Author List" table is visible with columns: Author Id, Author Name. |
| **TC-UI-006** | **Authors** | Add a new author with valid name | UI | High | 1. Navigate to `/Home/Authors`.<br>2. Enter Name in "Add New Author" section.<br>3. Click "Save". | New author appears in the "Author List". |
| **TC-UI-007** | **Authors** | Attempt to add author with empty name | UI | Medium | 1. Navigate to `/Home/Authors`.<br>2. Leave Name empty.<br>3. Click "Save". | Save action rejected; validation error shown. |

---

## 2. API Test Cases

| Test Case ID | Module | Description | Type | Priority | Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-API-001** | **Books** | Get all books | API | High | 1. Send `GET /api/Books` request. | Status 200 OK; Response body contains list of books JSON. |
| **TC-API-002** | **Books** | Create a new book | API | High | 1. Send `POST /api/Books` with JSON payload (Title, Year, Price, Genre, AuthorId). | Status 201 Created; Response contains created book details. |
| **TC-API-003** | **Books** | Get book by ID | API | Medium | 1. Send `GET /api/Books/{id}` for existing ID. | Status 200 OK; Response matches requested book ID. |
| **TC-API-004** | **Books** | Update an existing book | API | Medium | 1. Send `PUT /api/Books/{id}` with updated JSON payload. | Status 200 OK or 204 No Content; Update reflected in subsequent GET. |
| **TC-API-005** | **Books** | Delete a book | API | Medium | 1. Send `DELETE /api/Books/{id}`. | Status 200 OK or 204 No Content; Book no longer retrievable. |
| **TC-API-006** | **Books** | Get non-existent book | API | Low | 1. Send `GET /api/Books/99999`. | Status 404 Not Found. |
| **TC-API-007** | **Authors** | Get all authors | API | High | 1. Send `GET /api/Authors`. | Status 200 OK; Response contains list of authors. |
| **TC-API-008** | **Authors** | Create a new author | API | High | 1. Send `POST /api/Authors` with payload `{"Name": "Test Author"}`. | Status 201 Created. |
| **TC-API-009** | **Customers** | Get customer by country | API | Medium | 1. Send `GET /Customers/GetCustomerByCountry?country=USA`. | Status 200 OK; Returns customers from specified country. |

---

## 3. End-to-End (E2E) Test Cases

| Test Case ID | Module | Description | Type | Priority | Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-E2E-001** | **Integration** | Create Author via API and verify in UI | E2E | High | 1. Call `POST /api/Authors` to create "API Author".<br>2. Open Browser to `/Home/Authors`.<br>3. Verify "API Author" exists in table. | Author created via API is visible in the UI table. |
| **TC-E2E-002** | **Integration** | Create Book via UI and verify via API | E2E | High | 1. In UI, add book "UI Book Test".<br>2. Call `GET /api/Books`.<br>3. Filter response for title "UI Book Test". | Book added via UI is present in the API response. |

---

## Notes for Automation

*   **SSL Configuration**: The application uses self-signed certificates. Automation scripts must set `ignoreHTTPSErrors: true`.
*   **Data Management**: 
    *   Books require an existing `AuthorId`. Retrieve list of authors first via `GET /api/Authors` to find a valid ID.
    *   Clean up test data using `DELETE` API endpoints after E2E tests.
