---
name: optimize-heroicons
description: Guidelines and instructions for using direct imports for Heroicons in the frontend to maintain a small bundle size and ensure tree-shaking.
---

# Frontend Optimization: Heroicons Usage

To maintain a small bundle size and ensure effective tree-shaking, always use **direct file path imports** for Heroicons. Avoid top-level imports from the icon sets.

## 1. Import Style Rules

- **Do NOT** use top-level/named imports from the root of the icon sets.
- **DO** import directly from the specific icon file path.

### Examples:

#### Preferred (Direct path imports)
```tsx
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import TrashIcon from '@heroicons/react/16/solid/TrashIcon';
```

#### Avoid (Top-level / Named imports)
```tsx
import { PlusIcon } from '@heroicons/react/24/outline';
```

## 2. Next.js Configuration

The `apps/web-ui/next.config.js` is configured with `optimizePackageImports: ['@heroicons/react']` as a fallback, but direct imports remain the primary standard for the codebase to ensure consistency across both apps and packages.
