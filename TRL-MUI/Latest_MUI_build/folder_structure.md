# React Project Folder Structure Convention

This document defines the default folder structure and naming conventions for React projects. Claude should follow these conventions when scaffolding new projects, adding features, or generating files — unless the project's existing structure clearly diverges or the user explicitly overrides them.

---

## Core Principle

Organize by **feature domain**, not by file type. A new developer should be able to find everything related to "user management" by looking in one place — not by hunting across separate `components/`, `hooks/`, and `utils/` directories.

---

## Top-Level Structure

```
/
├── index.html
├── package.json
├── tsconfig.json           (if TypeScript)
├── vite.config.ts          (or equivalent bundler config)
├── .env
├── .gitignore
└── src/
```

All application code lives in `src/`. Config files stay at the root. Do not create `app/`, `lib/`, or `core/` directories at the project root.

---

## src/ Layout

```
src/
├── index.tsx               # Entry point — mounts React, nothing else
├── App.tsx                 # Root component — providers, router, global wrappers

├── routes/                 # Route definitions only — no UI or logic
├── layout/                 # Structural shell components (header, sidebar, footer)
├── themes/                 # Design tokens and theme config (if using a UI library)
├── menu-items/             # Navigation config (data only — no JSX)

├── pages/                  # Feature pages — one directory per domain
├── components/             # Reusable, feature-agnostic UI components
├── contexts/               # React Context — one file per concern
├── services/               # API layer (recommended — see Services section)
├── hooks/                  # Custom hooks shared across features
├── utils/                  # Pure utility functions
├── styles/                 # Global styles and CSS tokens
└── assets/                 # Images, fonts, static files
```

---

## Pages — Feature Domain Structure

Each feature domain gets its own directory under `pages/`. CRUD operations get named subdirectories. The domain `index.tsx` acts as a router or role-switcher — it does not contain UI.

```
pages/
├── authentication/
│   ├── login/
│   ├── forgot-password/
│   └── registration/
├── user-management/
│   ├── create-user/
│   ├── edit-user/
│   └── view-user/
├── dashboard/
│   ├── index.tsx           # Role-switcher: renders the right variant
│   ├── admin-dashboard/
│   └── viewer-dashboard/
└── {feature-name}/
    ├── create-{entity}/
    ├── edit-{entity}/
    ├── view-{entity}/
    └── {entity}-assignment/
        ├── mapping/
        └── mapped/
```

For features with role-based variants, create one subdirectory per role. The `index.tsx` at the domain root reads the user's role and renders the correct variant — nothing else.

Components used only within a single feature can live co-located inside that feature's directory. They do not need to be promoted to `components/`.

---

## Components

```
components/
├── common/                 # Generic building blocks used across 2+ unrelated features
│   ├── InputField.tsx
│   ├── AppDropdown.tsx
│   ├── GenericStepper.tsx
│   ├── constants/
│   ├── enums/
│   ├── icons/
│   └── schemas/            # Shared validation schemas (Yup, Zod, etc.)
├── cards/                  # Card-based display components
├── @extended/              # Wrapper components that extend UI library defaults
└── logo/
```

**Placement rule:**

| Component goes in... | When... |
|---|---|
| `components/common/` | Used in 2+ unrelated features |
| `components/@extended/` | Wraps a UI library component with project defaults |
| Inside `pages/{feature}/` | Used only by that one feature |

Do not create `components/features/` or `components/pages/`. Feature-specific components live with their page.

---

## Contexts — One File Per Concern

Each context file handles exactly one concern. Do not merge unrelated state.

```
contexts/
├── AuthContext.tsx              # Authentication state
├── LoaderContext.tsx            # Global loading state
├── AlertContext.tsx             # Global alerts/toasts
├── {Feature}Context.tsx         # Feature-scoped state
└── {FormName}FormContext.tsx    # Form-scoped state (multi-step forms)
```

Every context file must:
1. Define a typed context with `React.createContext`
2. Export a `{Feature}Provider` component
3. Export a `use{Feature}` custom hook that throws if called outside the provider

Form contexts (`{FormName}FormContext.tsx`) exist to share Formik/form state across deeply nested steps. They live in `contexts/` even if only one page consumes them.

---

## Services (Recommended Pattern)

Keeping API calls out of components prevents tight coupling and makes logic testable. This is the recommended approach — deviate only if the project is very small or uses a framework that handles this differently (e.g., Next.js Server Actions).

```
services/
├── axiosInstance.ts        # HTTP client config and interceptors
├── authService.ts
├── userManagementService.ts
└── {domain}Service.ts
```

Each service file: exports named async functions, returns data (not the raw Axios response), and contains zero UI logic (no toasts, no navigation).

---

## Hooks, Utils, Styles

```
hooks/
└── use{FeatureName}.ts     # Custom hooks shared across features
                            # Feature-specific hooks live with their page

utils/
└── {descriptiveName}.ts    # Pure functions — no React, no side effects
                            # Examples: csvUtils.ts, encryption.ts, dateUtils.ts

styles/
├── globals.ts              # Global CSS / reset
└── components/             # Styled-component tokens by category
    ├── buttons.ts
    ├── cards.ts
    └── containers.ts
```

---

## Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| Component files | PascalCase | `UserTable.tsx`, `EditUserForm.tsx` |
| Page / feature directories | kebab-case | `user-management/`, `create-user/` |
| Utility files | camelCase | `csvUtils.ts`, `dateUtils.ts` |
| Service files | camelCase + `Service` suffix | `authService.ts`, `userManagementService.ts` |
| Context files | PascalCase + `Context` suffix | `LoaderContext.tsx`, `TagsContext.tsx` |
| Custom hooks | camelCase + `use` prefix | `useFeatureAccess.ts`, `useFormDirty.ts` |
| Styled components | PascalCase + `Styled` suffix | `AppBarStyled.tsx`, `DrawerStyled.ts` |
| Route files | PascalCase | `MainRoutes.tsx`, `ProtectedRoute.tsx` |

---

## What Not to Do

- Do not organize by file type at the top level (`/components`, `/hooks`, `/utils` as the primary structure). Organize by feature first.
- Do not create a `store/` directory — use React Context unless Redux is explicitly required.
- Do not put a `hooks/` directory inside `src/` as a catch-all — shared hooks go in `hooks/`, feature hooks stay co-located.
- Do not use default exports for services or utilities — use named exports.
- Do not use PascalCase for feature/page directories — always kebab-case.
- Do not add new top-level `src/` directories without a clear, documented reason.

---

## When to Deviate

These are defaults, not laws. Deviate when:
- The project uses a framework with its own conventions (Next.js `app/`, Remix `routes/`, etc.)
- The codebase already has an established structure — match it, don't fight it
- The feature is too small to warrant full domain separation

When deviating, do so explicitly and document why.

---

*Inspired by the tl_synapse_fe codebase. Updated: 2026-04-28.*
