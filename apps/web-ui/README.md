# 🌐 Web UI

The modern, responsive frontend application for Vireo, designed for an offline-first, local-first user experience.

## 🏗️ Architecture

The `web-ui` is built on the principle of **Local-First software**. It uses a client-side database to ensure the application remains functional even without an internet connection.

### Key Components

- **Next.js:** High-performance React framework with App Router and Server Components.
- **RxDB:** A reactive, client-side NoSQL database that persists data locally and synchronizes with the backend.
- **RxJS:** Used for handling reactive data streams and ensuring the UI stays in sync with the local database.
- **Tailwind CSS & daisyUI:** Utility-first styling and a rich component library for a modern, consistent look.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16.2](https://nextjs.org/) (React 19)
- **Database:** [RxDB](https://rxdb.pub/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [daisyUI](https://daisyui.com/)
- **State Management:** Reactive streams with RxJS

## 🏃 Getting Started

### Local Development

1. Ensure the backend is running (optional but recommended for sync):

   ```bash
   npm run start:backend
   ```

2. Start the web development server:
   ```bash
   npx nx run web-ui:dev
   ```

## 🔗 Workspace Commands

You can manage the frontend from the root directory:

- `npm run start`: Starts both the frontend and backend.
- `npx nx test web-ui`: Runs unit tests.
- `npx nx e2e web-ui-e2e`: Runs end-to-end tests using Playwright.
- `npx nx run web-ui:typecheck`: Runs TypeScript type checking.
