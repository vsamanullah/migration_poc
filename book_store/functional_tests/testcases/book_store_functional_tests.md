# Book Store App - UI, API & E2E Test Cases v1.0

## UI Test Cases

### TC_BOOK_AUTHOR_UI_001: Verify the "Book List" table is visible with all specified columns on the Home page
**Priority:** High  
**Type:** Functional  
**Preconditions:** The user is logged into the application and is on the Home page.

**Test Steps:**
1. Navigate to the Home page.
2. Locate the "Book List" section.
3. Observe the table headers in the "Book List".

**Expected Result:**
1. The Home page loads successfully.
2. The "Book List" table is visible on the page.
3. The table contains the columns: "Author", "Title", "Genre", "Year", and "Price".

---

### TC_BOOK_AUTHOR_UI_002: Verify successful addition of a new book with valid data
**Priority:** High  
**Type:** Functional  
**Preconditions:** The user is on the Home page. An author exists in the system to be selected.

**Test Steps:**
1. Navigate to the "Add New Book" section.
2. Select a valid author from the "Author" dropdown.
3. Enter a valid title in the "Title" field.
4. Enter a valid genre in the "Genre" field.
5. Enter a valid year in the "Year" field.
6. Enter a valid price in the "Price" field.
7. Click the "Save" button.
8. Observe the "Book List" table and the input fields in the "Add New Book" section.

**Expected Result:**
1. The "Add New Book" form is visible.
2. The author is selected.
3. The title is entered.
4. The genre is entered.
5. The year is entered.
6. The price is entered.
7. The save action is successful.
8. The newly added book appears as the last row in the "Book List" table with the correct details. All input fields in the "Add New Book" section are cleared.

**Test Data:**
- Author: John Smith
- Title: A Guide to Testing
- Genre: Technology
- Year: 2023
- Price: 49.99

---

### TC_BOOK_AUTHOR_UI_003: Verify that a book cannot be added with an empty "Title" field
**Priority:** High  
**Type:** Negative  
**Preconditions:** The user is on the Home page.

**Test Steps:**
1. Navigate to the "Add New Book" section.
2. Select a valid author.
3. Leave the "Title" field empty.
4. Fill in other fields (Genre, Year, Price) with valid data.
5. Click the "Save" button.
6. Observe the application's response.

**Expected Result:**
1. The "Add New Book" form is visible.
2. The author is selected.
3. The "Title" field is empty.
4. Other fields are filled.
5. The "Save" button is either disabled or clicking it does not add the book.
6. A validation error message like "Title is required" is displayed next to the "Title" field or in a summary area. The book is not added to the "Book List".

**Test Data:**
- Author: John Smith
- Title: (empty)
- Genre: Technology
- Year: 2023
- Price: 49.99

---

### TC_BOOK_AUTHOR_UI_004: Verify the "Clear" button functionality in the "Add New Book" section
**Priority:** Medium  
**Type:** Functional  
**Preconditions:** The user is on the Home page.

**Test Steps:**
1. Navigate to the "Add New Book" section.
2. Enter data into all the input fields (Author, Title, Genre, Year, Price).
3. Click the "Clear" button.
4. Observe the input fields.

**Expected Result:**
1. The "Add New Book" form is visible.
2. All fields are populated with test data.
3. The "Clear" button is clicked.
4. All input fields (Title, Genre, Year, Price) are reset to their default empty state, and the "Author" dropdown is reset to its default selection.

**Test Data:**
- Author: Jane Doe
- Title: The Art of Clearing
- Genre: Self-Help
- Year: 2021
- Price: 19.95

---

### TC_BOOK_AUTHOR_UI_005: Verify the "Author List" table is visible with all specified columns
**Priority:** High  
**Type:** Functional  
**Preconditions:** The user is logged into the application and is on the Home page.

**Test Steps:**
1. Navigate to the Home page.
2. Locate the "Author List" section.
3. Observe the table headers in the "Author List".

**Expected Result:**
1. The Home page loads successfully.
2. The "Author List" table is visible on the page.
3. The table contains the columns: "Author Id" and "Author Name".

---

### TC_BOOK_AUTHOR_UI_006: Verify successful addition of a new author with a valid name
**Priority:** High  
**Type:** Functional  
**Preconditions:** The user is on the Home page.

**Test Steps:**
1. Navigate to the "Add New Author" section.
2. Enter a valid name in the "Author Name" field.
3. Click the "Save" button.
4. Observe the "Author List" table.

**Expected Result:**
1. The "Add New Author" form is visible.
2. The author name is entered.
3. The save action is successful.
4. The newly added author appears in the "Author List" table with a generated "Author Id" and the correct "Author Name".

**Test Data:**
- Author Name: William Shakespeare

---

### TC_BOOK_AUTHOR_UI_007: Verify that an author cannot be added with an empty "Author Name" field
**Priority:** High  
**Type:** Negative  
**Preconditions:** The user is on the Home page.

**Test Steps:**
1. Navigate to the "Add New Author" section.
2. Leave the "Author Name" field empty.
3. Click the "Save" button.
4. Observe the application's response.

**Expected Result:**
1. The "Add New Author" form is visible.
2. The "Author Name" field is empty.
3. The "Save" button is either disabled or clicking it does not add the author.
4. A validation error message like "Author Name is required" is displayed. The author is not added to the "Author List".

---

### TC_BOOK_AUTHOR_UI_008: Verify validation on "Year" field for non-numeric input
**Priority:** Medium  
**Type:** Negative  
**Preconditions:** The user is on the Home page.

**Test Steps:**
1. Navigate to the "Add New Book" section.
2. Fill all fields with valid data, but enter non-numeric text in the "Year" field.
3. Click the "Save" button.

**Expected Result:**
1. The "Add New Book" form is visible.
2. The data is entered.
3. A validation error message like "Year must be a number" is displayed, and the book is not saved to the list.

**Test Data:**
- Author: John Smith
- Title: A Guide to Testing
- Genre: Technology
- Year: Two Thousand Twenty-Three
- Price: 49.99

---

### TC_BOOK_AUTHOR_UI_009: Verify validation on "Price" field for non-numeric input
**Priority:** Medium  
**Type:** Negative  
**Preconditions:** The user is on the Home page.

**Test Steps:**
1. Navigate to the "Add New Book" section.
2. Fill all fields with valid data, but enter non-numeric text in the "Price" field.
3. Click the "Save" button.

**Expected Result:**
1. The "Add New Book" form is visible.
2. The data is entered.
3. A validation error message like "Price must be a valid number" is displayed, and the book is not saved to the list.

**Test Data:**
- Author: John Smith
- Title: A Guide to Testing
- Genre: Technology
- Year: 2023
- Price: Forty-Nine Ninety-Nine

---

## API Test Cases

### Books API

#### TC_BOOKS_API_001: Verify successful retrieval of all books
**Priority:** High  
**Type:** Functional  
**Preconditions:** API server is running. At least one book exists in the database.

**Test Steps:**
1. Send a GET request to the `/api/Books` endpoint.

**Expected Result:**
1. The API returns a `200 OK` status code. The response body is a JSON array containing book objects. Each object has fields like author, title, genre, year, and price.

---

#### TC_BOOKS_API_002: Verify successful creation of a new book
**Priority:** High  
**Type:** Functional  
**Preconditions:** API server is running.

**Test Steps:**
1. Construct a valid JSON payload for a new book.
2. Send a POST request to the `/api/Books` endpoint with the JSON payload.

**Expected Result:**
1. The JSON payload is created.
2. The API returns a `201 Created` status code. The response body contains the details of the newly created book, including a system-generated ID.

**Test Data:**
```json
{
  "author": "API Test Author",
  "title": "API Testing 101",
  "genre": "Tech",
  "year": 2024,
  "price": 50.00
}
```

---

#### TC_BOOKS_API_003: Verify retrieval of a specific book by an existing ID
**Priority:** High  
**Type:** Functional  
**Preconditions:** API server is running. A book with a known ID exists.

**Test Steps:**
1. Create a book via POST request to get a valid book ID (e.g., `bookId`).
2. Send a GET request to `/api/Books/{bookId}`.

**Expected Result:**
1. The book is created and its ID is obtained.
2. The API returns a `200 OK` status code. The response body is a JSON object containing the details of the book matching the requested `bookId`.

---

#### TC_BOOKS_API_004: Verify updating an existing book
**Priority:** High  
**Type:** Functional  
**Preconditions:** API server is running. A book with a known ID exists.

**Test Steps:**
1. Create a book via POST request to get a valid book ID (e.g., `bookId`).
2. Construct a JSON payload with updated data for the book.
3. Send a PUT request to `/api/Books/{bookId}` with the updated payload.
4. Send a GET request to `/api/Books/{bookId}` to verify the update.

**Expected Result:**
1. The book is created and its ID is obtained.
2. The updated payload is created.
3. The API returns a `200 OK` or `204 No Content` status code.
4. The API returns a `200 OK` status code, and the response body reflects the changes made in the PUT request.

**Test Data:**
```json
{
  "title": "API Testing 101 - Updated"
}
```

---

#### TC_BOOKS_API_005: Verify deleting an existing book
**Priority:** High  
**Type:** Functional  
**Preconditions:** API server is running. A book with a known ID exists.

**Test Steps:**
1. Create a book via POST request to get a valid book ID (e.g., `bookId`).
2. Send a DELETE request to `/api/Books/{bookId}`.
3. Send a GET request to `/api/Books/{bookId}` to confirm deletion.

**Expected Result:**
1. The book is created and its ID is obtained.
2. The API returns a `200 OK` or `204 No Content` status code.
3. The API returns a `404 Not Found` status code.

---

#### TC_BOOKS_API_006: Verify retrieval of a book with a non-existent ID
**Priority:** Medium  
**Type:** Negative  
**Preconditions:** API server is running.

**Test Steps:**
1. Send a GET request to `/api/Books/{id}` using an ID that is known not to exist (e.g., 99999).

**Expected Result:**
1. The API returns a `404 Not Found` status code.

---

#### TC_BOOKS_API_007: Verify creating a book with invalid data (e.g., missing title)
**Priority:** High  
**Type:** Negative  
**Preconditions:** API server is running.

**Test Steps:**
1. Construct a JSON payload for a new book but omit the required 'title' field.
2. Send a POST request to `/api/Books` with the invalid payload.

**Expected Result:**
1. The invalid payload is created.
2. The API returns a `400 Bad Request` status code. The response body contains an error message indicating that the 'title' field is required.

**Test Data:**
```json
{
  "author": "API Test Author",
  "genre": "Tech",
  "year": 2024,
  "price": 50.00
}
```

---

### Authors API

#### TC_AUTHORS_API_001: Verify successful retrieval of all authors
**Priority:** High  
**Type:** Functional  
**Preconditions:** API server is running. At least one author exists in the database.

**Test Steps:**
1. Send a GET request to the `/api/Authors` endpoint.

**Expected Result:**
1. The API returns a `200 OK` status code. The response body is a JSON array containing author objects.

---

#### TC_AUTHORS_API_002: Verify successful creation of a new author
**Priority:** High  
**Type:** Functional  
**Preconditions:** API server is running.

**Test Steps:**
1. Construct a valid JSON payload for a new author.
2. Send a POST request to `/api/Authors` with the payload.

**Expected Result:**
1. The payload is created.
2. The API returns a `201 Created` status code.

**Test Data:**
```json
{
  "authorName": "API Author"
}
```

---

#### TC_AUTHORS_API_003: Verify updating an existing author
**Priority:** High  
**Type:** Functional  
**Preconditions:** API server is running. An author with a known ID exists.

**Test Steps:**
1. Create an author via POST to get a valid ID (e.g., `authorId`).
2. Construct a JSON payload with an updated name.
3. Send a PUT request to `/api/Authors/{authorId}` with the updated payload.
4. Send a GET request to `/api/Authors` and verify the list contains the updated author name.

**Expected Result:**
1. The author is created and its ID is obtained.
2. The updated payload is created.
3. The API returns a `200 OK` or `204 No Content` status code.
4. The response to the GET request includes the author with the updated name.

**Test Data:**
```json
{
  "authorName": "API Author Updated"
}
```

---

#### TC_AUTHORS_API_004: Verify deleting an existing author
**Priority:** High  
**Type:** Functional  
**Preconditions:** API server is running. An author with a known ID exists.

**Test Steps:**
1. Create an author via POST to get a valid ID (e.g., `authorId`).
2. Send a DELETE request to `/api/Authors/{authorId}`.
3. Send a GET request to `/api/Authors/{authorId}` (assuming this endpoint exists) to confirm deletion.

**Expected Result:**
1. The author is created and its ID is obtained.
2. The API returns a `200 OK` or `204 No Content` status code.
3. The API returns a `404 Not Found` status code.

---

### Customers API

#### TC_CUSTOMERS_API_001: Verify retrieval of customers by a valid country
**Priority:** High  
**Type:** Functional  
**Preconditions:** API server is running. The database contains customers from the 'USA'.

**Test Steps:**
1. Send a GET request to `/Customers/GetCustomerByCountry?country=USA`.

**Expected Result:**
1. The API returns a `200 OK` status code. The response body is a JSON array containing customer objects, where each customer's country is 'USA'.

---

#### TC_CUSTOMERS_API_002: Verify retrieval of customers for a country with no matching records
**Priority:** Medium  
**Type:** Functional  
**Preconditions:** API server is running. No customers exist for the country 'Utopia'.

**Test Steps:**
1. Send a GET request to `/Customers/GetCustomerByCountry?country=Utopia`.

**Expected Result:**
1. The API returns a `200 OK` status code. The response body is an empty JSON array `[]`.

---

## End-to-End Integration Test Cases

### TC_E2E_INTEGRATION_001: Verify an author created via API is displayed in the UI
**Priority:** High  
**Type:** End to End  
**Preconditions:** API and UI services are running and accessible. User has access to the UI.

**Test Steps:**
1. Construct a JSON payload for a new, unique author.
2. Send a POST request to the `/api/Authors` endpoint.
3. Verify the API response is `201 Created`.
4. Open a web browser and navigate to the application's Home page.
5. Locate the "Author List" table.
6. Search for the author created in Step 1.

**Expected Result:**
1. The payload is created with a unique name like "E2E Author Test".
2. The API request is successful.
3. The API returns `201 Created`.
4. The Home page loads successfully.
5. The "Author List" is visible.
6. The "Author List" table contains a row with the "Author Name" matching the one created via the API ("E2E Author Test").

**Test Data:**
- Author Name: E2E Author Test

---

### TC_E2E_INTEGRATION_002: Verify a book created via UI is retrievable via API
**Priority:** High  
**Type:** End to End  
**Preconditions:** API and UI services are running and accessible. User has access to the UI. An author exists for selection.

**Test Steps:**
1. Open a web browser and navigate to the "Add New Book" section on the Home page.
2. Fill in the book details with a unique title.
3. Click "Save".
4. Verify the book appears in the UI's "Book List".
5. Send a GET request to the `/api/Books` endpoint.
6. Filter/search the JSON response for the book created in Step 2.

**Expected Result:**
1. The form is accessible.
2. The book details are entered.
3. The book is saved successfully.
4. The new book is visible in the UI table.
5. The API returns a `200 OK` status code with a list of books.
6. The JSON array in the response contains a book object with the "Title" matching the one created via the UI ("UI Book Test").

**Test Data:**
- Title: UI Book Test
- Genre: E2E
- Year: 2025
- Price: 99.99
