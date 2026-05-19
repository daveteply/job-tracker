# 📦 data-access

The data persistence and synchronization layer for Vireo.

## 🏗️ Purpose

The `data-access` package centralizes all database-related operations and synchronization logic. It manages the lifecycle of the local [RxDB](https://rxdb.pub/) database and orchestrates the complex synchronization protocol with the `sync-backend`.

## 🛠️ Tech Stack

- **Framework:** TypeScript
- **Database:** [RxDB](https://rxdb.pub/) for local-first storage.
- **Sync:** Custom synchronization orchestration.
- **Library Integration:** Utilizes `domain` for schema definitions.

## 🧪 Testing

Run unit tests for this package:

```bash
npx nx test data-access
```
