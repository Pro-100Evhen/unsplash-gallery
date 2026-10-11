# Photo Gallery

A responsive, server-rendered photo gallery powered by the Unsplash API. The
project implements the required mini-Unsplash flow and two optional features:
a persistent local collection and a local demo registration form.

## Features

### Core

- Server-rendered discovery and search galleries with URL-driven pagination.
- Responsive masonry layout with comfortable and compact density modes.
- Debounced search with Zod validation and loading feedback.
- Photo details with author information, likes, tags, and Unsplash attribution.
- Tag galleries that reuse the main gallery and pagination behavior.
- Loading, empty, error, and not-found states.
- Responsive layouts for 375, 768, 1024, and 1440 px viewports.

### Bonus

- Save and remove photos from a personal collection stored in `localStorage`.
- Local demo registration built with React Hook Form, Zod, and MUI.
- Persisted demo profile with name and email plus a logout action.

The demo registration is not production authentication. It creates no server
account or session, and it does not protect any route. Passwords are validated
only in the form and are never dispatched to Redux or stored in
`localStorage`.

## Tech stack

- Next.js 16 App Router with React 19 and partial prerendering
- TypeScript in strict mode
- Material UI and SCSS Modules
- Redux Toolkit and React Redux
- React Hook Form and Zod
- Vitest, React Testing Library, and user-event

## Requirements

- Node.js 20 or newer
- npm
- An Unsplash developer access key

## Local setup

1. Install the locked dependency versions:

   ```bash
   npm ci
   ```

2. Copy `.env.example` to `.env.local` and add the Unsplash access key:

   ```dotenv
   UNSPLASH_ACCESS_KEY=your_access_key
   ```

   Only the Unsplash access key is used by the server-side client. Do not add
   the Unsplash secret key, and never commit `.env.local`.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

For a production-mode check:

```bash
npm run build
npm run start
```

## Commands

| Command                 | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Start the Next.js development server     |
| `npm run build`         | Create a production build                |
| `npm run start`         | Serve the production build               |
| `npm run lint`          | Run ESLint                               |
| `npm run typecheck`     | Run TypeScript without emitting files    |
| `npm run test -- --run` | Run the complete Vitest suite once       |
| `npm run test:watch`    | Run Vitest in watch mode                 |
| `npm run format`        | Format supported files with Prettier     |
| `npm run format:check`  | Verify formatting without changing files |

## Routes

| Route                  | Description                                       |
| ---------------------- | ------------------------------------------------- |
| `/`                    | Paginated discovery gallery; accepts `?page=2`    |
| `/search?query=forest` | Paginated server-rendered search results          |
| `/photos/[id]`         | Photo details, attribution, and tags              |
| `/tags/[tag]`          | Paginated gallery for a selected tag              |
| `/profile`             | Local profile identity and saved photo collection |
| `/register`            | Local demo registration form                      |

Invalid page parameters are redirected to their canonical value. Pagination
requests 20 photos at a time and is capped at the 500 pages supported by the
gallery contract.

## Architecture

- `app/` contains App Router routes, layouts, route-level feedback, and private
  application-shell components.
- `components/` contains feature-independent layout and feedback primitives.
- `domain/photo/` defines the photo contracts consumed by the UI.
- `features/` groups gallery, search, photo, tag, collection, and demo-auth UI
  with their state and validation logic.
- `lib/unsplash/` isolates the server-only HTTP client, transport types, error
  normalization, and transport-to-domain mapping.
- `store/` configures Redux and validates versioned browser persistence.
- Tests are colocated with their modules; shared typed fixtures live in
  `test/fixtures/`.

Unsplash requests execute in Server Components through a server-only client.
Discovery and search responses use Next.js `use cache` with the `hours` cache
profile. The access key is read from the server environment and is never
serialized into the client bundle.

Gallery density, saved photos, and the safe demo-user fields are stored under
the versioned `arounda-photo-gallery` local-storage key. Persisted data is
validated before hydration, and version 1 collection data is migrated to the
current version without dropping saved photos.

## Quality checks

Run the same checks used for the final acceptance pass:

```bash
npm run lint
npm run typecheck
npm run test -- --run
npm run format:check
npm run build
npm audit --omit=dev
```

## Hydration troubleshooting

React expects the server-rendered HTML to remain unchanged until hydration.
Browser extensions can modify the initial HTML and produce warnings even when
the application output is deterministic.

Common extension markers include:

- `bis_skin_checked`, `bis_register`, or `__processed_*` from browser security
  or proxy extensions;
- `data-lt-installed` from LanguageTool;
- stack traces beginning with `chrome-extension://`.

When these markers appear:

1. Disable the responsible extension for `localhost`.
2. Close existing localhost tabs and restart the development server.
3. Perform a hard reload.
4. Verify `/` and `/search?query=forest` in Incognito or a clean profile.

Do not add `suppressHydrationWarning`, disable SSR, or remove extension-added
attributes in application code. If a warning also occurs in a clean profile,
audit render code for non-deterministic values, browser globals,
locale-dependent formatting, and invalid HTML nesting.

## Unsplash attribution

Photo and photographer links include the attribution parameters required for
an Unsplash-powered application. Images are hotlinked from Unsplash rather
than downloaded or re-hosted.
