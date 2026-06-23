---
name: beta-management
description: Guidelines and instructions for administrative tasks, including approving beta users and disabling user synchronization.
---

# Administrative Tasks: Beta User Management

Administrative tasks like approving beta users or disabling sync can be performed via manual GitHub Actions or local scripts.

## 1. Commands

- **Approve Beta User**: Moves an applicant from `PENDING` to `APPROVED` and generates a `BetaToken`.
  Run the command:
  ```bash
  npm run beta:approve <email>
  ```
  *(or `--prefix apps/sync-backend` depending on command execution context).*

- **Disable User Sync**: Sets the `isActive` flag to `false` on the User record, blocking the `/sync` endpoint with a 403 error.
  Run the command:
  ```bash
  npm run beta:disable <email>
  ```

## 2. GitHub Actions

These are also available as secure **GitHub Actions** (under the "Actions" tab in the repository) for secure management without local `.env` configuration.
