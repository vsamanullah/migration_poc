# Test Cases: View Veterinarians

**Use Case Reference**: UC-005 - View Veterinarians  
**Module**: Veterinarian Management  
**Total Test Cases**: 3 (Optimized)  
**Generated From**: Live Application Exploration  
**Date Generated**: 2026-01-12  

---

## Background

**Common Preconditions**:
- Application is accessible

**Test Environment**:
- Application URL: http://10.134.77.66:8080/petclinic/

---

## Test Cases

| Functional Area | Test Case ID | Description | Tags | Priority | Test Case Source | Covered in Legacy | Legacy Test Traceability | Test Steps | Expected Results |
|----------------|--------------|-------------|------|----------|------------------|-------------------|-------------------------|------------|------------------|
| Navigation | TC005-01 | Verify veterinarians list display | @positive, UI, Smoke | High | New | N/A | Not in legacy | 1. Navigate to Home Page<br>2. Click 'Veterinarians' link | - List of veterinarians is displayed<br>- Table columns: Name, Specialties<br>- 'View as XML' and 'View as JSon' links present |
| API Testing | TC005-02 | Verify Veterinarians JSON Endpoint | @positive, API | High | New | N/A | Not in legacy | 1. Send GET request to /petclinic/vets.json | - HTTP 200 OK<br>- Response Content-Type is application/json<br>- Returns list of vets structure |
| API Testing | TC005-03 | Verify Veterinarians XML Endpoint | @positive, API | High | New | N/A | Not in legacy | 1. Send GET request to /petclinic/vets.xml | - HTTP 200 OK<br>- Response Content-Type is application/xml<br>- Returns list of vets structure |

---

## Test Data Requirements

### Test Data
| Data Type | Sample Values | Usage |
|-----------|---------------|-------|
| Endpoint | /petclinic/vets.json | API Verification |
| Endpoint | /petclinic/vets.xml | API Verification |
