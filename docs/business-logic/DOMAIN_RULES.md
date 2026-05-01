# Domain Rules & Business Logic

This document serves as the "Source of Truth" for the business rules and domain constraints of the JobTracker application. Unlike technical documentation, this focuses on *what* the system does and *why*, rather than *how* it is implemented.

---

## 1. Role & Company Cardinality

### Context
A **Company** represents an organization, and a **Role** represents a specific job opening or position.

### Rules
1. **One-to-Many Relationship:** A Company can have many Roles, but a Role is typically associated with exactly one Company.
2. **Optionality:** While most Roles should be tied to a Company, the system allows for "Global" Roles (roles without a specific company) to reduce friction during rapid data entry.

### UI Enforcement (Acceptance Criteria)
- **Scoped Search:** When a Company is selected during Event creation, the Role search must be restricted to Roles belonging to that Company.
- **Automatic Reset:** If a user changes or clears the Company field, the Role field must be automatically cleared if the currently selected Role is no longer compatible with the new Company selection.
- **Cascading Selection:** Selecting a Role that is already associated with a Company should automatically populate the Company field.

---

## 2. Event Status Synchronization

### Context
Events (e.g., "Applied", "Interview Scheduled") track the progress of a job application. The Role has a `status` field that should reflect the current state of that application.

### Rules
- **Target Status:** Each `EventType` can define a `targetStatus`.
- **Creation Sync:** When an Event is created, if its `EventType` has a `targetStatus`, the associated Role's status should be updated to match.
- *(Future Requirement)*: If an Event is deleted or updated, the Role's status should be re-calculated based on the most recent Event in its history.
