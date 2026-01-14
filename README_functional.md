# Migration Test Automation Suite

This repository contains automated functional and E2E tests for the Book Service and PetClinic applications, designed to validate consistency between Source and Target environments during migration.

## Project Structure

- `book_store/functional_tests/`: Playwright tests for the Book Store application.
- `pet_clinic/functional_tests/`: Playwright tests for the Spring PetClinic application.

Each application also includes:
- `peformance_tests/`: JMeter and Python-based performance testing
- `data_testing/`: Database integrity and performance testing
- `test_data/`: Test data management utilities

For complete documentation, see:
- [Book Store README](book_store/README.md)
- [PetClinic README](pet_clinic/README.md)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Setup Instructions

Choose the project you want to work with and navigate to its functional tests directory:

```powershell
# For Book Service
cd book_store/functional_tests

# For PetClinic
cd pet_clinic/functional_tests
```

Inside the project directory, install dependencies:

```powershell
npm install
```

Install Playwright browsers:

```powershell
npx playwright install
```

## Configuration

Each project uses a `.env` file to manage environment URLs. Ensure your `.env` file is configured correctly (e.g., in `book_store/functional_tests/`):

```dotenv
SOURCE_BASE_URL=https://source-env-url
TARGET_BASE_URL=https://target-env-url
```

**Note**: The parent directories also contain `api_config.json` and `db_config.json` for performance and data testing. See individual project READMEs for details.

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
```

### Run a specific test case
```powershell
npx playwright test -g "TC-E2E-002"
```

### Run tests in a specific file
```powershell
npx playwright test tests/book_store.spec.ts
```

## Viewing Reports

After running tests, a report is generated. To view it:
```powershell
npx playwright show-report
```

## Troubleshooting

- **Timeout Issues**: If tests fail due to timeouts, check if functional tests folders (`book_store/functional_tests/` or `pet_clinic/functional_tests/`).

## Additional Testing Capabilities

Beyond functional testing, each application includes:

### Performance Testing
- JMeter test plans for load and stress testing
- Python scripts for quick endpoint validation
- System resource monitoring during tests

```powershell
# Navigate to performance tests
cd book_store/peformance_tests
# or
cd pet_clinic/peformance_tests
```

See [Book Store Performance Tests](book_store/peformance_tests/README.md) or [PetClinic Performance Tests](pet_clinic/peformance_tests/README.md) for details.

### Data Integrity Testing
- Pre/post-migration verification
- Database schema validation
- Test data generation and management

```powershell
# Navigate to data testing
cd book_store/data_testing
# or
cd pet_clinic/data_testing
```

See individual data_testing READMEs for complete documentation.

## Quick Reference

| Task | Book Store | PetClinic |
|------|-----------|-----------|
| Functional Tests | [book_store/functional_tests](book_store/functional_tests/README.md) | [pet_clinic/functional_tests](pet_clinic/functional_tests/README.md) |
| Performance Tests | [book_store/peformance_tests](book_store/peformance_tests/README.md) | [pet_clinic/peformance_tests](pet_clinic/peformance_tests/README.md) |
| Data Integrity | [book_store/data_testing](book_store/data_testing/data_integrity_tests/README.md) | [pet_clinic/data_testing](pet_clinic/data_testing/data_integrity_tests/README.md) |
| Main Documentation | [book_store/README.md](book_store/README.md) | [pet_clinic/README.md](pet_clinic/README.md) |
- **Browser Issues**: Run `npx playwright install` to ensure browsers are up to date.
- **Environment Variables**: Ensure `.env` files exist in the project root folders (`functional_tests_book_service/` or `functional_tests_petclinic/`).
