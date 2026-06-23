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

A `PostToolUse` hook is configured in the `.agents/hooks.json` file. It automatically triggers this validation command after tool execution of `replace_file_content`, `multi_replace_file_content`, or `write_to_file`.

If the validation fails:
1. The hook automatically attempts to run `npx nx run-many -t lint --fix` to auto-fix styling and lint issues.
2. If tests or builds still fail, the agent is expected to examine the failure logs, locate the source of the compiler or test error, modify the files to fix the error, and verify again.

