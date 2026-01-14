# PetClinic Test Automation Suite

Comprehensive test automation framework for the Spring PetClinic application, supporting functional, performance, and data integrity testing across multiple environments.

## 🚀 Quick Start

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd pet_clinic
   ```

2. **Configure Environments**
   - Copy and update `db_config.json` for database connections
   - Copy and update `api_config.json` for API endpoints

3. **Choose Your Testing Approach**
   - [Functional Tests](#functional-tests) - API and UI testing
   - [Performance Tests](#performance-tests) - Load and stress testing  
   - [Data Testing](#data-testing) - Database integrity and migration verification

---

## 📁 Project Structure

```
pet_clinic/
├── api_config.json                 # API endpoint configurations
├── db_config.json                  # Database connection configurations
├── test_postgres_connection.py     # PostgreSQL connection test utility
├── functional_tests/               # Playwright-based functional testing
│   ├── package.json               # Node.js dependencies
│   ├── playwright.config.ts       # Playwright configuration
│   ├── README.md                  # Functional tests documentation
│   ├── testcases/                 # Test case specifications
│   └── tests/                     # Test implementations
├── peformance_tests/              # JMeter and Python performance testing
│   ├── *.jmx                      # JMeter test plans (6 business scenarios)
│   ├── *.csv                      # Test data files
│   ├── *.py                       # Python testing scripts
│   ├── test_cases.md              # Performance test cases
│   ├── CRITICAL_BUSINESS_SCENARIOS.md  # Business scenarios documentation
│   └── PERFORMACE_TEST_ANALYSIS.md     # Performance test analysis
├── data_testing/                  # Database integrity and performance testing
│   ├── query_db_content.py        # Database content query utility
│   ├── query_db_tables.py         # Database table query utility
│   ├── data_integrity_tests/      # Migration and integrity verification
│   │   ├── create_snapshot.py     # Pre-migration snapshot creation
│   │   ├── verify_migration.py    # Post-migration verification
│   │   ├── populate_test_data.py  # Test data population
│   │   └── README.md              # Data integrity testing guide
│   └── database_performance_tests/ # Database performance testing
│       ├── run_and_monitor_db_test.py # Performance test runner
│       ├── JMeter_DB_Mixed_Operations.jmx # JMeter DB test plan
│       └── README.md              # Database performance guide
└── test_data/                     # Test data management utilities
    ├── create_snapshot.py         # Database snapshot creation
    └── populate_test_data.py      # Test data generator
```

---

## 🎯 Testing Modules

### Functional Tests
**Location:** `functional_tests/`  
**Technology:** Playwright, TypeScript, Node.js  
**Purpose:** End-to-end UI testing and API validation

**Key Features:**
- Cross-browser testing (Chrome, Firefox, Safari)
- API endpoint testing (Owners, Pets, Visits, Veterinarians)
- UI workflow automation
- Database integration testing

**Quick Commands:**
```bash
cd functional_tests
npm install
npx playwright test                    # Run all tests
npx playwright test --ui              # Interactive mode
npx playwright test --headed          # Visible browser mode
```

📖 **[Complete Functional Testing Guide →](functional_tests/README.md)**

---

### Performance Tests  
**Location:** `peformance_tests/`  
**Technology:** JMeter, Python, Apache JMeter  
**Purpose:** Load testing, stress testing, and performance monitoring

**Key Features:**
- 6 critical business scenario test plans
- Python-based endpoint testing scripts
- System resource monitoring during tests
- Environment-based configuration
- Real-world workflow simulation

**Test Scenarios:**
1. New Client Registration
2. Returning Client Visit
3. Multi-Pet Owner Management
4. Vet Directory Lookup
5. High Volume Search
6. Visit History Review

**Quick Commands:**
```bash
# Quick API endpoint testing
python peformance_tests/test_endpoints.py

# JMeter performance test with monitoring
python peformance_tests/run_with_profiling.py 01_New_Client_Registration.jmx

# Test specific workflow
python peformance_tests/test_visit_flow.py
```

📖 **[Complete Performance Testing Guide →](peformance_tests/README.md)**

---

### Data Testing
**Location:** `data_testing/`  
**Technology:** Python, psycopg2, PostgreSQL  
**Purpose:** Database integrity, migration verification, and data consistency testing

#### Data Integrity Tests
**Sub-location:** `data_testing/data_integrity_tests/`

**Key Features:**
- Pre-migration snapshot creation
- Post-migration verification and comparison
- Schema validation and data integrity checks
- Automated test data generation with relationships

**Quick Commands:**
```bash
# Create snapshot before migration
python data_testing/data_integrity_tests/create_snapshot.py --env source

# Populate test data
python data_testing/data_integrity_tests/populate_test_data.py --env target

# Verify after migration
python data_testing/data_integrity_tests/verify_migration.py --env target
```

#### Database Performance Tests
**Sub-location:** `data_testing/database_performance_tests/`

**Key Features:**
- Database load testing (Python + JMeter)
- System performance monitoring during DB operations
- Automated database seeding and cleanup
- Real-time metrics collection

**Quick Commands:**
```bash
# Python-based DB performance test
python data_testing/database_performance_tests/run_and_monitor_db_test.py --env target

# JMeter-based DB performance test  
python data_testing/database_performance_tests/run_and_monitor_db_test.py --tool jmeter --env target
```

📖 **[Complete Data Testing Guide →](data_testing/data_integrity_tests/README.md)**  
📖 **[Database Performance Guide →](data_testing/database_performance_tests/README.md)**

---

## ⚙️ Configuration

### Database Configuration (`db_config.json`)
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
    "target": { "...": "similar configuration" },
    "local": { "...": "local database configuration" }
  }
}
```

### API Configuration (`api_config.json`) 
```json
{
  "environments": {
    "source": {
      "description": "Source API Environment",
      "base_url": "http://10.130.73.5:8080",
      "verify_ssl": false,
      "timeout": 10
    },
    "target": { "...": "similar configuration" },
    "local": { "...": "local API configuration" }
  }
}
```

---

## 🛠️ Prerequisites

### System Requirements
- **Windows 10/11** (primary development OS)
- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Apache JMeter 5.6.3+** (for performance testing)
- **PostgreSQL** client libraries

### Python Dependencies
```bash
pip install -r requirements.txt
```

### Key Python Packages
- `requests` - HTTP API testing
- `psycopg2-binary` - PostgreSQL database connectivity 
- `pandas` - Data analysis and reporting
- `matplotlib` - Performance graphs and visualization
- `psutil` - System performance monitoring

### Node.js Dependencies (Functional Tests)
```bash
cd functional_tests
npm install
```

### Key Node.js Packages
- `@playwright/test` - Browser automation and testing
- `typescript` - Type-safe test development

---

## 🚀 Common Usage Scenarios

### 1. Pre-Deployment Validation
```bash
# Quick validation of all endpoints
python peformance_tests/test_endpoints.py

# Test critical business scenarios
python peformance_tests/test_visit_flow.py
python peformance_tests/test_extraction_flow.py
```

### 2. Database Migration Testing
```bash
# Step 1: Create snapshot before migration  
python data_testing/data_integrity_tests/create_snapshot.py --env source

# Step 2: Perform your database migration

# Step 3: Verify migration success
python data_testing/data_integrity_tests/verify_migration.py --env target
```

### 3. Full Regression Testing
```bash
# 1. Functional tests (API + UI)
cd functional_tests && npx playwright test

# 2. Performance tests  
python peformance_tests/run_with_profiling.py 01_New_Client_Registration.jmx

# 3. Data integrity verification
python data_testing/data_integrity_tests/verify_migration.py --env target
```

### 4. Environment Comparison
```bash
# Compare database schemas
python data_testing/query_db_tables.py --env source  
python data_testing/query_db_tables.py --env target

# Compare database content
python data_testing/query_db_content.py --env source
python data_testing/query_db_content.py --env target
```

---

## 📊 Test Reports and Results

### Functional Test Reports
- **HTML Reports:** `functional_tests/playwright-report/`
- **Screenshots:** Auto-captured on test failures
- **Video Recordings:** Available for failed test debugging
- **Trace Files:** For detailed step-by-step debugging

### Performance Test Reports  
- **JMeter HTML Reports:** `peformance_tests/results/*/index.html`
- **System Metrics:** `peformance_tests/results/profiling/graphs/`
- **CSV Results:** `peformance_tests/results/*.jtl`

### Data Testing Reports
- **Migration Reports:** `verification_report_YYYYMMDD_HHMMSS.json`
- **Snapshot Files:** `snapshot_YYYYMMDD_HHMMSS.json`
- **Execution Logs:** `*_YYYYMMDD_HHMMSS.log`

---

## 🔧 Troubleshooting

### Common Issues

**Database Connection Failed**
- Verify `db_config.json` configuration
- Check PostgreSQL client libraries installation
- Confirm network connectivity and credentials
- Test connection: `python test_postgres_connection.py`

**API Endpoint Not Found**
- Verify `api_config.json` base_url
- Check if the PetClinic application is running
- Validate network connectivity

**JMeter Tests Failing**
- Ensure JMeter is in system PATH
- Verify test data CSV files are present
- Check database connectivity from JMeter

**Playwright Browser Issues**
```bash
# Reinstall browsers
npx playwright install --force
```

### Getting Help

1. **Check Module Documentation:**
   - [Functional Tests README](functional_tests/README.md)
   - [Performance Tests README](peformance_tests/README.md)  
   - [Data Integrity README](data_testing/data_integrity_tests/README.md)
   - [Database Performance README](data_testing/database_performance_tests/README.md)

2. **Check Test Documentation:**
   - [Performance Test Cases](peformance_tests/test_cases.md)
   - [Critical Business Scenarios](peformance_tests/CRITICAL_BUSINESS_SCENARIOS.md)
   - [Performance Analysis](peformance_tests/PERFORMACE_TEST_ANALYSIS.md)
   - [Functional Test Cases](functional_tests/testcases/README.md)

---

## 🤝 Contributing

### Development Guidelines
1. **Follow existing code structure** and naming conventions
2. **Update documentation** when adding new features
3. **Add test cases** for new functionality
4. **Use environment-based configuration** for all scripts
5. **Generate appropriate logs and reports**

### Adding New Tests
1. **Functional Tests:** Add to `functional_tests/tests/` with corresponding documentation in `functional_tests/testcases/`
2. **Performance Tests:** Add JMeter files to `peformance_tests/` and update `peformance_tests/README.md`
3. **Data Tests:** Add to appropriate subfolder in `data_testing/` with documentation updates

---

## 📋 License

This test automation suite is developed for the Spring PetClinic application testing. Please refer to your organization's licensing terms for usage and distribution guidelines.
