# Photo Gallery

An SSR photo gallery built with the Unsplash API. The application provides a
responsive masonry feed, comfortable and compact layouts, debounced search,
URL-driven pagination, image loading states, and accessible feedback UI.

## Tech stack

- Next.js 16 App Router and React 19
- TypeScript in strict mode
- Material UI and SCSS Modules
- React Hook Form and Zod
- Vitest and React Testing Library

## Local setup

Install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env.local` and provide an Unsplash access key:

```dotenv
UNSPLASH_ACCESS_KEY=your_access_key
```

Only the public Unsplash access key is required by the server-side client. Do
not expose or commit the Unsplash secret key.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` — paginated discovery feed; accepts `?page=2`.
- `/search?query=forest` — server-rendered search results.
- `/search?query=forest&page=2` — a specific search results page.

Invalid page values are canonicalized, and pages beyond the available result
set redirect to the last valid page. The application exposes at most 500 pages
and requests 20 photos per page.

## Architecture

- `app/` owns routes, layouts, route loading/error boundaries, and private
  application-shell components.
- `components/` contains feature-independent layout and feedback primitives.
- `domain/photo/` defines internal photo contracts used by the UI and API
  boundary.
- `features/gallery/` and `features/search/` contain feature UI and behavior.
- `lib/unsplash/` contains the server-only Unsplash transport, response types,
  error normalization, and transport-to-domain mappers.
- Tests are colocated with their modules; reusable typed fixtures live in
  `test/fixtures/`.

Unsplash requests run on the server and use Next.js `use cache` with the
`hours` cache profile. The access key is never serialized to the browser.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test -- --run
npm run format:check
npm run build
```

## Hydration troubleshooting

React expects the server-rendered HTML to remain unchanged until hydration.
Browser extensions can modify that HTML before React starts and produce a
warning even when the application output is deterministic.

Common extension markers include:

- `bis_skin_checked`, `bis_register`, or `__processed_*` from Urban VPN Proxy;
- `data-lt-installed` from LanguageTool;
- stack traces beginning with `chrome-extension://`.

When these markers appear:

1. Disable the responsible extension for `localhost`.
2. Close existing localhost tabs and restart the development server.
3. Perform a hard reload.
4. Verify `/` and `/search?query=forest` in Incognito or a clean Chrome profile.

Do not add `suppressHydrationWarning`, disable SSR, or remove extension-added
attributes from application code. If the warning also occurs in a clean
profile, audit render code for non-deterministic values, browser globals,
locale-dependent formatting, and invalid HTML nesting.

## Unsplash attribution

Photo and photographer links include the attribution parameters required for
an Unsplash-powered application. Image URLs are hotlinked from Unsplash rather
than downloaded or re-hosted.
