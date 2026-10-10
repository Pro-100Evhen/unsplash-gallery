This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Hydration troubleshooting

The application uses server-side rendering, so React expects the HTML received
from the server to remain unchanged until hydration finishes. Some browser
extensions modify that HTML before React starts and can trigger a hydration
warning even when the application output is deterministic.

Common signs of extension interference include attributes such as:

- `bis_skin_checked`, `bis_register`, or `__processed_*` from Urban VPN Proxy
  (`eppiocemhmnlbhjplcgkofciiegomcon`);
- `data-lt-installed` (LanguageTool);
- stack traces that start with `chrome-extension://` instead of an application
  file.

If a hydration warning contains these markers:

1. Open `chrome://extensions/?id=eppiocemhmnlbhjplcgkofciiegomcon`
   and disable or remove Urban VPN Proxy. Its content scripts run at
   `document_start` on every HTTP and HTTPS page, including `localhost`.
2. Disable LanguageTool for `localhost` if `data-lt-installed` is also present.
3. Close every open `localhost` tab so the affected browser session disconnects.
4. Restart `npm run dev`, open the page again, and perform a hard reload.
5. If needed, verify in an Incognito window with extensions disabled or in a
   clean browser profile.
6. Reproduce the issue on both `/` and a search URL such as
   `/?query=forest` before treating it as an application defect.

Do not add `suppressHydrationWarning`, disable SSR, or remove extension-added
attributes from application code to work around this case. Those approaches
can hide real server/client rendering differences without preventing the
extension from changing the DOM.

When the warning also occurs in a clean browser profile, audit render code for
values that can differ between server and client, including `Date.now()`,
`Math.random()`, locale-dependent formatting, browser globals, and invalid HTML
nesting. Browser APIs should be used only in effects or event handlers.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
