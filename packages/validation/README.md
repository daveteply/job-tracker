# 📦 validation

The centralized validation layer for Vireo, ensuring data integrity across the entire application.

## 🏗️ Purpose

This package provides a single source of truth for validation logic. By using shared [Zod](https://zod.dev/) schemas, Vireo ensures that data is validated consistently from the moment a user enters it in the UI to the moment it is persisted in the PostgreSQL database.

## 🛠️ Tech Stack

- **Library:** [Zod](https://zod.dev/) for type-safe schema validation.
- **Integration:** Used by both `web-ui` (form validation) and `sync-backend` (API request validation).

## 🧪 Testing

Run unit tests for this package:
```bash
npx nx test validation
```
