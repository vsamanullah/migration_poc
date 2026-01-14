# Test Cases: Find Owner

**Use Case Reference**: UC-002 - Find Owner  
**Module**: Owner Management  
**Total Test Cases**: 4 (Optimized)  
**Generated From**: Live Application Exploration  
**Date Generated**: 2026-01-12  

---

## Background

**Common Preconditions**:
- Application is accessible
- At least one owner exists (e.g., 'Test User')

**Test Environment**:
- Application URL: http://10.134.77.66:8080/petclinic/

---

## Test Cases

| Functional Area | Test Case ID | Description | Tags | Priority | Test Case Source | Covered in Legacy | Legacy Test Traceability | Test Steps | Expected Results |
|----------------|--------------|-------------|------|----------|------------------|-------------------|-------------------------|------------|------------------|
| Functional | TC002-01 | Verify find owner by last name (Exact match) | @positive, Functional, Smoke | High | New | N/A | Not in legacy | 1. Navigate to 'Find owners'<br>2. Enter Last Name: 'User'<br>3. Click 'Find Owner' | - Redirects to Owner Information page<br>- Details for 'Test User' displayed |
| Functional | TC002-02 | Verify find owner returns list for multiple matches (or partial) | @positive, Functional | Medium | New | N/A | Not in legacy | 1. Navigate to 'Find owners'<br>2. Enter Last Name (that has multiple matches, e.g., common name or empty for all)<br>3. Click 'Find Owner' | - List of owners displayed<br>- Table contains columns: Name, Address, City, Telephone, Pets |
| Functional | TC002-03 | Verify empty search returns all owners | @positive, Functional | Medium | New | N/A | Not in legacy | 1. Navigate to 'Find owners'<br>2. Leave Last Name empty<br>3. Click 'Find Owner' | - Full list of owners displayed<br>- Pagination may apply if implemented |
| Functional | TC002-04 | Verify search for non-existent owner | @negative, Functional | Medium | New | N/A | Not in legacy | 1. Navigate to 'Find owners'<br>2. Enter Last Name: 'NonExistentXYZ'<br>3. Click 'Find Owner' | - 'has not been found' error message displayed<br>- Stays on Find Owner page |

---

## Test Data Requirements

### Test Data
| Data Type | Sample Values | Usage |
|-----------|---------------|-------|
| Existing Last Name | User | Positive Search |
| Non-existent Name | NonExistentXYZ | Negative Search |
