# Book Store Application – E2E Visual Flow Diagrams

## Table of Contents
- [Complete Book Addition Flow](#complete-book-addition-flow)
- [Book Management Flows](#book-management-flows)

---
## Introduction 
The Book Store Application is a web-based system for managing books, authors, and customer information. It provides a user interface for data entry and viewing, along with RESTful API endpoints for programmatic access to book and author management operations.

## Application Overview 
The application features a main navigation menu with three sections: **Home**, **Authors**, and **API**.

### Home Page (Book Management)
The Home page is divided into two sections:
- **Left Side**: Displays a list of existing books with options to edit or delete.
- **Right Side**: Contains the "Add New Book" form.

**Creating a Book:**
To create a new book, use the "Add New Book" section on the right. Fill in the details such as Author, Title, Year, Genre, and Price.
- Click **Save** to create the book.
- Click **Clear** to reset the form fields.
- Click **Cancel** to abort the operation.

**Editing a Book:**
To edit a book, locate it in the book list on the left and click the **Edit** (pencil icon) button. The details will populate the form on the right. Modify the desired fields and click **Update** to save changes, or **Cancel** to discard them.

**Deleting a Book:**
To delete a book, locate it in the list and click the **Delete** (trash icon) button. The book will be removed from the list.

### Authors Page (Author Management)
Navigate to the **Authors** page to manage author information. This page lists all available authors.

**Creating an Author:**
Use the "Add New Author" section on the right side. Enter the author's **Name**.
- Click **Save** to add the author.
- Click **Clear** to reset the form.
- Click **Cancel** to abort.

**Editing an Author:**
Select an author from the list and click the **Edit** button. The author's name will appear in the form on the right. Make changes and click **Update**, or **Cancel** to stop.

**Deleting an Author:**
Click the **Delete** icon next to an author in the list to remove them.

### API Page
The **API** page lists the RESTful endpoints exposed by the application, categorized by resource (e.g., Books, Authors).
- Clicking on an API category or endpoint provides detailed documentation on how to use it.
- **Navigation Note**: On the detailed API help pages, the "Help Page Home" link redirects you to the main API Help page, not the application Home page. To return to the main application from an API detail page, use the browser's **Back** button.





## Complete Book Addition Flow
*End-to-End workflow for adding a new book*

```
┌─────────────────────────────────────────────────────────────────┐
│                    BOOK ADDITION WORKFLOW                        │
└─────────────────────────────────────────────────────────────────┘

    START: Open Book Store Application
           │
           ▼
    ┌──────────────────────────────────────┐
    │  Add New Book Section                │
    └────────┬─────────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────────┐
    │  Select Author:                      │
    │  • Choose "Jane Smith" from dropdown │
    └────────┬─────────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────────┐
    │  Enter Book Details:                 │
    │  • Title: A New Beginning            │
    │  • Year: 2024                        │
    │  • Genre: Sci-Fi                     │
    │  • Price: 29.99                      │
    └────────┬─────────────────────────────┘
           │
           ▼
    ┌──────────────────┐
    │  Click "Save"    │ → Submit form
    └────────┬─────────┘
           │
           ▼
    ┌──────────────────────────────────────┐
    │  Book Added Successfully             │
    │  • Book appears in Book List         │
    │  • Shows book with all details       │
    │  • Edit and Delete icons available   │
    └────────┬─────────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────────┐
    │  Form Fields Cleared/Reset           │
    │  • Ready for next book entry         │
    └──────────────────────────────────────┘

    END: Book successfully added to inventory
```

---

## Book Management Flows

### Add New Book

1. Open Book Store Web Application
2. In 'Add New Book', select author 'Jane Smith'
3. Enter Title='A New Beginning', Year='2024', Genre='Sci-Fi', Price='29.99'
4. Click 'Save'
5. Book appears in Book List
6. Form fields cleared/reset

---

## Edit Book

1. Open Book Store Web Application
2. In 'Book List', locate 'The Great Adventure'
3. Click 'Edit' (pencil) icon
4. Change Price from '19.99' to '22.50'
5. Click 'Update Book'
6. Book in list shows Price '22.50'; form resets

---

## Delete Book

1. Open Book Store Web Application
2. In 'Book List', locate 'Mystery of the Lost City'
3. Click 'Delete' (trash) icon
4. If confirmation appears, confirm deletion
5. Book removed from the list

---

## Clear Add New Book Form

1. Open Book Store Web Application
2. In 'Add New Book' enter: Title='Test Title', Year='2025', Genre='Test Genre', Price='50.00'
3. Click 'Clear'
4. All fields reset to default values

---

## Cancel Edit

1. Open Book Store Web Application
2. In 'Book List' locate 'The Great Adventure' and click 'Edit'
3. Change Title to 'An Edited Adventure'
4. Click 'Cancel'
5. Form resets to 'Add New Book'; list title remains 'The Great Adventure'

---

## Flow Overview

```
Add New Book
    ↓
Edit Book
    ↓
Delete Book
    ↓
Clear Add New Book Form
    ↓
Cancel Edit
```
