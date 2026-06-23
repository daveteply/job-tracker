---
name: minimize-any
description: Guideline and instructions for reducing and avoiding the use of 'any' in TypeScript codebase, and properly annotating acceptable usages with eslint-disable comments.
---

# Minimize 'any' in TypeScript Code

This skill provides guidelines and practices to avoid and reduce the use of the `any` type in TypeScript files across the project workspace, ensuring strict type safety and cleaner lints.

## 1. Core Principles

- **Avoid `any` wherever possible**: The `any` type disables type checking, bypassing compilation safety. Always prefer explicit types, interfaces, generics, or `unknown`.
- **Prefer `unknown`**: If a value's type is truly dynamic or not known in advance (e.g., input validation, dynamic API payloads), use `unknown`. Require the consumer to use type narrowing or type guards.
- **Document acceptable `any` usage**: When `any` is necessary (e.g., due to third-party library constraints or complex external typings), bypass the linter using `eslint-disable-next-line` and document the exact reason after a double dash (`--`).

---

## 2. Refactoring Patterns (Bad vs. Good)

### A. Dynamic API payload / Input data
Avoid typing incoming dynamic data as `any`. Use `unknown` and type guards.

#### Bad
```typescript
function processEvent(event: any) {
  console.log(event.id); // No type safety!
}
```

#### Good
```typescript
interface EventPayload {
  id: string;
  name: string;
}

function isEventPayload(obj: unknown): obj is EventPayload {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    typeof (obj as any).id === 'string'
  );
}

function processEvent(event: unknown) {
  if (isEventPayload(event)) {
    console.log(event.id); // Fully type-safe
  } else {
    throw new Error('Invalid event structure');
  }
}
```

### B. Dynamic Key-Value Records
Instead of using `Record<string, any>` or `{ [key: string]: any }`, use `Record<string, unknown>`.

#### Bad
```typescript
const data: Record<string, any> = {
  name: 'Job Tracker',
  active: true,
};
```

#### Good
```typescript
const data: Record<string, unknown> = {
  name: 'Job Tracker',
  active: true,
};
```

---

## 3. Acceptable Usage and Annotation Rules

There are rare cases where `any` is unavoidable. Examples include:
1. Compatibility with third-party libraries (e.g., Next-intl translation arguments, Zod resolver type mismatches, or RxDB legacy migrations).
2. Interacting with raw legacy JS modules that lack TypeScript declarations.

When such a case is identified:
- You **MUST** annotate the line of code using:
  ```typescript
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- <Clear explanation of why any is required>
  ```
- The explanation must be descriptive and follow the `--` separator.

### Examples from the codebase:

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- next-intl's Translator expects Record<string, any> for values.
const applySchema = (t: (key: string, values?: Record<string, any>) => string) => { ... }
```

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Migration docs represent historical data and can have any shape.
const migrationHandler = (oldDoc: any) => { ... }
```

---

## 4. Lint Verification

Before completing tasks, ensure you run code validation using ESLint to verify that no unauthorized `any` warnings or errors are introduced.
```bash
npx nx run-many -t lint
```
