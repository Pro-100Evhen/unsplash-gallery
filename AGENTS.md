<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Photo Gallery project rules

## Project context

- This is a Next.js 16 App Router test assignment: an SSR Unsplash gallery with
  URL-driven pagination, search, photo details, tag galleries, responsive
  3/5-column layouts, local collections, and demo registration.
- Main stack: React 19, strict TypeScript, MUI, SCSS Modules, Redux Toolkit,
  React Hook Form, Zod, Vitest, and React Testing Library.
- Preserve the behavior and routes documented in `README.md`. Do not introduce
  unrelated features, dependencies, deployment changes, or broad refactors.
- The repository owner creates commits. Do not commit, amend, push, or rewrite
  Git history unless explicitly requested.

## Before changing code

1. Read the target file, its colocated tests, and the contracts it imports.
2. Find and follow an existing project pattern before creating an abstraction.
3. For Next.js APIs or conventions, read the relevant local documentation in
   `node_modules/next/dist/docs/`; do not rely on remembered older behavior.
4. Inspect `git status` and preserve unrelated owner changes.
5. For bugs and behavior changes, add or update a focused regression test
   before implementing the fix.

## Architecture boundaries

- `app/`: routes, layouts, route-level loading/error states, metadata, and
  private application-shell components in `app/_components/`.
- `components/`: reusable feature-independent layout and feedback primitives.
  Shared components must not import from `features/`.
- `domain/`: internal application contracts with no React, Next.js, Redux, or
  external transport dependencies.
- `features/`: feature UI, validation, local state, and feature-specific pure
  logic. Keep tests and SCSS Modules next to their source files.
- `lib/unsplash/`: Unsplash transport schemas, mappers, attribution utilities,
  normalized errors, and the server-only HTTP client.
- `store/`: Redux composition, typed hooks, versioned persistence, and
  hydration. Feature reducers remain inside their features.
- `test/fixtures/`: shared typed fixtures only when multiple suites need them.
- Use direct imports. Do not add barrel `index.ts` files, a `src/` migration,
  generic `utils/` or `services/` dumping grounds, or full Feature-Sliced
  Design without an explicit architectural task.

## React and Next.js conventions

- Prefer Server Components. Add `"use client"` only at the smallest boundary
  that needs hooks, browser APIs, Redux, or event handlers.
- Keep gallery data fetching server-side. Never expose the Unsplash access key
  through props, client components, routes, or `NEXT_PUBLIC_*` variables.
- Preserve SSR/PPR and `cacheComponents`. Do not use `ssr: false`, global
  `suppressHydrationWarning`, or client-only rendering to hide hydration bugs.
- Keep render output deterministic. Browser APIs, time, and mutable browser
  state belong in effects or event handlers.
- Search query and page are URL state. Preserve canonical redirects and the
  page cap in `features/gallery/pagination.ts`.
- Every `"use cache"` scope must declare an explicit `cacheLife` profile.
- Use `next/image` for gallery photos and `next/link` for internal navigation.
  Supply accurate `sizes`, alt text, and conservative eager loading.
- Avoid passing data to Client Components that they do not render or use.

## UI and styling

- Use MUI as the primary component library. Reuse the theme in `app/theme.ts`
  and existing MUI primitives before building custom controls.
- Use SCSS Modules for component layout and visual styling. Reuse values from
  `styles/_tokens.scss` and mixins from `styles/_mixins.scss`.
- Inline MUI `sx` is acceptable for small theme-aware adjustments; move
  substantial or repeated styles into the colocated SCSS Module or theme.
- Maintain the Unsplash-inspired visual language and responsive behavior at
  375, 768, 1024, and 1440 px. Do not introduce horizontal overflow.
- Use semantic HTML, visible keyboard focus, accessible names, sufficient
  contrast, reduced-motion handling, and correctly associated error text.
- Loading, empty, error, and skeleton states should reuse
  `components/feedback/` rather than duplicate route-specific markup.

## Forms and validation

- Build forms with React Hook Form and Zod. Keep schemas in a colocated
  `*Schema.ts` file and infer form value types from the schema.
- Use `Controller` for controlled MUI inputs and keep stable `defaultValues`.
- Use `noValidate` when Zod owns validation. Display field-specific errors,
  focus the first invalid field, and connect messages with `aria-describedby`
  and `aria-invalid` where MUI does not do this automatically.
- Trim and constrain text at the schema boundary. URL parameters must be
  validated independently on the server; client validation is not a security
  boundary.
- Demo registration is intentionally local-only. Never dispatch, persist,
  log, or serialize passwords or password confirmation. Persist only the
  allowlisted demo-user fields already defined by the auth state.
- Preserve search debounce, throttle, manual submit, clear behavior, URL sync,
  and loading feedback. Timing policy belongs in `searchNavigation.ts`.

## Data, API, and security

- Only `UNSPLASH_ACCESS_KEY` is required. Keep real `.env*` files ignored and
  never add an Unsplash secret key to the project.
- Keep the Unsplash HTTP client marked `server-only`. Construct paths with
  `encodeURIComponent` and queries with `URLSearchParams`.
- Treat API responses as untrusted: validate them with the Zod transport
  schemas before mapping them into `domain/photo` types.
- Keep request timeouts, typed error normalization, and route error boundaries.
  Do not expose raw upstream errors or credentials to the UI.
- Preserve Unsplash attribution parameters and the HTTPS/hostname allowlist in
  `lib/unsplash/attribution.ts`.
- Keep security headers in `next.config.ts`. CSP changes must be verified in a
  real browser so Next.js, MUI, fonts, and Unsplash images remain functional.
- Treat `localStorage` as untrusted and fallible. Validate persisted data,
  version migrations, minimize stored fields, debounce writes, and flush the
  latest pending state during cleanup.
- Do not add `dangerouslySetInnerHTML`, `eval`, broad remote-image hosts, or
  hydration suppression as shortcuts.

## TypeScript and code style

- Keep strict typing. Avoid `any`, unsafe assertions, `@ts-ignore`, and broad
  eslint disables. Narrow `unknown` at trust boundaries.
- Prefer small named functions, early returns, immutable inputs, and explicit
  domain names. Do not introduce abstractions without repeated concrete use.
- Use named exports for project modules; retain default exports only where
  Next.js conventions or existing configuration require them.
- Code, identifiers, comments, tests, and user-facing application copy are in
  English.
- Follow Prettier: LF, double quotes, semicolons, 2 spaces, 80 columns, and
  trailing commas. Let Prettier format changed files.

## Testing and verification

- Colocate tests as `*.test.ts` or `*.test.tsx`. Test user-visible behavior and
  outputs rather than implementation details.
- Use React Testing Library queries by role, label, or visible text. Use typed
  fixtures and mock only external or framework boundaries.
- Every bug fix needs a regression test. Cover valid, invalid, empty, error,
  navigation, persistence, and accessibility paths affected by the change.
- During development, run focused Vitest files. Before handoff, run:

  ```bash
  npm run lint
  npm run typecheck
  npm run test -- --run
  npm run format:check
  npm run build
  npm audit --omit=dev
  git diff --check
  ```

- For browser-facing or Next.js runtime changes, also verify the relevant route
  in a clean browser: no console/hydration/runtime errors, no failed requests,
  and no accessibility violations introduced by the change.
- Do not weaken checks, delete meaningful tests, or add suppressions merely to
  make the suite pass. Report environment-caused failures separately.

## Handoff

- Do not proceed to a different planned stage unless the user asks for it.
- Summarize changed files, behavior, and checks actually run. Clearly separate
  completed code work from external steps such as key rotation, GitHub remote
  setup, and deployment.
