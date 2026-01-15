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
- **Apache JMeter 5.6.2+** (for performance tests)
  - Download from: https://jmeter.apache.org/download_jmeter.cgi
  - Add to PATH or use full path to `jmeter` command

- **ODBC Driver 18 for SQL Server** (for SQL Server connectivity if needed)
  - Download: https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server
  - Required for: Python scripts to connect to SQL Server databases
  - Verify installation:
    ```powershell
    Get-OdbcDriver | Where-Object {$_.Name -like "*SQL Server*"}
    ```

- **PostgreSQL Client** (for PostgreSQL connectivity)
  - Included in PostgreSQL installation or available separately
  - Download: https://www.postgresql.org/download/
  - Required for: Database connectivity and test data management

### JMeter Setup - Required Drivers and JAR Files

#### JDBC Drivers (for Database Connection)
Place the following JDBC drivers in `%JMETER_HOME%/lib/` directory:

1. **PostgreSQL JDBC Driver**:
   - File: `postgresql-42.7.1.jar` or later
   - Download: https://jdbc.postgresql.org/download/
   - Required for: PostgreSQL database connectivity in JMeter

2. **SQL Server JDBC Driver** (if using SQL Server):
   - File: `mssql-jdbc-12.4.2.jre11.jar` or later
   - Download: https://learn.microsoft.com/en-us/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server
   - Required for: SQL Server database connectivity

#### JMeter Plugins (Optional but Recommended)
Place in `%JMETER_HOME%/lib/ext/` directory:

1. **JMeter Plugins Manager**:
   - File: `jmeter-plugins-manager-1.10.jar`
   - Download: https://jmeter-plugins.org/install/Install/
   - Enables easy plugin management via GUI

2. **Custom Thread Groups Plugin**:
   - Provides advanced thread group options
   - Install via Plugins Manager or download from: https://jmeter-plugins.org/

3. **Throughput Shaping Timer Plugin**:
   - For advanced load shaping
   - Install via Plugins Manager

#### JSON Processing (Built-in JMeter 5.0+)
- **JSON Extractor**: Built-in since JMeter 5.0
- **JSON Path Plugin**: Pre-installed in JMeter 5.6.2+
- No additional JARs needed for JSON processing

#### Installation Steps

**Windows:**
```powershell
# 1. Download PostgreSQL JDBC driver
# Visit the download link and save the JAR file

# 2. Copy to JMeter lib directory
Copy-Item "C:\Downloads\postgresql-42.7.1.jar" "$env:JMETER_HOME\lib\"

# 3. Restart JMeter (if running)
```

**Linux/Mac:**
```bash
# 1. Download PostgreSQL JDBC driver
wget https://jdbc.postgresql.org/download/postgresql-42.7.1.jar

# 2. Copy to JMeter lib directory
cp postgresql-42.7.1.jar $JMETER_HOME/lib/

# 3. Verify installation
ls -l $JMETER_HOME/lib/postgresql*.jar
```

#### Verification
To verify JDBC drivers are properly installed:
1. Start JMeter GUI
2. Add a JDBC Connection Configuration element
3. Click on "Database URL" dropdown
4. You should see `jdbc:postgresql://` option

**Note**: After adding new JAR files, you must restart JMeter for them to be loaded.

---

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

### Python Utilities

#### 1. **run_with_profiling.py** - Performance Test with System Monitoring
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

### Data Preparation Workflow
```bash
# 1. Generate test data from real database
python get_real_lastnames.py --env source --output common_last_names.csv

# 2. Get multi-pet owners for complex scenarios
python get_multi_pet_owners.py --env source

# 3. Generate owner IDs CSV
python generate_multi_pet_owner_ids.py --env source --output multi_pet_owner_ids.csv
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
python run_with_profiling.py 01_New_Client_Registration.jmx --env source

# Test target environment
python run_with_profiling.py 01_New_Client_Registration.jmx --env target

# Compare HTML reports in results/ directory
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
