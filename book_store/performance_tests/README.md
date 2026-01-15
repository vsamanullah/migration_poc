# Book Service Performance Testing

This directory contains JMeter performance test scripts and Python utilities for testing the Book Service API endpoints.

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
- **8 JMeter test files** - CRUD operations for Authors and Books endpoints
- **Python automation scripts** - Test execution and database management utilities
- **Profiling script** - System resource monitoring during JMeter tests

All scripts now support **environment-based configuration** using `api_config.json`, allowing you to easily switch between source, target, and local environments.

---

## Prerequisites

### Required Software
- **Python 3.8+** with packages:
  ```bash
  pip install requests urllib3 pandas matplotlib psutil
  ```
- **Apache JMeter 5.6.2+** (for performance tests)
  - Download from: https://jmeter.apache.org/download_jmeter.cgi
  - Add to PATH or use full path to `jmeter` command

- **ODBC Driver 18 for SQL Server** (required for database connectivity)
  - Download: https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server
  - Required for: Python scripts to connect to SQL Server databases
  - Installation:
    ```powershell
    # Download and install the MSI package
    # Verify installation:
    Get-OdbcDriver | Where-Object {$_.Name -like "*SQL Server*"}
    ```
  - **Note**: Required by `pyodbc` Python library used in test data scripts

- **SQL Server 2022 or SQL Server Management Studio (SSMS) 18+** (optional)
  - **SQL Server 2022** (if hosting the database locally):
    - Download: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
    - Required editions: Express (free), Developer (free), or higher
  - **SQL Server Management Studio (SSMS) 18+** (for database management):
    - Download: https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms
    - Required for: Database schema verification, test data management, query execution
  - **sqlcmd utility** (command-line tool):
    - Included with SQL Server and SSMS
    - Used by Python scripts for database operations
    - Verify installation: `sqlcmd -?`

### JMeter Setup - Required Drivers and JAR Files

#### JDBC Drivers (for Database Connection)
Place the following JDBC drivers in `%JMETER_HOME%/lib/` directory:

1. **SQL Server JDBC Driver** (Microsoft SQL Server):
   - File: `mssql-jdbc-12.4.2.jre11.jar` or later
   - Download: https://learn.microsoft.com/en-us/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server
   - Required for: Database connectivity and JDBC samplers

2. **PostgreSQL JDBC Driver** (if using PostgreSQL):
   - File: `postgresql-42.7.1.jar` or later
   - Download: https://jdbc.postgresql.org/download/
   - Required for: PostgreSQL database connectivity

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
# 1. Download JDBC driver
# Visit the download link and save the JAR file

# 2. Copy to JMeter lib directory
Copy-Item "C:\Downloads\mssql-jdbc-12.4.2.jre11.jar" "$env:JMETER_HOME\lib\"

# 3. Restart JMeter (if running)
```

**Linux/Mac:**
```bash
# 1. Download JDBC driver
wget https://github.com/microsoft/mssql-jdbc/releases/download/v12.4.2/mssql-jdbc-12.4.2.jre11.jar

# 2. Copy to JMeter lib directory
cp mssql-jdbc-12.4.2.jre11.jar $JMETER_HOME/lib/

# 3. Verify installation
ls -l $JMETER_HOME/lib/mssql-jdbc*.jar
```

#### Verification
To verify JDBC drivers are properly installed:
1. Start JMeter GUI
2. Add a JDBC Connection Configuration element
3. Click on "Database URL" dropdown
4. You should see `jdbc:sqlserver://` and/or `jdbc:postgresql://` options

**Note**: After adding new JAR files, you must restart JMeter for them to be loaded.

---

### Configuration File
Ensure `api_config.json` exists in the parent directory with environment definitions:

```json
{
  "environments": {
    "source": {
      "description": "Source API Environment",
      "base_url": "https://10.134.77.68",
      "api_prefix": "/api",
      "verify_ssl": false,
      "timeout": 10,
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    },
    "target": {
      "description": "Target API Environment (Post-Migration)",
      "base_url": "https://10.134.77.68",
      "api_prefix": "/api",
      "verify_ssl": false,
      "timeout": 10,
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    },
    "local": {
      "description": "Local Development Environment",
      "base_url": "http://localhost:50524",
      "api_prefix": "/api",
      "verify_ssl": false,
      "timeout": 10,
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    }
  },
  "endpoints": {
    "authors": {
      "path": "/api/Authors",
      "methods": {
        "get_all": "/api/Authors",
        "get_by_id": "/api/Authors/{id}",
        "post": "/api/Authors",
        "put": "/api/Authors/{id}",
        "delete": "/api/Authors/{id}"
      }
    },
    "books": {
      "path": "/api/Books",
      "methods": {
        "get_all": "/api/Books",
        "get_by_id": "/api/Books/{id}",
        "post": "/api/Books",
        "put": "/api/Books/{id}",
        "delete": "/api/Books/{id}"
      }
    }
  }
}
```

---

## Test Scripts

### Python Utilities

#### 1. **run_all_jmeter_tests.py** - Automated Test Suite Runner
Automatically runs all JMeter tests with database reset between each test.

```bash
# Run all tests with target environment (default)
python run_all_jmeter_tests.py --env target

# Run all tests with source environment
python run_all_jmeter_tests.py --env source

# Run all tests with local environment
python run_all_jmeter_tests.py --env local
```

**Features:**
- Discovers all .jmx files automatically
- Resets database before each test (10 records)
- Exports IDs to CSV files for test data
- Runs each test with profiling
- Provides summary of all test results
- Time tracking for each test

**Workflow:**
1. Resets database with populate_test_data.py (10 records)
2. Exports author/book IDs to CSV files
3. Runs each .jmx test with run_with_profiling.py
4. Generates reports for each test
5. Displays overall summary

---

#### 2. **run_with_profiling.py** - Performance Test with System Monitoring
Runs JMeter tests with system resource monitoring (CPU, Memory, Disk, Network).

```bash
# Test with target environment (default)
python run_with_profiling.py 01_Authors_GET_All.jmx

# Test with source environment
python run_with_profiling.py 01_Authors_GET_All.jmx --env source

# Test with local environment
python run_with_profiling.py 06_Books_GET_All.jmx --env local

# Use custom config file
python run_with_profiling.py 01_Authors_GET_All.jmx --env target --config ../custom_api_config.json
```

**Features:**
- Runs JMeter performance tests
- Monitors system resources in real-time
- Resets and seeds database before test
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

## JMeter Performance Tests

### Authors Endpoint Tests (4 tests)
- **01_Authors_GET_All.jmx** - Get all authors
- **02_Authors_GET_ById.jmx** - Get author by ID
- **03_Authors_POST_Create.jmx** - Create new author
- **04_Authors_DELETE.jmx** - Delete author

### Books Endpoint Tests (4 tests)
- **05_Books_GET_All.jmx** - Get all books
- **06_Books_GET_ById.jmx** - Get book by ID
- **07_Books_POST_Create.jmx** - Create new book
- **8_Books_DELETE.jmx** - Delete book

### CSV Data Files
- `author_data.csv` - Test data for creating authors
- `author_ids.csv` - Author IDs for GET/PUT/DELETE operations
- `book_create_data.csv` - Test data for creating books
- `book_ids.csv` - Book IDs for GET/PUT/DELETE operations
- `book_update_data.csv` - Test data for updating books
- `delete_author_ids.csv` - Author IDs for DELETE operations
- `delete_book_ids.csv` - Book IDs for DELETE operations

---

## Usage Examples

### Run All Tests Workflow
```bash
# Run complete test suite (all 8 tests)
python run_all_jmeter_tests.py --env target

# View summary and results
```

### Individual Test Workflow
```bash
# 1. Test specific endpoint with profiling
python run_with_profiling.py 01_Authors_GET_All.jmx --env target

# 2. View HTML report
start results/01_Authors_GET_All_report/index.html

# 3. Check performance graphs
start results/profiling/graphs/performance_report.png
```

### Manual JMeter Execution
If you need to run JMeter tests manually without profiling:

```bash
# Generate HTML report
jmeter -n -t 01_Authors_GET_All.jmx -l results/01_results.jtl -j results/01_jmeter.log -e -o results/01_report

# Run without HTML report
jmeter -n -t 01_Authors_GET_All.jmx -l results/01_results.jtl -j results/01_jmeter.log
```

---

## Environment Comparison

Test both source and target environments to compare performance:

```bash
# Test source environment
python run_all_jmeter_tests.py --env source

# Test target environment
python run_all_jmeter_tests.py --env target

# Compare HTML reports in results/ directory
```

---

## Troubleshooting

### SSL Certificate Errors
All scripts disable SSL verification by default. If you need to enable it, update `api_config.json`:
```json
"verify_ssl": true
```

### Connection Errors
1. Verify the API is running at the configured base_url
2. Check firewall settings
3. Ensure correct port (default: 443 for HTTPS, 80 for HTTP, 50524 for local)

### JMeter Not Found
Add JMeter to PATH or use full path:
```bash
C:\apache-jmeter-5.6.3\bin\jmeter -n -t 01_Authors_GET_All.jmx ...
```

### Missing Python Packages
Install required packages:
```bash
pip install requests urllib3 pandas matplotlib psutil
```

---

## Known Issues

1. **Database reset may fail** if application is not running
   - Script will show warning but continue with tests

2. **File naming inconsistency** for Books DELETE test
   - File is named `8_Books_DELETE.jmx` (without leading zero)
   - This doesn't affect functionality

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
- [Test Cases Documentation](test_cases.md) - Detailed test case specifications
