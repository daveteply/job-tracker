---
name: validate-changes
description: Guidelines and instructions for validating code modifications by running lint, build, and test suites via Nx.
---

# Validate Changes with Nx

This skill provides guidelines and practices to ensure the workspace health is verified after any code modifications.

## 1. Core Principles

- **Validate after changes**: After any file edit, creation, or deletion, you must ensure the integrity of the workspace.
- **Run comprehensive checks**: Always run linting, building, and testing targets across all projects.
- **Address failures immediately**: If any workspace target fails, locate the failing project/file and resolve the error before continuing or declaring the task done.

---

## 2. Validation Command

Execute the following command in the workspace root:

```bash
npx nx run-many -t lint build test
```

### Targets Run:
1. **lint**: Asserts style guides, imports order, syntax safety, and rules (including `any` minimization).
2. **build**: Builds production artifacts for Next.js app (`web-ui`) and TypeScript backend (`sync-backend`) to check for compiler errors.
3. **test**: Runs unit and integration test suites using Vitest and Jest to verify logical correctness.

## 3. Automation Hook

> [!NOTE]
> The automated `PostToolUse` command hook is disabled to prevent executing commands outside the dev container environment. Changes must be validated manually from within the dev container.

