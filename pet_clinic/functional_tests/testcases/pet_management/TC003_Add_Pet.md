# Test Cases: Add Pet

**Use Case Reference**: UC-003 - Add Pet  
**Module**: Pet Management  
**Total Test Cases**: 4 (Optimized)  
**Generated From**: Live Application Exploration  
**Date Generated**: 2026-01-12  

---

## Background

**Common Preconditions**:
- Owner exists (e.g., 'Test User')
- User is on Owner Information page

**Test Environment**:
- Application URL: http://10.134.77.66:8080/petclinic/

---

## Test Cases

| Functional Area | Test Case ID | Description | Tags | Priority | Test Case Source | Covered in Legacy | Legacy Test Traceability | Test Steps | Expected Results |
|----------------|--------------|-------------|------|----------|------------------|-------------------|-------------------------|------------|------------------|
| Functional | TC003-01 | Verify successful pet creation | @positive, Functional, Smoke | High | New | N/A | Not in legacy | 1. Navigate to Owner Information page<br>2. Click 'Add New Pet'<br>3. Enter Name: 'Fluffy'<br>4. Enter Birth Date: '2020/01/01'<br>5. Select Type: 'cat'<br>6. Click 'Add Pet' | - Redirects to Owner Information page<br>- New pet 'Fluffy' appears in Pets and Visits table<br>- Details (Date, Type) match input |
| Data Validation | TC003-02 | Verify date format validation | @negative, Functional | Medium | New | N/A | Not in legacy | 1. Navigate to Add Pet page<br>2. Enter Name: 'DateTest'<br>3. Enter Birth Date: 'invalid-date'<br>4. Select Type: 'dog'<br>5. Click 'Add Pet' | - Form not submitted<br>- Validation error near Birth Date field |
| Data Validation | TC003-03 | Verify required fields for pet | @negative, Functional | Medium | New | N/A | Not in legacy | 1. Navigate to Add Pet page<br>2. Leave Name and Date empty<br>3. Click 'Add Pet' | - Form not submitted<br>- 'is required' or similar error messages displayed |
| API Testing | TC003-04 | Verify add pet via HTTP POST | @positive, API | High | New | N/A | Not in legacy | 1. POST to /petclinic/owners/{ownerId}/pets/new<br>2. Form Data: name=APIPet, birthDate=2021/05/05, type=dog | - HTTP 302 Redirect<br>- Pet added to owner |

---

## Test Data Requirements

### Test Data
| Data Type | Sample Values | Usage |
|-----------|---------------|-------|
| Valid Name | Fluffy | Positive |
| Valid Date | 2020/01/01 | Positive (YYYY/MM/DD) |
| Invalid Date | not-a-date | Negative |
| Pet Type | cat, dog, lizard | Positive |
