# PetClinic Application – E2E Visual Flow Diagrams

## Table of Contents
- [Complete Owner Onboarding Flow](#complete-owner-onboarding-flow)
- [Owner Management Flows](#owner-management-flows)
- [Pet Management Flows](#pet-management-flows)
- [Visit Management Flow](#visit-management-flow)
- [Veterinarian Management Flow](#veterinarian-management-flow)
- [Complete System Flow Overview](#complete-system-flow-overview)

---
## Introduction
The Pet Clinic Application is a Spring Framework-based veterinary clinic management system that enables clinic staff to manage pet owners, their pets, veterinarians, and visit records. The application provides a web-based user interface for data management and RESTful API endpoints for programmatic access.

## Application Overview
The application features a main navigation menu with the following sections: **Home**, **Find owners**, **Veterinarians**, and **Error**.

### Home Page
The landing page of the application, welcoming users and displaying the main navigation options.

### Find Owners Page (Owner & Pet Management)
This section is central to the clinic's operations, allowing staff to manage owners, pets, and visits.
- **Search**: Users can search for owners by their **Last Name**. Leaving the search field empty and clicking **Find Owner** returns a list of all owners.
- **Add Owner**: A direct link to register a new client.
- **Owner Information**: Once an owner is selected (or added), their details are displayed along with list of their pets. From here, users can:
    - **Edit Owner**: Update the owner's personal information.
    - **Add New Pet**: Register a new pet to the owner.
    - **Edit Pet**: Modify an existing pet's details.
    - **Add Visit**: Schedule a new visit for a specific pet.

### Veterinarians Page
Displays a list of all veterinarians working at the clinic.
- **List View**: Shows the names and specialties of all vets.
- **Export**: Provides options to view the data in **XML** or **JSON** format via the links at the bottom of the page.

### Error Page
A dedicated page to display application errors smoothly when they occur during operation.

## Complete Owner Onboarding Flow
*End-to-End workflow from adding a new owner to scheduling a visit*

```
┌─────────────────────────────────────────────────────────────────┐
│                    OWNER ONBOARDING WORKFLOW                     │
└─────────────────────────────────────────────────────────────────┘

    START: Open PetClinic Application
           │
           ▼
    ┌──────────────────┐
    │  Find Owners     │ → Click "Find owners" from navigation menu
    └────────┬─────────┘
           │
           ▼
    ┌──────────────────┐
    │  Add Owner       │ → Click "Add Owner" button
    └────────┬─────────┘
           │
           ▼
    ┌──────────────────────────────────────┐
    │  Enter Owner Details:                │
    │  • First Name: John                  │
    │  • Last Name: Smith                  │
    │  • Address: 123 Main St              │
    │  • City: Springfield                 │
    │  • Telephone: 1234567890             │
    └────────┬─────────────────────────────┘
           │
           ▼
    ┌──────────────────┐
    │  Click "Add      │ → Submit form
    │  Owner" button   │
    └────────┬─────────┘
           │
           ▼
    ┌──────────────────────────────────────┐
    │  Owner Information Page Displayed    │
    │  • Shows owner details               │
    │  • Shows "Add New Pet" button        │
    │  • Shows "Edit Owner" button         │
    └────────┬─────────────────────────────┘
           │
           ▼
    ┌──────────────────┐
    │  Add New Pet     │ → Click "Add New Pet" button
    └────────┬─────────┘
           │
           ▼
    ┌──────────────────────────────────────┐
    │  Enter Pet Details:                  │
    │  • Name: Fluffy                      │
    │  • Birth Date: 2020/01/15            │
    │  • Type: cat (dropdown)              │
    └────────┬─────────────────────────────┘
           │
           ▼
    ┌──────────────────┐
    │  Click "Add Pet" │ → Submit pet form
    │  button          │
    └────────┬─────────┘
           │
           ▼
    ┌──────────────────────────────────────┐
    │  Pet Added Successfully              │
    │  • Pet listed under owner            │
    │  • Shows "Add Visit" link            │
    │  • Shows "Edit Pet" link             │
    └────────┬─────────────────────────────┘
           │
           ▼
    ┌──────────────────┐
    │  Add Visit       │ → Click "Add Visit" link for pet
    └────────┬─────────┘
           │
           ▼
    ┌──────────────────────────────────────┐
    │  Enter Visit Details:                │
    │  • Date: 2026/01/16 (pre-filled)     │
    │  • Description: Annual Checkup       │
    └────────┬─────────────────────────────┘
           │
           ▼
    ┌──────────────────┐
    │  Click "Add      │ → Submit visit form
    │  Visit" button   │
    └────────┬─────────┘
           │
           ▼
    ┌──────────────────────────────────────┐
    │  Visit Added Successfully            │
    │  • Visit listed in visit history     │
    │  • Shows visit date and description  │
    └──────────────────────────────────────┘

    END: Complete owner onboarding with pet and visit
```


---

## Additional Test Flows

### Add Owner
1. Open PetClinic App
2. Click "Find owners" in navigation
3. Click "Add Owner" button
4. Enter Owner Details (First Name, Last Name, Address, City, Telephone)
5. Click "Add Owner" button
6. Owner Information page displayed

---

### Find and Edit Owner
1. Open PetClinic App
2. Click "Find owners" in navigation
3. Enter Last Name or leave blank, click "Find Owner"
4. Select owner from search results
5. Click "Edit Owner" button
6. Update Owner Details
7. Click "Update Owner" button
8. Updated Owner Information displayed

---

### Add New Pet
1. Find and select existing owner
2. Click "Add New Pet" button
3. Enter Pet Details (Name, Birth Date: YYYY/MM/DD, Type)
4. Click "Add Pet" button
5. Pet listed under owner's "Pets and Visits" section

---

### Edit Pet
1. Find owner with pets
2. Click "Edit Pet" link for specific pet
3. Update Pet Details (Name, Birth Date, Type)
4. Click "Update Pet" button
5. Updated pet information displayed

---

### Add Visit
1. Find owner with pet
2. Click "Add Visit" link for specific pet
3. Enter Visit Details (Date: pre-filled, Description)
4. Click "Add Visit" button
5. Visit listed in "Previous Visits" section

---

### View Veterinarians
1. From any page
2. Click "Veterinarians" in navigation menu
3. Veterinarians list displayed with names and specialties

---

### Veterinarians JSON API
- Endpoint: GET /vets.json
- Returns veterinarians data in JSON format

---

### Veterinarians XML API
- Endpoint: GET /vets.xml
- Returns veterinarians data in XML format

---

## Quick Reference

**Date Format:** YYYY/MM/DD (input) �' YYYY-MM-DD (display)

**Required Fields:**
- Owner: First Name, Last Name, Address, City, Telephone (numeric)
- Pet: Name, Birth Date, Type
- Visit: Date, Description

**Navigation:** Find Owners | Veterinarians | Home
