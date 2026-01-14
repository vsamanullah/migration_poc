# Locator Map: Pet Management Flow

## 1. Navigation
To access the Pet Management functions, start from the persistent navigation menu.

| Element | Locator | Type | Notes |
| :--- | :--- | :--- | :--- |
| **Find Owners Menu** | `a[title="find owners"]` | Link | Navigate to Search Page |
| **Find Owner Button** | `button[type="submit"]` | Button | On `/petclinic/owners/find.html`. Click without criteria to list all. |
| **Owner Link** | `a[href*="/petclinic/owners/"]` | Link | In the results table (e.g., `text=Amanda Anderson`) |

## 2. Owner Information Page
**URL Pattern**: `/petclinic/owners/{ownerId}.html`

| Element | Locator | Type | Notes |
| :--- | :--- | :--- | :--- |
| **Add New Pet Button** | `text="Add New Pet"` | Link | Navigates to Add Pet form |
| **Pets Table** | `table.table-striped` | Table | Contains "Pets and Visits" section |
| **Pet Name Cell** | `dd >> text="{petName}"` | Text | The name appears in a Definition List (`dl`) inside the table cell |
| **Pet Birth Date** | `dd >> text="{date}"` | Text | Format verified: `yyyy-MM-dd` in display |

*Note: The Pet Information is rendered within nested tables. The outer table contains rows for each pet, and the details (Name, Birth Date, Type) are often inside a `dl` (Description List) within the first column.*

## 3. Add Pet Page
**URL Pattern**: `/petclinic/owners/{ownerId}/pets/new`

| Element | Locator | Type | Notes |
| :--- | :--- | :--- | :--- |
| **Name Input** | `#name` | Input | |
| **Birth Date Input** | `#birthDate` | Input | **Critical**: Requires `yyyy/MM/dd` format (slashes). Dashes (`-`) cause validation errors. |
| **Type Select** | `#type` | Select | Options: bird, cat, dog, hamster, lizard, snake |
| **Add Pet Submit** | `button[type="submit"]` | Button | Text: "Add Pet" |

## 4. Workarounds & Observations
- **Date Validation**: The standard HTML5 date picker might not be preset or compatible. Sending keys with slashes (`2023/01/01`) is the reliable method for this specific implementation.
- **Server Errors**: Occasional 500 errors observed in console for resource loading, but functional flow remains intact.
