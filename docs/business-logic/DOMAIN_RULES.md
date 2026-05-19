# Domain Rules & Business Logic

This document serves as the "Source of Truth" for the business rules and domain constraints of the Vireo application. Unlike technical documentation, this focuses on _what_ the system does and _why_, rather than _how_ it is implemented.

---

## 1. Event Actions & UI Entry

### Context

Events are the primary way users track their job search progress. The application provides a set of pre-defined "Event Actions" and a global Floating Action Button (FAB) to streamline data entry.

### Floating Action Button (FAB)

1.  **Global Access:** The FAB is available throughout the application (except during active event entry) to initiate common actions.
2.  **Contextual Filtering:** When viewed on an entity detail page (Company, Contact, or Role), the FAB filters the available actions to only show those relevant to the current route.
3.  **Contextual Suggestions:** On detail pages, the FAB displays a "nudge" message (e.g., "Add Activity for this Role") after a 1-second delay to suggest ways to simplify data entry by automatically linking the activity to the current entity.
4.  **Automatic Context Population:** Initiating an event from an entity page or using the contextual FAB actions automatically populates the Company, Contact, and/or Role fields in the event form.

### Multi-Step Event Creation

The "New Event" process is a 4-step guided workflow:
- **Step 1: Type** (Select the kind of event)
- **Step 2: Context** (Select Company, Role, and Contact)
- **Step 3: Details** (Set direction, source, date, and summary)
- **Step 4: Reminder** (Optionally set a follow-up reminder)

#### Entry Rules:
1.  **Pre-defined Actions:** If a specific action (e.g., "Applied") is selected from the FAB, the process **starts on Step 2**.
2.  **Backward Navigation:** Even if starting on Step 2, users can navigate back to Step 1 at any time to change the event type.
3.  **Inbound/Outbound Defaults:**
    - Each pre-defined action comes with a default direction (e.g., "Applied" defaults to Outbound; "Email Received" defaults to Inbound).
    - If a user manually selects an Event Type in Step 1, the system **infers and sets a default direction** based on the event type name (e.g., types containing "Sent" or "Applied" default to Outbound; "Received" or "Outreach" default to Inbound).
    - Users can always manually override these defaults in Step 3.

### Available Actions & Defaults

| Action | Event Type | Default Direction | Default Source |
| :--- | :--- | :--- | :--- |
| **Not Selected** | Not Selected | Inbound | Email |
| **Networking/Coffee Chat** | Networking/Coffee Chat | Outbound | LinkedIn |
| **Interview Completed** | Interview Completed | Outbound | Website |
| **Interview Scheduled** | Interview Scheduled | Inbound | Email |
| **Email Received** | Email Received | Inbound | Email |
| **Follow-up Sent** | Follow-up Sent | Outbound | Email |
| **Recruiter Outreach** | Recruiter Outreach | Inbound | LinkedIn |
| **Applied** | Applied | Outbound | Website |

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

Vireo is designed as a local-first application for speed and offline availability.

### Rules

1. **Local-First Storage:** All data is primarily stored in the browser's internal storage (e.g., IndexedDB).
2. **Syncing Mode:** When a user signs in, the application enters "Syncing Mode" and synchronizes local data with an external cloud store.
3. **Multi-Device Support:** Data synced to the cloud can be retrieved on other devices by signing in with the same account.
4. **Offline Capability:** Users can continue to work offline by signing out; the application remains functional using the local data.
