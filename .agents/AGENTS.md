# Project Rules

## TypeScript Code Quality

- **Minimize `any` Usage**: Avoid using the `any` type. Prefer explicit types, interfaces, or generics. If a type is unknown, use `unknown`.
- **Linter Bypass Annotations**: When `any` is acceptable (e.g., due to third-party library constraints or compatibility), annotate the usage with `// eslint-disable-next-line @typescript-eslint/no-explicit-any -- <reason>` and include a descriptive explanation after the double-dash.

## Frontend Optimization

- **Heroicons Usage**: To maintain small bundle size and ensure effective tree-shaking, always use **direct file path imports** for Heroicons (e.g., `import PlusIcon from '@heroicons/react/24/outline/PlusIcon'`). Avoid top-level imports from the root icon sets (e.g. `import { PlusIcon } from '@heroicons/react/24/outline'`).

