# PetClinic Performance Testing

This directory contains JMeter performance test scripts and Python utilities for testing the Spring PetClinic application workflows and endpoints.

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [Test Scripts](#test-scripts)
- [Quick Testing Scripts](#quick-testing-scripts)
- [JMeter Performance Tests](#jmeter-performance-tests)
- [Usage Examples](#usage-examples)

---

## Overview

The performance testing suite includes:
- **6 JMeter test files** - Critical business scenarios and workflows
- **Quick test scripts** - Python scripts for endpoint validation
- **Workflow test scripts** - Complete business process testing
- **Profiling script** - System resource monitoring during JMeter tests
- **Data extraction tools** - Utilities for generating realistic test data

All scripts support **environment-based configuration** using `api_config.json` and `db_config.json`, allowing you to easily switch between source, target, and local environments.

---

## Prerequisites

### Required Software
- **Python 3.8+** with packages:
  ```bash
  pip install requests urllib3 pandas matplotlib psutil psycopg2-binary
  ```
- **Apache JMeter** (for performance tests)
  - Download from: https://jmeter.apache.org/download_jmeter.cgi
  - Add to PATH or use full path to `jmeter` command

### Configuration Files
Ensure configuration files exist in the parent directory:

#### `api_config.json`
```json
{
  "environments": {
    "source": {
      "description": "Source API Environment",
      "base_url": "http://10.130.73.5:8080",
      "verify_ssl": false,
      "timeout": 10,
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    },
    "target": {
      "description": "Target API Environment (Post-Migration)",
      "base_url": "http://10.130.73.5:8080",
      "verify_ssl": false,
      "timeout": 10
    },
    "local": {
      "description": "Local Development Environment",
      "base_url": "http://localhost:8080",
      "verify_ssl": false,
      "timeout": 10
    }
  }
}
```

#### `db_config.json`
```json
{
  "environments": {
    "source": {
      "host": "10.130.73.5",
      "port": 5432,
      "database": "petclinic",
      "username": "petclinic",
      "password": "petclinic"
    },
    "target": {
      "host": "10.130.73.5",
      "port": 5432,
      "database": "petclinic",
      "username": "petclinic",
      "password": "petclinic"
    },
    "local": {
      "host": "localhost",
      "port": 5432,
      "database": "petclinic",
      "username": "petclinic",
      "password": "petclinic"
    }
  }
}
```

---

## Test Scripts

### Quick Testing Scripts

#### 1. **test_endpoints.py** - API Endpoint Validation
Quick validation of PetClinic API endpoints.

```bash
# Test default environment
python test_endpoints.py

# Test specific environment
python test_endpoints.py --env source
python test_endpoints.py --env target
python test_endpoints.py --env local
```

**Features:**
- Tests key API endpoints (owners, pets, visits, vets)
- Response time and status validation
- Success/failure summary
- Fast execution

**Endpoints Tested:**
- GET /api/owners - List owners
- GET /api/pets - List pets
- GET /api/visits - List visits
- GET /api/vets - List veterinarians

---

#### 2. **test_visit_flow.py** - Visit Workflow Test
Tests the complete visit scheduling workflow.

```bash
# Test visit workflow
python test_visit_flow.py

# Test with specific environment
python test_visit_flow.py --env target
```

**Features:**
- End-to-end visit creation workflow
- Creates owner, pet, and visit in sequence
- Validates each step
- Realistic business scenario testing

**Workflow Steps:**
1. Create new owner
2. Add pet to owner
3. Schedule visit for pet
4. Validate visit was created

---

#### 3. **test_extraction_flow.py** - Data Extraction Test
Tests data extraction and retrieval workflows.

```bash
# Test data extraction
python test_extraction_flow.py

# Test with specific environment
python test_extraction_flow.py --env target
```

**Features:**
- Tests data retrieval operations
- Validates JSON/XML export capabilities
- Performance measurement

---

#### 4. **run_with_profiling.py** - Performance Test with System Monitoring
Runs JMeter tests with system resource monitoring (CPU, Memory, Disk, Network).

```bash
# Test with default environment
python run_with_profiling.py 01_New_Client_Registration.jmx

# Test with specific environment
python run_with_profiling.py 02_Returning_Client_Visit.jmx --env source
python run_with_profiling.py 03_Multi_Pet_Owner.jmx --env target
```

**Features:**
- Runs JMeter performance tests
- Monitors system resources in real-time
- Generates performance graphs (requires pandas/matplotlib)
- Creates HTML reports
- Saves clean CSV data

**Outputs:**
- `results/{test_name}_results.jtl` - JMeter results
- `results/{test_name}_report/` - HTML report directory
- `results/profiling/performance_*.csv` - Resource monitoring data
- `results/profiling/graphs/performance_report.png` - Performance graphs
- `results/profiling/graphs/performance_summary.txt` - Summary statistics

---

### Data Extraction and Generation Tools

#### 1. **get_real_lastnames.py** - Extract Real Last Names
Extracts real last names from the database for test data generation.

```bash
python get_real_lastnames.py --env source --output common_last_names.csv
```

#### 2. **get_owners_with_pets.py** - Get Owners with Pets
Retrieves owner IDs that have associated pets.

```bash
python get_owners_with_pets.py --env source --output owner_ids.csv
```

#### 3. **get_multi_pet_owners.py** - Find Multi-Pet Owners
Identifies owners with multiple pets for realistic testing.

```bash
python get_multi_pet_owners.py --env source
```

#### 4. **generate_multi_pet_owner_ids.py** - Generate Test IDs
Generates CSV file with multi-pet owner IDs for JMeter tests.

```bash
python generate_multi_pet_owner_ids.py --env source --output multi_pet_owner_ids.csv
```

---

## JMeter Performance Tests

### Business Scenario Tests

#### **01_New_Client_Registration.jmx**
Tests the complete new client registration workflow.
- Create new owner
- Add owner details
- Validate registration

#### **02_Returning_Client_Visit.jmx**
Tests returning client visit scheduling.
- Search for existing owner
- Schedule new visit
- Validate visit creation

#### **03_Multi_Pet_Owner.jmx**
Tests multi-pet owner management scenarios.
- Manage owners with multiple pets
- Add visits for multiple pets
- Validate complex relationships

#### **04_Vet_Directory_Lookup.jmx**
Tests veterinarian directory access and search.
- View vet listings
- Search veterinarians
- Export vet data (JSON/XML)

#### **05_High_Volume_Search.jmx**
Tests high-volume owner search operations.
- Multiple concurrent searches
- Various search patterns
- Performance under load

#### **06_Visit_History_Review.jmx**
Tests visit history retrieval and review.
- Access visit history
- Filter by date/pet
- Performance validation

### CSV Data Files
- `common_last_names.csv` - Real last names for owner creation
- `new_owners.csv` - Test data for new owner registration
- `pet_names.csv` - Pet names for test data
- `visit_descriptions.csv` - Visit descriptions
- `multi_pet_owner_ids.csv` - Owners with multiple pets

---

## Usage Examples

### Quick Validation Workflow
```bash
# 1. Test API endpoints
python test_endpoints.py --env target

# 2. Test visit workflow
python test_visit_flow.py --env target

# 3. Test data extraction
python test_extraction_flow.py --env target
```

### Performance Testing Workflow
```bash
# 1. Generate test data
python get_real_lastnames.py --env source --output common_last_names.csv
python get_multi_pet_owners.py --env source

# 2. Run performance test with profiling
python run_with_profiling.py 01_New_Client_Registration.jmx --env target

# 3. View HTML report
start results/01_New_Client_Registration_report/index.html

# 4. Check performance graphs
start results/profiling/graphs/performance_report.png
```

### Manual JMeter Execution
If you need to run JMeter tests manually without profiling:

```bash
# Generate HTML report
jmeter -n -t 01_New_Client_Registration.jmx -l results/01_results.jtl -j results/01_jmeter.log -e -o results/01_report

# Run without HTML report
jmeter -n -t 01_New_Client_Registration.jmx -l results/01_results.jtl -j results/01_jmeter.log
```

### Critical Business Scenarios Testing
```bash
# Test all 6 critical scenarios
python run_with_profiling.py 01_New_Client_Registration.jmx --env target
python run_with_profiling.py 02_Returning_Client_Visit.jmx --env target
python run_with_profiling.py 03_Multi_Pet_Owner.jmx --env target
python run_with_profiling.py 04_Vet_Directory_Lookup.jmx --env target
python run_with_profiling.py 05_High_Volume_Search.jmx --env target
python run_with_profiling.py 06_Visit_History_Review.jmx --env target
```

---

## Environment Comparison

Test both source and target environments to compare performance:

```bash
# Test source environment
python test_endpoints.py --env source > results/source_test.log

# Test target environment
python test_endpoints.py --env target > results/target_test.log

# Compare results
diff results/source_test.log results/target_test.log
```

---

## Troubleshooting

### Connection Errors
1. Verify the PetClinic application is running
2. Check `api_config.json` base_url
3. Ensure correct port (default: 8080)
4. Check firewall settings

### Database Connection Errors
1. Verify `db_config.json` configuration
2. Check PostgreSQL is running
3. Test connection: `python ../test_postgres_connection.py`
4. Confirm network connectivity and credentials

### JMeter Not Found
Add JMeter to PATH or use full path:
```bash
C:\apache-jmeter-5.6.3\bin\jmeter -n -t 01_New_Client_Registration.jmx ...
```

### Missing Python Packages
Install required packages:
```bash
pip install requests urllib3 pandas matplotlib psutil psycopg2-binary
```

### Missing Test Data Files
Generate test data using extraction tools:
```bash
python get_real_lastnames.py --env source --output common_last_names.csv
python get_multi_pet_owners.py --env source
```

---

## Test Results Location

After running tests, results are saved in:
```
results/
├── {test_name}_results.jtl          # JMeter raw results
├── {test_name}_jmeter.log           # JMeter log file
├── {test_name}_report/              # HTML report directory
│   └── index.html                    # Main report page
└── profiling/
    ├── performance_*.csv             # Performance data
    └── graphs/
        ├── performance_report.png    # Performance graphs
        └── performance_summary.txt   # Summary statistics
```

---

## See Also
- [Test Cases Documentation](test_cases.md)
- [Critical Business Scenarios](CRITICAL_BUSINESS_SCENARIOS.md)
- [Performance Test Analysis](PERFORMACE_TEST_ANALYSIS.md)
- [Root README](../README.md)

---

## Performance Metrics

Key metrics collected during performance tests:
- **Response Time**: Request/response latency
- **Throughput**: Requests per second
- **Error Rate**: Failed requests percentage
- **CPU Usage**: System CPU utilization
- **Memory Usage**: System memory consumption
- **Network I/O**: Network throughput
- **Disk I/O**: Disk read/write operations

All metrics are captured in real-time and visualized in generated reports.
