# 🚀 JobTracker: Modern Job Application Management

[![Nx](https://img.shields.io/badge/Nx-Workspace-blue?logo=nx)](https://nx.dev)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Quarkus](https://img.shields.io/badge/Quarkus-3.15-red?logo=quarkus)](https://quarkus.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**JobTracker** is a high-performance, offline-first monorepo application designed to streamline the job search process. Built with modern web technologies and a robust Java backend, it provides a seamless experience for tracking companies, contacts, roles, and interview events.

---

## 🏗️ Architecture & Tech Stack

This project is managed as an **Nx Monorepo**, ensuring high scalability, efficient builds, and shared logic across the entire ecosystem.

### 🌐 Frontend (Web UI)
- **Framework:** [Next.js 16](https://nextjs.org/) (React 19)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [daisyUI](https://daisyui.com/)
- **Data Persistence:** [RxDB](https://rxdb.pub/) for offline-first, real-time synchronization.
- **Form Management:** React Hook Form with Zod validation.

### ⚙️ Backend (Sync Service)
- **Framework:** [Quarkus](https://quarkus.io/) (Java 21)
- **Database:** PostgreSQL with Flyway for schema migrations.
- **ORM:** Hibernate with Panache for simplified data access.
- **API:** RESTful endpoints for real-time data synchronization with the frontend.

### 📦 Shared Packages
- **`domain`**: Core entities and RxDB schemas.
- **`data-access`**: Data persistence and synchronization logic.
- **`ui-components`**: Shared, accessible UI components.
- **`app-logic`**: Centralized business rules.
- **`validation`**: Unified Zod schemas for type-safe validation.
- **`hooks`**: Reusable React hooks for application state and logic.

---

## 🛠️ Getting Started

### 💻 Development Environment
This project is optimized for development on **Windows 11** using **WSL2** (Ubuntu) and **Docker Desktop**. It utilizes **Dev Containers** to ensure a consistent environment for all contributors.

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-repo/job-tracker.git
    cd job-tracker
    ```
2.  **Open in VS Code:**
    - When prompted, click **"Reopen in Container"** to launch the development environment.
    - Ensure Docker Desktop is running.
3.  **Install Dependencies:**
    ```bash
    npm install
    ```

### 🏃 Running the Application
Use Nx to run the development servers:

```bash
# Start the web frontend
npx nx dev web-ui

# Start the sync backend (requires Docker for PostgreSQL)
npx nx dev sync-backend
```

To view the dependency graph and explore the monorepo structure:
```bash
npx nx graph
```

---

## ✨ Points of Interest

- **Offline-First Synchronization:** Leverages RxDB to provide a snappy, local-first experience that syncs automatically when online.
- **Type Safety:** Comprehensive TypeScript and Zod integration from frontend to shared logic.
- **Cloud-Native Backend:** Quarkus provides lightning-fast startup times and low memory footprint, ideal for containerized environments.
- **Unified Design System:** Shared UI components using Tailwind and daisyUI for a consistent look and feel.

---

## 🛠️ Troubleshooting

### 🛑 Permission Issues in `sync-backend`
If you encounter a `FileSystemException: Operation not permitted` or similar permission error when building the `sync-backend` project, it is likely because the `target` directory was created by a container running as `root`.

**Fix:**
Run the following command in your terminal to reclaim ownership of the `target` directory:
```bash
sudo chown -R $(id -u):$(id -g) apps/sync-backend/target
```

Alternatively, you can delete the `target` directory and rebuild:
```bash
sudo rm -rf apps/sync-backend/target
npx nx build sync-backend
```

---

## 🤝 Contributing & Documentation

We welcome contributions! Please follow these guidelines:

1.  **Branching:** Create a feature branch from `main`.
2.  **Linting & Formatting:** Ensure your code passes `npm run lint` and is formatted with Prettier.
3.  **Testing:** Add tests for new features. Use `npx nx test <project>` to run specific tests.
4.  **Documentation:** Update the relevant package `README.md` if making structural changes.

For more detailed technical documentation, please refer to the individual `README.md` files within the `apps/` and `packages/` directories.

---

*Built with ❤️ using Nx, Next.js, and Quarkus.*
