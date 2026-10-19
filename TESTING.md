# Automated tests

The assignment's category boundary convention is lower-inclusive and upper-exclusive: `[minWeightKg, maxWeightKg)`. The final category has no upper limit. A 500.00 kg vehicle is Medium; a 2500.00 kg vehicle is Heavy.

## Commands

From this app repository:

```powershell
npm ci
npm run test:unit
npm run test:e2e -- tests/e2e/app.spec.js
```

The app unit suite covers client request URLs, methods, payloads, cancellation, server validation errors, vehicle fields, category range continuity, and rendered sort controls. Run the nonmutating HTTP request-validation suite against a running API with:

```powershell
$env:API_BASE_URL = 'http://127.0.0.1:5155'
npm run test:e2e -- tests/e2e/request-validation.spec.js
```

The Playwright UI suite starts Vite automatically. Install its Chromium browser with `npx playwright install chromium`, or set `$env:PLAYWRIGHT_BROWSER_CHANNEL = 'chrome'` to use installed Google Chrome.

The SQL-backed API suite requires a running API and a separate, disposable SQL Server database with migrations and seed data applied:

```powershell
$env:API_BASE_URL = 'http://127.0.0.1:5155'
$env:E2E_TEST_DATABASE = '1'
npm run test:e2e -- tests/e2e/api.spec.js
```

Without `API_BASE_URL`, API tests are skipped. Without `E2E_TEST_DATABASE=1`, the tests that create vehicles or change category definitions are skipped. The latter test restores the original category configuration in a `finally` block, but its created vehicle remains in the disposable database.

The UI tests mock API responses to check that the app uses API data and sends writes. This lets them run without SQL Server. They currently fail where the app still uses hard-coded arrays or inactive controls; they should not be marked skipped just to get a green suite.

## Coverage map

| Requirement                                                                   | Tests                                                                                                |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Vehicle creation, required fields, positive two-decimal weight, sensible year | .NET command and aggregate tests; Playwright API and UI tests                                        |
| Predefined manufacturers                                                      | .NET EF model seed tests; Playwright API seed test; UI manufacturer selector test                    |
| Exact category boundaries and open-ended final range                          | Vitest category rules; .NET range and EF model tests; Playwright API seed and vehicle tests          |
| No category gaps or overlaps                                                  | Vitest category rules; .NET range and category service tests; Playwright API configuration rejection |
| Category edits recategorise existing vehicles                                 | Vitest category rules; Playwright UI and API tests                                                   |
| Category name, icon, range, create/edit/delete                                | .NET command, aggregate, range, and service tests; Playwright UI and API tests                       |
| Vehicle list, icon, four sort fields                                          | Vitest vehicle list tests; Playwright UI and API tests                                               |
| Persistence and safe not-found/error responses                                | Playwright API create/read and error tests                                                           |

The API's .NET tests are in the sibling `credit-works-vehicle-management-api/CreditWorks.VehicleManagement.Unit.Test` project and run with `dotnet test` from that repository. A full SQL persistence test requires the disposable database above.
