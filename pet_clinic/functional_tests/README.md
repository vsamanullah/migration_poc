# PetClinic Functional Tests

Playwright-based test suite for the Spring PetClinic application, designed to validate consistency between Source and Target environments during migration.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Setup Instructions

Navigate to this directory:

```powershell
cd pet_clinic/functional_tests
```

Install dependencies:

```powershell
npm install
```

Install Playwright browsers:

```powershell
npx playwright install
```

## Configuration

This project uses a `.env` file to manage environment URLs. Ensure your `.env` file is configured correctly:

```dotenv
SOURCE_BASE_URL=https://source-env-url
TARGET_BASE_URL=https://target-env-url
```

**Note**: The parent directory also contains `api_config.json` and `db_config.json` for performance and data testing. See [PetClinic README](../README.md) for details.

## Running Tests

Tests are organized into two Playwright projects: `Source Environment` and `Target Environment`.

### Run all tests in both environments
```powershell
npx playwright test
```

### Run tests for a specific environment
```powershell
npx playwright test --project="Target Environment"
npx playwright test --project="Source Environment"
```

### Debugging & Visual Execution
To see the browser during execution and run tests sequentially:
```powershell
npx playwright test --headed --workers=1
npx playwright test --headed --workers=1 --project="Source Environment"
npx playwright test --headed --workers=1 --project="Target Environment"
```

### Run a specific test case
```powershell
npx playwright test -g "TC-E2E-002"
```

### Run tests in a specific file
```powershell
npx playwright test tests/petclinic.spec.ts
```

## Viewing Reports

After running tests, a report is generated. To view it:
```powershell
npx playwright show-report
```

## Test Case Documentation

Detailed test case documentation can be found in the [testcases/](./testcases/) folder.

## Troubleshooting

- **Timeout Issues**: If tests fail due to timeouts, check if the application is accessible and responsive.
- **Browser Issues**: Run `npx playwright install` to ensure browsers are up to date.
- **Environment Variables**: Ensure the `.env` file exists in this directory with correct URLs.

## Additional Testing Capabilities

Beyond functional testing, the PetClinic application includes:

### Performance Testing
- JMeter test plans for load and stress testing
- Python scripts for quick endpoint validation
- System resource monitoring during tests

```powershell
cd ../performance_tests
```

See [Performance Tests README](../performance_tests/README.md) for details.

### Data Integrity Testing
- Pre/post-migration verification
- Database schema validation
- Test data generation and management

```powershell
cd ../data_testing
```

See [Data Testing README](../data_testing/README.md) for complete documentation.

## Quick Reference

| Task | Location |
|------|----------|
| Functional Tests | [pet_clinic/functional_tests](.) |
| Performance Tests | [pet_clinic/performance_tests](../performance_tests/README.md) |
| Data Integrity | [pet_clinic/data_testing](../data_testing/data_integrity_tests/README.md) |
| Main Documentation | [pet_clinic/README.md](../README.md) |

