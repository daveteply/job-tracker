# 🌐 Web UI

The frontend application for JobTracker, providing a modern, responsive interface for managing job applications.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (React 19)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [daisyUI](https://daisyui.com/)
- **Database:** [RxDB](https://rxdb.pub/) for offline-first, local-first data management.
- **State Management:** Reactive state powered by RxJS and RxDB.

## 🏃 Getting Started

### Local Development

Run the development server:

```bash
npx nx dev web-ui
```

### Workspace Commands

You can also manage the frontend from the root directory:

- `npm run start`: Starts both the frontend and backend.
- `npx nx test web-ui`: Runs unit tests.
- `npx nx e2e web-ui-e2e`: Runs E2E tests.
