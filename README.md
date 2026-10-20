# CreditWorks Vehicle Management app

React 19 and Vite interface for the vehicle management assessment. It uses the sibling [API](../credit-works-vehicle-management-api/README.md) for vehicles and weight categories. This README separates the project's requirements from the behavior currently delivered by the UI.

## Run locally

Use a Node.js version supported by Vite 8, npm, and a running API with an initialized SQL Server database. From this directory:

```powershell
npm ci
npm run dev
```

Vite proxies `/api` to `http://localhost:5155`. Set `VITE_API_TARGET` before starting Vite to change that address. `npm run build` creates a production bundle; its host must route `/api` to the backend. Checks: `npm run lint`, `npm run format:check`, `npm run test:unit`, and `npm run test:e2e`. See [TESTING.md](TESTING.md) for browser and disposable-database setup.

## Functional requirements

| Requirement                                                                                             | Current UI status                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Add a vehicle with owner, manufacturer, year, and positive weight                                       | **Partial.** The form opens a blank vehicle, validates it, and waits for queued creation before refreshing the list. It also requires VIN and registration number, project extensions used for duplicate checks beyond the four minimum fields.                                                                                                                                                       |
| View vehicles with owner, manufacturer, year, weight, and current category/icon                         | **Implemented for the loaded page.** The app gets vehicles from `GET /api/vehicles/search` and categories from `GET /api/categories/list`. The API returns weight, not category; the UI matches each weight to the latest loaded ranges and renders the category name and icon.                                                                                                                       |
| Sort vehicles by owner, manufacturer, year, or weight                                                   | **Partial.** The UI offers one selected field and ascending/descending direction. It sorts the current page in the browser; it does not send the sort to the API, so the order across pages is not guaranteed. Multi-field UI sorting is outside the requirement.                                                                                                                                     |
| Search and browse vehicles                                                                              | **Partial.** The UI offers owner text, category, manufacturer, and year filters plus page controls. Category bounds are lower inclusive and upper exclusive, but the API's maximum-weight filter is inclusive; a boundary vehicle may appear in the preceding category's filtered results. Pagination uses 10 records per API page; the page controls and retained filters need further verification. |
| View and edit an existing vehicle                                                                       | **Partial.** The edit control opens a detail form and the update helper sends `PUT`. For an accepted write, the app polls its queue status before returning to and refreshing the list. The sidebar shows completion or failure, but the API does not provide a detailed failure reason.                                                                                                              |
| Add, edit, and delete categories with name, optional description, weight range, and icon                | **Partial.** The category page has draft edit and delete controls and sends a complete configuration to `PATCH /api/categories`. Draft state, validation, and confirm are not consistently connected, so the full workflow is not reliable.                                                                                                                                                           |
| Keep categories exhaustive, without gaps or overlaps, and recategorise existing vehicles after a change | **Implemented in API validation and UI display logic; end-to-end flow partial.** Ranges are `[minWeightKg, maxWeightKg)`: first starts at 0, adjacent bounds meet, and the last has no upper bound. Vehicle rows do not store category IDs, so a fresh category load can change their displayed category.                                                                                             |

Initial categories are Light `[0, 500)` with `car`, Medium `[500, 2500)` with `van`, and Heavy `[2500, infinity)` with `truck`. At exactly 500 kg a vehicle is Medium; at exactly 2500 kg it is Heavy.

The UI's icon options (`bike`, `car`, `van`, `truck`) and manufacturer options (Mazda, Mercedes, Honda, Ferrari, Toyota) are hardcoded. Multiple categories may use the same icon. The API seeds manufacturers and stores category icon keys. Database-managed add/update/delete catalogs and more icons are possible enhancements.

## Queued request progress

Vehicle create/update and category confirmation can return `202 Accepted` with a queue ID. The app uses that ID to poll `GET /api/request/{id}`. A `202` means the write was accepted for processing; the UI waits for the queue status before treating it as complete.

The **Request progress** panel in the left sidebar shows the request method and path, the first eight characters of its ID, the number of status checks, and one of these states:

| Panel state      | Meaning                                                                            |
| ---------------- | ---------------------------------------------------------------------------------- |
| `not started`    | The accepted request was added to the local progress list.                         |
| `started`        | The app is checking the queue status. The attempt count increases with each check. |
| `completed`      | The status endpoint returned `succeeded`; the write call can finish.               |
| `request failed` | The status endpoint returned `failed`; the write call reports an error.            |
| `poll failed`    | A status check failed or the polling limit was reached. Completion is unknown.     |

Checks run one at a time, starting with a 1-second delay between pending checks and increasing to at most 5 seconds, for up to 10 attempts. A final state remains in the panel for 20 seconds. After a successful vehicle write, the vehicle list refreshes. The panel does not persist progress across a page reload.

The API keeps queue statuses in memory and removes a terminal status after it is read. A server restart can therefore leave a pending request without a status to query. The API currently returns `failed` without a user-facing cause; the server log contains the exception. A polling failure does not prove that the queued write failed.

## Non-functional requirements and current limits

- **Persistence:** The browser uses the SQL Server-backed API. The UI itself does not persist data. Reload categories after a completed update to use new boundaries; a `202 Accepted` response alone does not establish completion.
- **Validation and feedback:** The vehicle form checks required fields, year, identifier format, and two-decimal positive weight before sending; the API is authoritative. The request helper displays Problem Details messages when present. The polling panel reports queued write outcomes, while detailed server-side failure causes remain in API logs.
- **Usability and responsiveness:** The page and table CSS include narrow-screen layouts and horizontal table overflow. Full keyboard, screen-reader, and contrast review is outside this assessment; no accessibility compliance is claimed.
- **Testing and maintainability:** Vitest, Playwright, ESLint, and Prettier scripts are available. UI tests use mocked API responses; SQL-backed endpoint tests require a disposable database. Test presence does not imply the partial flows above are complete.
- **Security and deployment:** The local app has no sign-in flow. Production hosting must supply an API route, HTTPS, and access controls appropriate to its environment. The project currently targets local assessment use.

## Scope assumptions and enhancements

- VIN and registration number are **implemented additions** beyond the assessment's four minimum vehicle fields. The API checks duplicates before saving; the database has no unique indexes for them.
- Adding or modifying manufacturers, managing the icon catalog, and persistent notifications for queued request outcomes are outside the current scope.
- The assessment assumes owner and manufacturer names are alphanumeric, but the app/API do not consistently enforce a literal alphanumeric-only rule. Seeded owner names contain spaces; a real rule needs to define whether spaces and punctuation are allowed.
- The design assumes no more than 10 categories, but there is no enforced count limit. Category-list scaling and pagination are possible enhancements.
- Commands and queries currently share one API host. Separating them into different hosts is outside scope.
