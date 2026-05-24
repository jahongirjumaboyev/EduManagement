# EduManagement — Claude Code Project Guide

## Project context
React 18 + TypeScript (strict) education management system for Bojxona Instituti.
Supports 16 user roles, each with its own protected route subtree.

## Stack
- Vite + React 18 + TypeScript (strict mode)
- Tailwind CSS v3 · Ant Design + @ant-design/icons
- Redux Toolkit + RTK Query · React Router DOM v6
- Axios · MSW v2 · Recharts · Day.js · Zod

## Non-negotiable rules
- All styling: Tailwind CSS classes only, never inline styles
- All pages fully responsive: mobile first, use sm md lg xl breakpoints
- All text strings in src/constants/uz.ts only
- No hardcoded colors — use Tailwind custom colors or bg-[#hex]
- Simple readable code always
- No any type in TypeScript
- One button click = exactly one API request. Nothing more.
- Buttons must be disabled while their request is pending to prevent double clicks and duplicate requests
- Never send API requests automatically on component mount unless the page absolutely needs data to render
- All RTK Query endpoints must use caching — never set refetchOnMountOrArgChange: true unless strictly required
- No background polling unless the feature specifically needs it
- Never fire multiple requests at the same time for one user action

---

## Custom agents

### /clean
Scans all `.ts` and `.tsx` files in `src/`, lists every unused import and dead code block,
presents the list for user confirmation, then removes only confirmed items.
**Never runs automatically.** Wait for explicit user invocation.

Steps:
1. Run ESLint with `--rule '{"@typescript-eslint/no-unused-vars": "error"}'` across `src/`.
2. Parse output to build a list of unused imports and dead variables.
3. Display the list grouped by file.
4. Ask the user: "Remove all of the above? (y/n or list numbers to skip)"
5. Apply removals only to confirmed items. Re-run lint to verify zero errors remain.

---

### /redesign
Before writing any code for a new feature, enter plan mode and output a step-by-step plan:
- Which files to create and which to edit.
- Logic / data flow explanation.
- Which RTK Query endpoints or MSW handlers are needed.

Always wait for explicit user approval before writing a single line of code.

---

### /component
Scaffolds a typed React component with Tailwind + Ant Design.

Usage: `/component <ComponentName> [props description]`

Steps:
1. Create `src/components/<ComponentName>/<ComponentName>.tsx` with:
   - Full TypeScript props interface (no `any`).
   - Tailwind classes for layout.
   - Ant Design components as appropriate.
   - UI strings imported from `@/constants/uz`.
2. Append a barrel export to `src/components/index.ts` (create file if absent):
   ```ts
   export { default as <ComponentName> } from './<ComponentName>/<ComponentName>';
   ```
3. Report the created file path.

---

### /page
Scaffolds a full page for a given role.

Usage: `/page <role> <PageName> [description]`

Steps:
1. Create `src/pages/<role>/<PageName>.tsx` with placeholder layout and UI strings from `uz.ts`.
2. Register the route in `src/router/index.tsx` under the matching `RoleGuard` subtree.
3. Confirm the route is wrapped in `RoleGuard` with the correct `allowedRoles`.
4. Report created file and the route path.

---

### /mock
Creates an MSW handler for a given API endpoint with realistic Uzbek-language sample data.

Usage: `/mock <METHOD> <path> [description]`

Steps:
1. Add a handler to `src/mocks/handlers.ts` using `http.<method>()` from MSW.
2. Return a realistic JSON fixture with Uzbek names/values appropriate to the endpoint.
3. Report the handler and the mock data shape.

Example fixture shape for a student list:
```ts
http.get('/api/students', () => {
  return HttpResponse.json([
    { id: '1', fullName: 'Alisher Navoiy', group: 'CS-101' },
  ]);
});
```
