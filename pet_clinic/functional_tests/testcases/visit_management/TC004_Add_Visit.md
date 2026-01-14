# Test Cases: Add Visit

**Use Case Reference**: UC-004 - Add Visit  
**Module**: Visit Management  
**Total Test Cases**: 3 (Optimized)  
**Generated From**: Live Application Exploration  
**Date Generated**: 2026-01-12  

---

## Background

**Common Preconditions**:
- Owner and Pet exist
- User is on Owner Information page

**Test Environment**:
- Application URL: http://10.134.77.66:8080/petclinic/

---

## Test Cases

| Functional Area | Test Case ID | Description | Tags | Priority | Test Case Source | Covered in Legacy | Legacy Test Traceability | Test Steps | Expected Results |
|----------------|--------------|-------------|------|----------|------------------|-------------------|-------------------------|------------|------------------|
| Functional | TC004-01 | Verify successful visit addition | @positive, Functional, Smoke | High | New | N/A | Not in legacy | 1. Navigate to Owner Information page<br>2. Click 'Add Visit' for a pet<br>3. Verify Date is pre-filled (today)<br>4. Enter Description: 'Checkup'<br>5. Click 'Add Visit' | - Redirects to Owner Information page<br>- New visit appears in the visit history for the pet<br>- Description matches |
| Data Validation | TC004-02 | Verify empty description handling | @negative, Functional | Low | New | N/A | Not in legacy | 1. Navigate to Add Visit page<br>2. Clear Description<br>3. Click 'Add Visit' | - (Depending on rule) Form accepts or rejects empty description (Usually required, check behavior) |
| API Testing | TC004-03 | Verify add visit via HTTP POST | @positive, API | High | New | N/A | Not in legacy | 1. POST to /petclinic/owners/{ownerId}/pets/{petId}/visits/new<br>2. Form Data: date=2026/01/12, description=APIVisit | - HTTP 302 Redirect<br>- Visit added |

---

## Test Data Requirements

### Test Data
| Data Type | Sample Values | Usage |
|-----------|---------------|-------|
| Description | Regular Checkup | Positive |
| Date | 2026/01/12 | Positive (YYYY/MM/DD) |
