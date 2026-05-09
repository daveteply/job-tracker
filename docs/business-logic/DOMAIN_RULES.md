# Domain Rules & Business Logic

This document serves as the "Source of Truth" for the business rules and domain constraints of the JobTracker application. Unlike technical documentation, this focuses on _what_ the system does and _why_, rather than _how_ it is implemented.

---

## 1. Event Actions & UI Entry

### Context

Events are the primary way users track their job search progress. The application provides a set of pre-defined "Event Actions" to streamline data entry.

### Rules

1. **Event Action Menu:** A global action menu (Floating Action Button) is available throughout most of the application to quickly initiate common events.
2. **Contextual Availability:** The Event Action menu is hidden when a user is actively entering an Event to prevent nested entry or state conflicts.
3. **Available Actions:**
   - **Not Selected:** For rejection notices (Inbound/Email).
   - **Networking/Coffee Chat:** For networking activities (Outbound/LinkedIn).
   - **Interview Completed:** Records a finished interview (Outbound/Website).
   - **Interview Scheduled:** Records an upcoming interview (Inbound/Email).
   - **Email Received:** General incoming communication (Inbound/Email).
   - **Follow-up Sent:** Outgoing follow-up messages (Outbound/Email).
   - **Recruiter Outreach:** Incoming recruiter contact (Inbound/LinkedIn).
   - **Applied:** The initial application (Outbound/Website).

4. **Action Defaults:** Each action provides default values for:
   - Event Type
   - Direction (Inbound/Outbound)
   - Source Type (Email, LinkedIn, Website, etc.)
     _Note: Users can manually override these defaults during entry._

### Context-Aware Entry

- **Automatic Population:** When initiated from a specific **Company** or **Role** detail page, the Event entry form automatically populates the corresponding Company and/or Role fields.
- **Cascading Selection:** If a Role is selected that has an associated Company, the Company field is automatically populated.

---

## 2. Role & Company Status Rules

### Context

The status of a Role reflects the candidate's current standing in the application process for that specific position.

### Rules

1. **Event-to-Status Mapping:** Creating certain Events automatically updates the associated Role's status:
   - **Job Lead** -> Lead
   - **Applied / Application Viewed** -> Applied
   - **Technical Interview / Onsite Interview / Screening Call** -> Interviewing
   - **Offer Received** -> Offer
   - **Offer Accepted** -> Accepted
   - **Not Selected** -> Not Selected
   - **Withdrew Application** -> Withdrawn

2. **Inactive Roles:** A Role is considered "Inactive" if its status is one of the following:
   - **Not Selected**
   - **Withdrawn**
   - **Ghosted**

3. **Inactive Companies:** A Company is considered "Inactive" if **all** associated Roles are in an Inactive state.

---

## 3. Event Summaries

### Context

Event summaries provide a quick, readable overview of an event in lists and timelines.

### Rules

1. **Automatic Generation:** By default, summaries are automatically computed based on the Event Type, Role, Company, Contact, and Source (e.g., "Technical Interview at Google via LinkedIn").
2. **Manual Override:** If a user manually edits the summary field, automatic updates stop to preserve the user's custom input.
3. **Manual Regeneration:** Users can manually trigger a regeneration of the summary (via a button in the UI) to reset it based on the current field values.

---

## 4. Entity Management & Lifecycle

### Context

Management of Companies, Roles, and Contacts.

### Rules

1. **Search & Inline-Create:** Field selection for Company, Role, and Contact supports searching for existing entities or creating new ones inline.
2. **Validation:** Each entity type has specific validation rules (e.g., required fields, format constraints) that must be met during creation or editing.
3. **Deletion Safety:**
   - Deleting an entity (Company, Role, Contact, Event, etc.) is handled via a dedicated **Delete UI**.
   - **Usage Checks:** Before deletion, the system performs checks to determine if the entity is currently "in use" (e.g., a Company with active Roles cannot be deleted without first addressing those Roles).

---

## 5. Data Storage & Synchronization

### Context

JobTracker is designed as a local-first application for speed and offline availability.

### Rules

1. **Local-First Storage:** All data is primarily stored in the browser's internal storage (e.g., IndexedDB).
2. **Syncing Mode:** When a user signs in, the application enters "Syncing Mode" and synchronizes local data with an external cloud store.
3. **Multi-Device Support:** Data synced to the cloud can be retrieved on other devices by signing in with the same account.
4. **Offline Capability:** Users can continue to work offline by signing out; the application remains functional using the local data.
