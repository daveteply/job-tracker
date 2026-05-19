# 📦 domain

The core library containing Vireo's domain entities, TypeScript types, and RxDB schemas.

## 🏗️ Purpose

The `domain` package serves as the single source of truth for the entire application's data model. It is shared across both the frontend (`web-ui`) and the backend (`sync-backend`) to ensure absolute type safety and structural consistency.

## 🛠️ Tech Stack

- **Language:** TypeScript
- **Schema Definition:** [RxDB](https://rxdb.pub/) for local-first data definitions.
- **Validation:** Integrated with Zod for runtime type checking.

## 🧪 Testing

Run unit tests for this package:
```bash
npx nx test domain
```
