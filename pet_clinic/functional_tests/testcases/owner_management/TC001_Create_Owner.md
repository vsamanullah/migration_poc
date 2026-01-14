# Test Cases: Create Owner

**Use Case Reference**: UC-001 - Create Owner  
**Module**: Owner Management  
**Total Test Cases**: 5 (Optimized)  
**Generated From**: Live Application Exploration  
**Date Generated**: 2026-01-12  

---

## Background

**Common Preconditions**:
- Application is accessible at http://10.134.77.66:8080/petclinic/
- User is on the Home Page

**Test Environment**:
- Application URL: http://10.134.77.66:8080/petclinic/
- Test Database: H2 (Default)

---

## Test Cases

| Functional Area | Test Case ID | Description | Tags | Priority | Test Case Source | Covered in Legacy | Legacy Test Traceability | Test Steps | Expected Results |
|----------------|--------------|-------------|------|----------|------------------|-------------------|-------------------------|------------|------------------|
| Navigation | TC001-01 | Verify navigation to Add Owner page | @positive, UI, Smoke | High | New | N/A | Not in legacy | 1. Navigate to Home Page<br>2. Click 'Find owners'<br>3. Click 'Add Owner' | - 'New Owner' page displayed<br>- URL is /owners/new<br>- All fields (First Name, Last Name, Address, City, Telephone) visible |
| Functional | TC001-02 | Verify successful owner creation with valid data | @positive, Functional, Sanity | High | New | N/A | Not in legacy | 1. Navigate to 'Add Owner' page<br>2. Fill First Name: 'Test'<br>3. Fill Last Name: 'User'<br>4. Fill Address: '123 Test St'<br>5. Fill City: 'Testhaven'<br>6. Fill Telephone: '1234567890'<br>7. Click 'Add Owner' | - Redirects to 'Owner Information' page<br>- Owner name 'Test User' displayed<br>- Address and Telephone match input<br>- URL contains owner ID (e.g., /owners/{id}) |
| Data Validation | TC001-03 | Verify validation for empty required fields | @negative, Functional | Medium | New | N/A | Not in legacy | 1. Navigate to 'Add Owner' page<br>2. Leave all fields empty<br>3. Click 'Add Owner' | - Form not submitted<br>- Validation error messages displayed for required fields |
| Data Validation | TC001-04 | Verify validation for numeric telephone | @negative, Functional | Medium | New | N/A | Not in legacy | 1. Navigate to 'Add Owner' page<br>2. Fill valid details for Name/Address<br>3. Fill Telephone: 'abcdef'<br>4. Click 'Add Owner' | - Form not submitted<br>- Error message for telephone field indicating numeric requirement |
| API Testing | TC001-05 | Verify create owner via HTTP POST | @positive, API | High | New | N/A | Not in legacy | 1. Send POST to /petclinic/owners/new<br>2. Body (Form Data): firstName=API, lastName=Test, address=123 API St, city=APICity, telephone=0987654321, _method=post | - HTTP 302 Redirect to /owners/{id}<br>- Get new owner ID confirms creation |

---

## Test Data Requirements

### Test Data
| Data Type | Sample Values | Usage |
|-----------|---------------|-------|
| Valid Name | Test User | Positive scenarios |
| Valid Address | 123 Test St, Testhaven | Positive scenarios |
| Valid Phone | 1234567890 | Positive scenarios |
| Invalid Phone | abcdef | Negative scenarios |
