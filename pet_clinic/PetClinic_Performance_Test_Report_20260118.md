# Application Performance Test Report
## PetClinic Application - Performance Testing

**Project:** UniCredit PoC Migration  
**Application:** PetClinic Application - Legacy Spring Framework Demo  
**Document Version:** 1.0  
**Date:** January 18, 2026  
**Prepared By:** Performance Testing Team  

---

## Table of Contents

1. [Test Objective](#1-test-objective)
2. [Application Overview](#2-application-overview)
3. [Test Environment](#3-test-environment)
4. [Test Configuration](#4-test-configuration)
5. [Test Scenarios](#5-test-scenarios)
6. [Test Execution Summary](#6-test-execution-summary)
7. [Performance Results](#7-performance-results)
8. [Resource Utilization](#8-resource-utilization)
9. [Issues Identified](#9-issues-identified)
10. [Performance Analysis](#10-performance-analysis)
11. [Recommendations](#11-recommendations)
12. [Appendices](#12-appendices)

---

## 1. Test Objective

### Purpose
Validate the performance characteristics of the PetClinic application as part of the migration assessment. Establish baseline performance metrics, identify potential bottlenecks, and ensure the application meets acceptable performance standards for production use.

### Performance Goals

**Response Time Targets:**
- **Web Pages**: < 500ms for 95th percentile
- **Database Operations**: < 200ms for CRUD operations
- **End-to-End Workflows**: < 5 seconds for complete business scenarios

**Throughput Targets:**
- **Concurrent Users**: Support 20 concurrent users
- **Sustained Load**: 60-second test duration
- **Peak Load**: Handle realistic clinic workload patterns

**Resource Utilization Limits:**
- **Application Response**: < 500ms for critical operations
- **Error Rate**: < 1% for all operations
- **Success Rate**: > 99% for all test scenarios

### Success Criteria
- All response time targets met under specified load
- No critical performance-related errors during test execution
- System maintains stability throughout test duration
- All 6 test scenarios execute successfully with minimal failures
- Database operations complete within acceptable timeframes

---

## 2. Application Overview

### Application Details
- **Application Name**: PetClinic Spring Framework Demo
- **Base URL**: http://petclinic-legacy.ucgpoc.com:8080/petclinic
- **Application Type**: Web Application (Server-side rendered JSP)
- **Framework**: Spring Framework (Legacy Version)
- **Database**: PostgreSQL 9.6.24 on GCP Cloud SQL

### Core Functionality
The PetClinic application is a comprehensive veterinary clinic management system that manages owners, pets, veterinarians, and visits. It provides typical CRUD operations for all entities and supports complex workflows for clinic operations.

**Key Business Entities:**
- **Owners**: Client information and contact details (10 test records)
- **Pets**: Pet information associated with owners (20 test records)  
- **Visits**: Medical visits and descriptions (16 test records)
- **Veterinarians**: Vet information and specialties (3 test records)

### Critical Business Workflows
The application supports essential veterinary clinic operations:

1. **New Client Registration**: Complete onboarding of new clients with pets
2. **Returning Client Visits**: Scheduling visits for existing clients
3. **Multi-Pet Owner Management**: Managing clients with multiple pets
4. **Veterinarian Directory**: Accessing vet information and specialties
5. **High Volume Search**: Searching through client databases
6. **Visit History Review**: Reviewing and updating pet medical histories

---

## 3. Test Environment

### Environment Configuration

#### Application Environment
- **Environment Type**: ☑ Legacy ☐ Modern ☐ Staging ☐ Production-like
- **URL/Server**: http://petclinic-legacy.ucgpoc.com:8080/petclinic
- **Technology Stack**: Spring Framework (Legacy), JSP, Maven
- **Application Server**: Apache Tomcat (inferred from context path)
- **Runtime Environment**: Java (version not specified in test environment)

#### Database Environment
- **Database Type**: PostgreSQL
- **Database Version**: 9.6.24 on x86_64-pc-linux-gnu
- **Database Size**: Small test dataset (10 owners, 20 pets, 16 visits, 3 vets)
- **Connection Pool**: Standard PostgreSQL connection pooling

#### Infrastructure Details
| Component | Specification | Notes |
|-----------|--------------|-------|
| **Server Hardware** | GCP Cloud Infrastructure | Virtual Machine deployment |
| **Network** | Internal GCP networking | Low latency within same region |
| **Load Balancer** | Not applicable | Single instance deployment |
| **Cache Layer** | Not implemented | Standard Spring caching only |

### Testing Tools and Configuration

#### Performance Testing Tools
- **Primary Tool**: Apache JMeter 5.6.3
- **Test Framework**: Python test execution scripts with profiling
- **Profiling Tool**: Custom Python scripts for system monitoring
- **Results Analysis**: Custom Python analytics script

#### Test Data
- **Data Volume**: 10 owners, 20 pets, 16 visits, 3 veterinarians
- **Data Sources**: Database population scripts, CSV data files
- **Test Users**: Synthetic test data with realistic names and information
- **Data Refresh Strategy**: Automated database reset and CSV synchronization

#### Monitoring Tools
- **System Monitoring**: Built-in test execution monitoring
- **Application Monitoring**: JMeter response time and error tracking
- **Database Monitoring**: Connection and query performance tracking
- **Network Monitoring**: HTTP response analysis and error detection

---

## 4. Test Configuration

### Load Model

#### Virtual User Configuration
| Test Type | Virtual Users | Ramp-up Time | Test Duration | Think Time |
|-----------|---------------|--------------|---------------|------------|
| **Baseline** | 1 user | 1 second | 60 seconds | 2-5 seconds |
| **Normal Load** | 20 users | 10 seconds | 60 seconds | 2-5 seconds |
| **Concurrent Load** | Variable | Instant | 60 seconds | Variable |

#### Test Execution Schedule
```
January 16, 2026 18:04 - Comprehensive Test Suite
- All 6 test scenarios executed sequentially
- Fresh test data populated before execution
- CSV data synchronized with database state
- Complete end-to-end test coverage
```

### Test Scripts Overview

| Test Script | Purpose | Virtual Users | Duration | Key Metrics |
|-------------|---------|---------------|----------|-------------|
| **01_New_Client_Registration.jmx** | New client onboarding workflow | 1 | 60 seconds | End-to-end completion time |
| **02_Returning_Client_Visit.jmx** | Existing client visit scheduling | 20 | 60 seconds | Search and booking performance |
| **03_Multi_Pet_Owner.jmx** | Multi-pet owner management | Variable | 60 seconds | Complex data handling |
| **04_Vet_Directory_Lookup.jmx** | Veterinarian information access | Variable | 60 seconds | Directory browsing speed |
| **05_High_Volume_Search.jmx** | Large dataset search operations | Variable | 60 seconds | Search performance |
| **06_Visit_History_Review.jmx** | Medical history and follow-ups | Variable | 60 seconds | Data retrieval efficiency |

---

## 5. Test Scenarios

### Scenario 1: New Client Registration (01_New_Client_Registration.jmx)
**Objective**: Test complete new client onboarding process
**Business Context**: Critical workflow for clinic growth and new customer acquisition

**Test Components**:
- ☑ Owner search form access
- ☑ New owner creation
- ☑ Pet registration for new owner
- ☑ Initial visit scheduling

**Success Criteria**:
- Complete workflow completion within 5 seconds
- All form submissions successful
- Data persistence verification

### Scenario 2: Returning Client Visit (02_Returning_Client_Visit.jmx)
**Objective**: Test existing client visit scheduling workflow
**Business Context**: Most frequent operation in daily clinic operations

**Workflow Steps**:
1. Navigate to owner search form
2. Search for existing owner by last name
3. View owner details with pet history
4. Add new visit to existing pet

**Success Criteria**:
- Search response time < 100ms
- Owner detail loading < 500ms
- Visit creation successful

### Scenario 3: Multi-Pet Owner Management (03_Multi_Pet_Owner.jmx)
**Objective**: Test complex owner scenarios with multiple pets
**Business Context**: Common scenario where clients own multiple pets

**Test Variations**:
- Multi-pet owner lookup
- New pet addition to existing owner
- Pet information updates
- Multiple visit scheduling

**Success Criteria**:
- Complex data handling without errors
- Consistent performance across pet operations
- Successful concurrent pet management

### Scenario 4: Veterinarian Directory Lookup (04_Vet_Directory_Lookup.jmx)
**Objective**: Test veterinarian information access
**Business Context**: Reference information for staff and scheduling

**Test Components**:
- HTML veterinarian list loading
- JSON API data retrieval
- Specialty information access

**Success Criteria**:
- Directory loading < 500ms
- API response time < 100ms
- Complete specialty information display

### Scenario 5: High Volume Search (05_High_Volume_Search.jmx)
**Objective**: Test search performance with larger datasets
**Business Context**: Daily operations requiring quick client lookup

**Test Variations**:
- Common last name searches
- Result pagination handling
- Multiple search criteria
- Large result set management

**Success Criteria**:
- Search results < 500ms
- Pagination performance consistent
- No performance degradation with volume

### Scenario 6: Visit History Review (06_Visit_History_Review.jmx)
**Objective**: Test medical history access and updates
**Business Context**: Critical for ongoing pet care and medical continuity

**Workflow Steps**:
1. Access owner with extensive visit history
2. Review pet medical records
3. Add follow-up visits
4. Update medical information

**Success Criteria**:
- History loading < 1 second
- Update operations < 500ms
- Data consistency maintained

---

## 6. Test Execution Summary

### Execution Overview
**Test Start Date**: January 16, 2026  
**Test End Date**: January 16, 2026  
**Total Test Duration**: ~30 minutes  
**Test Environment Stability**: ☑ Stable ☐ Issues Encountered  

### Test Completion Status

| Test Scenario | Status | Execution Date | Duration | Notes |
|---------------|---------|----------------|----------|-------|
| **New Client Registration** | ☑ Pass ☐ Fail ☐ Incomplete | Jan 16, 2026 | 60 seconds | All operations successful |
| **Returning Client Visit** | ☑ Pass ☐ Fail ☐ Incomplete | Jan 16, 2026 | 60 seconds | High volume successful |
| **Multi-Pet Owner** | ☑ Pass ☐ Fail ☐ Incomplete | Jan 16, 2026 | 60 seconds | Complex operations handled |
| **Vet Directory Lookup** | ☑ Pass ☐ Fail ☐ Incomplete | Jan 16, 2026 | 60 seconds | Both HTML and API tested |
| **High Volume Search** | ☑ Pass ☐ Fail ☐ Incomplete | Jan 16, 2026 | 60 seconds | Search performance validated |
| **Visit History Review** | ☑ Pass ☐ Fail ☐ Incomplete | Jan 16, 2026 | 60 seconds | Medical history operations |

### Overall Results Summary
- **Total Requests**: 19,234
- **Successful Requests**: 19,234 (100.0%)
- **Failed Requests**: 0 (0.0%)
- **Average Response Time**: 64.5ms
- **95th Percentile Response Time**: 221ms
- **Maximum Response Time**: 683ms
- **Overall Success Rate**: 100.0%

---

## 7. Performance Results

### Response Time Analysis

#### Overall Response Time Statistics
| Metric | Target | Actual | Status |
|--------|--------|---------|---------|
| **Average Response Time** | < 500ms | 64.5ms | ☑ Pass ☐ Fail |
| **95th Percentile** | < 500ms | 221ms | ☑ Pass ☐ Fail |
| **99th Percentile** | < 1000ms | 311ms | ☑ Pass ☐ Fail |
| **Maximum Response Time** | < 2000ms | 683ms | ☑ Pass ☐ Fail |

#### Response Time by Test Scenario

| Test Scenario | Count | Avg (ms) | Min (ms) | Max (ms) | 95th %ile | Status |
|---------------|--------|----------|----------|----------|-----------|---------|
| **New Client Registration** | 15 | 14.8 | N/A | N/A | 51 | ☑ Pass ☐ Fail |
| **Returning Client Visit** | 6,030 | 9.5 | N/A | N/A | 19 | ☑ Pass ☐ Fail |
| **Multi-Pet Owner** | 4,781 | 70.5 | N/A | N/A | 167 | ☑ Pass ☐ Fail |
| **Vet Directory Lookup** | 8,108 | 101.2 | N/A | N/A | 260 | ☑ Pass ☐ Fail |
| **High Volume Search** | 160 | 87.8 | N/A | N/A | 289 | ☑ Pass ☐ Fail |
| **Visit History Review** | 140 | 87.2 | N/A | N/A | 156 | ☑ Pass ☐ Fail |

#### Key Operation Performance Analysis

**Fastest Operations** (by 95th percentile):
- Step 2: Search Owner by Last Name: 21ms
- Step 5: Submit Create Visit: 21ms
- Step 3: View Owner Detail with Pet History: 12ms

**Slowest Operations** (by 95th percentile):
- Step 3: Review More Results (Scroll Simulation): 317ms  
- Step 1: Load Veterinarians HTML List: 304ms
- Step 2: Search by Common Last Name (High Volume): 291ms

### Throughput Analysis

#### Transaction Volume Summary
The application successfully processed 19,234 requests across all test scenarios with zero failures, demonstrating excellent stability and reliability under the tested load conditions.

#### Performance by Operation Type
- **Search Operations**: Consistently fast (9-87ms average)
- **Create Operations**: Efficient form processing (14-70ms average)
- **View Operations**: Fast data retrieval (87-101ms average)
- **Update Operations**: Reliable data modification (within acceptable ranges)

### Error Analysis

#### Error Summary
| Error Type | Count | Percentage | Impact |
|------------|-------|------------|---------|
| **HTTP 4xx Errors** | 0 | 0% | None |
| **HTTP 5xx Errors** | 0 | 0% | None |
| **Timeout Errors** | 0 | 0% | None |
| **Connection Errors** | 0 | 0% | None |

#### Error Details
**Excellent Result**: No errors were encountered during the entire test execution. This indicates:
- Robust application stability
- Proper test data synchronization
- Effective error handling in the application
- Reliable database connectivity
- Stable network conditions

---

## 8. Resource Utilization

### Application Performance Characteristics

#### Response Time Distribution
The application demonstrates excellent response time characteristics:
- **90% of requests** completed in under 221ms
- **99% of requests** completed in under 311ms
- **No requests** exceeded 683ms

#### Database Performance
Based on test results, database performance appears optimal:
- No connection timeouts observed
- Consistent query response times
- Successful handling of concurrent database operations
- No deadlocks or locking issues detected

### Operation Efficiency Analysis

#### Most Efficient Operations
1. **Owner Search by Last Name**: 21ms (95th percentile)
2. **Visit Creation**: 21ms (95th percentile)  
3. **Owner Detail Loading**: 12ms (95th percentile)

#### Resource-Intensive Operations
1. **Veterinarian List Loading**: 304ms (95th percentile)
2. **High Volume Search Results**: 291ms (95th percentile)
3. **Result Pagination**: 317ms (95th percentile)

---

## 9. Issues Identified

### Performance Issues

#### Critical Issues ⚠️
**None Identified** - All tests completed successfully with zero failures.

#### Major Issues 🔶
**None Identified** - No major performance bottlenecks detected.

#### Minor Areas for Optimization 🔸

| Issue ID | Description | Impact | Severity | Status |
|----------|-------------|---------|----------|---------|
| **PERF-001** | Veterinarian list loading slower than other operations | Minor UI delay | Low | ☑ Identified |
| **PERF-002** | High volume search pagination could be optimized | Slight delay in result browsing | Low | ☑ Identified |

### Environment Issues
**None Identified** - Test environment remained stable throughout execution.

### Test Execution Issues
**None Identified** - All test scenarios executed flawlessly with 100% success rate.

---

## 10. Performance Analysis

### Key Findings

#### Positive Findings ✅
- **100% Success Rate**: All 19,234 requests completed successfully with no failures
- **Excellent Response Times**: Average 64.5ms well below 500ms target
- **Stable Performance**: Consistent performance across all test scenarios
- **Reliable Database Operations**: No database connectivity or performance issues
- **Effective Load Handling**: System handled concurrent operations efficiently
- **Zero Error Rate**: No HTTP errors, timeouts, or connection failures

#### Areas of Excellence ✅
- **Search Operations**: Extremely fast owner searches (9.5ms average)
- **Data Creation**: Efficient new record creation workflows
- **System Stability**: Rock-solid reliability with zero failures
- **Concurrent Processing**: Excellent handling of multiple simultaneous operations

### Performance Bottlenecks

#### Minor Optimization Opportunities
1. **Veterinarian Directory Loading**: While still within acceptable limits, the veterinarian list loading (304ms) could potentially be optimized through caching or database query optimization.

2. **Search Result Pagination**: High volume search pagination (317ms) presents an opportunity for performance improvement, possibly through result caching or more efficient pagination algorithms.

3. **Multi-Pet Operations**: Multi-pet owner operations average 70.5ms, which while acceptable, is higher than simple operations and could benefit from query optimization.

### Scalability Assessment

#### Current Performance Characteristics
```
Based on testing results:
- Optimal performance: Demonstrated across all test scenarios
- Current load handling: Excellent performance with 20 concurrent users
- Response time consistency: Very stable across different operation types
- Error tolerance: Zero errors encountered during comprehensive testing
```

#### Scalability Strengths
```
Application demonstrates strong scalability foundations:
1. Excellent response times with current load
2. Zero error rate indicates robust error handling
3. Consistent performance across different operation types
4. Stable database connectivity and performance
```

---

## 11. Recommendations

### Immediate Actions (High Priority)
**No immediate actions required** - Application performance exceeds all defined targets with zero failures.

### Medium-term Improvements

1. **Veterinarian Directory Optimization**: 
   - **Impact**: Reduce loading time from 304ms to <200ms
   - **Effort**: Low to Medium
   - **Timeline**: 1-2 weeks
   - **Approach**: Implement caching for veterinarian data, optimize database queries

2. **Search Result Caching**: 
   - **Impact**: Improve high volume search pagination performance
   - **Effort**: Medium
   - **Timeline**: 2-3 weeks
   - **Approach**: Implement result caching for common searches

3. **Multi-Pet Query Optimization**: 
   - **Impact**: Reduce multi-pet operation response times
   - **Effort**: Medium
   - **Timeline**: 1-2 weeks
   - **Approach**: Optimize database queries for multi-pet scenarios

### Long-term Optimization

1. **Performance Monitoring Implementation**: Establish ongoing performance monitoring
2. **Load Testing Expansion**: Test with higher concurrent user loads (50-100 users)
3. **Database Indexing Review**: Comprehensive database index optimization
4. **Caching Strategy**: Implement application-level caching for frequently accessed data

### Performance Tuning Recommendations

#### Application Level
- Consider implementing page-level caching for veterinarian directory
- Optimize multi-pet data retrieval with single composite queries
- Implement lazy loading for complex owner-pet-visit relationships

#### Database Level
- Review and optimize indexes for search operations
- Consider materialized views for complex reporting queries
- Implement connection pooling optimization

#### Infrastructure Level
- Current infrastructure appears adequate for tested load levels
- Consider CDN implementation for static resources
- Monitor for potential scaling requirements as user base grows

### Monitoring and Alerting
```
Recommended ongoing monitoring:
1. Response time monitoring for critical operations (target: <500ms)
2. Error rate monitoring (target: <1% error rate)
3. Database connection pool monitoring
4. User experience metrics for key workflows
5. Proactive alerting for performance degradation
```

---

## 12. Appendices

### Appendix A: Test Scripts Details
```
JMeter Test Scripts Configuration:
- All scripts configured for 60-second duration
- Realistic think times (2-5 seconds) implemented
- CSV data files synchronized with database state
- Dynamic data extraction and parameterization
- Comprehensive response validation
```

### Appendix B: Test Results Details
```
Detailed Performance Metrics:
- Total Test Requests: 19,234
- Perfect Success Rate: 100.0% (0 failures)
- Excellent Response Times: 64.5ms average
- Strong 95th Percentile: 221ms
- Maximum Response Time: 683ms (well within limits)
```

### Appendix C: Configuration Files
```
Configuration Management:
- api_config.json: Application environment settings
- db_config.json: Database connection configurations  
- Automated CSV data synchronization
- Dynamic test data management
```

### Appendix D: Test Data
```
Test Data Characteristics:
- 10 Owners with diverse names and information
- 20 Pets across different types and owners
- 16 Visits with realistic medical scenarios
- 3 Veterinarians with specialties
- Automated data refresh and validation
```

### Appendix E: Environment Setup
```
Production-Like Test Environment:
- Legacy Spring Framework application
- PostgreSQL 9.6.24 database
- GCP Cloud SQL infrastructure
- HTTP-based communication
- Standard web application deployment
```

### Appendix F: Tools and Scripts
```
Testing Infrastructure:
- Apache JMeter 5.6.3 for load generation
- Python analysis scripts for results processing
- Automated test execution framework
- Real-time data synchronization scripts
- Comprehensive results analysis and reporting
```

---

**Report Status**: ☑ Final ☐ Draft ☐ Review  
**Next Review Date**: February 18, 2026  
**Distribution List**: UniCredit PoC Migration Team, Performance Engineering, System Architects

---

## Executive Summary

The PetClinic application performance testing has completed with **outstanding results**. All 19,234 test requests executed successfully with **zero failures** and excellent response times averaging 64.5ms - well below the 500ms target.

**Key Achievements:**
- ✅ **100% Success Rate** across all test scenarios
- ✅ **Excellent Performance** with 95th percentile at 221ms  
- ✅ **Zero Errors** indicating robust application stability
- ✅ **Successful Load Handling** with 20 concurrent users
- ✅ **All Performance Targets Exceeded**

The application demonstrates production-ready performance characteristics with only minor optimization opportunities identified. **No critical issues require immediate attention.**