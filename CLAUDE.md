# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Akaar e-commerce storefront (basic template): a Next.js 16 App Router frontend (React 19) for a Bangladesh-focused online shop. All business data (products, orders, users, settings, translations) comes from an external backend API ("AMS") at `API_BASE_URL`; this repo contains no database. TypeScript (`.ts`/`.tsx`), Tailwind CSS 3, Redux Toolkit 2 + RTK Query, next-intl 4. Node.js >= 20.9 is required.

## Commands

Package manager is **pnpm** (pinned via `packageManager`).

- `pnpm dev` — dev server on **port 3001** (not 3000, despite the README)
- `pnpm build` / `pnpm start` — production build / serve
- `pnpm lint` — ESLint 9 flat config (`eslint.config.mjs`, extends `eslint-config-next/core-web-vitals`). `next lint` no longer exists in Next 16, and `next build` does not lint.
- `pnpm typecheck` — `tsc --noEmit` (`next build` also type-checks)
- `pnpm server` — json-server mock on port 3004 from `public/static/db.json`

There is no test suite.

## Environment

Copy `.env.example` to `.env.local`. Key variables:

- `API_BASE_URL`: backend base URL (e.g. `https://.../api/v5`). `next.config.ts` exposes it to client code as `process.env.server`.
- `AMS_PUBLIC_KEY`: sent as the `AmsPublickey` header on every API call; exposed to the client as `process.env.amsPublickey`.
- `AMS_PRIVATE_KEY`: server-only. Used by `postData({ isPrivate: true })` and to authorize `/api/revalidate-cache`. Never expose it to client code.
- `NEXT_PUBLIC_BASE_URL`: used for `metadataBase`, sitemap and payment callbacks.
- `STORE_ID` / `STORE_PASS` / `IS_LIVE`: SSLCommerz. `BKASH_*`: bKash tokenized checkout.
- `NEXT_PUBLIC_IS_SQUARE_IMAGE`, `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`, `NEXT_PUBLIC_GTM_ID`.
- Also read in code but missing from `.env.example`: `NEXT_PUBLIC_GTM_ENABLED` (`YES` turns GTM on) and `NEXT_PUBLIC_SELFEB_SCRIPT_URL`.

Path alias: `@/*` maps to the repo root (`tsconfig.json`).

## Architecture

### Routing and i18n
- Every page lives under `app/[locale]/`. Locales are `en` (default) and `bn`, defined in `routing.ts` (`defineRouting`), with `localePrefix: "as-needed"`, so English URLs have no prefix. `navigation.ts` builds the locale-aware helpers with `createNavigation(routing)`; `i18n.ts` is the next-intl request config. `messages/ar.json` exists but `ar` is not an enabled locale.
- `proxy.ts` (next-intl middleware; Next 16 renamed `middleware` to `proxy`) handles locale routing and skips `/api`, `/_next` and files with extensions.
- For locale-aware navigation, import `Link`, `useRouter`, `usePathname` and `redirect` from `@/navigation`, not from `next/link` / `next/navigation`.
- Most UI strings come from the backend `translations` endpoint (loaded into Redux by `ClientLoader`), not from `messages/*.json`, which are nearly empty.
- Route groups:
  - `(main)`: the full storefront with header and footer. Its layout also mounts global drawers and modals (Cart, ProductSelect, SizeChangeModal, VideoPlayerModal) plus PersistUser and GlobalLoader.
  - `(landing)/landing/[slug]`: standalone product landing pages with their own checkout (`TemplateCheckout.tsx`).
- Page-specific components live in a colocated `_components/` folder. Shared ones live in `components/` (cards, elements, filters, modals, navigation, side-drawers, utility). Note the folder is spelled `components/hoks/`, not "hooks"; it holds `RequireAuth`.

### Next.js 16 rules
- `params` and `searchParams` are Promises: `await params` in Server Components, `use(params)` in Client Components. `headers()` / `cookies()` must be awaited.
- `dynamic(..., { ssr: false })` is only allowed inside Client Components (see `_components/PopupClient.tsx`).
- `revalidateTag` needs a second argument (`/api/revalidate-cache` uses `{ expire: 0 }`).
- Turbopack is the default bundler for `dev` and `build`.

### Data fetching (three paths)
1. **Server components**: `fetchData({ api, locale?, revalidate? })` in `lib/fetch-data.ts`. It is a native `fetch` call with ISR (`revalidate` defaults to 1200s), a 15s timeout, and a `lang` header. On failure it **returns `null` instead of throwing**, so callers must null-check (`res?.data`). Backend responses have the shape `{ data, ... }`.
2. **Server mutations**: `postData(config, data)` in `lib/post-data.ts`. On error it returns `{ ...body, status: false }`.
3. **Client components**: RTK Query. `store/api/apiSlice.ts` defines the base query (adds the `AmsPublicKey` header and a Bearer token from `localStorage.token`) and declares every `tagTypes` value. Each domain file in `store/api/*API.ts` calls `apiSlice.injectEndpoints`. When you add a new cache tag, add it to `tagTypes` too. `lib/axios-instance.ts` is an older axios client that is still used in places.

Site-wide settings come from `info/basic`. Layouts and `ServerDataProvider` fetch them on the server, and `ClientLoader` pushes them into Redux (`commonSlice`). `ServerDataProvider` also injects Facebook Pixel, GTM, AdSense and custom header/footer scripts that are configured from the backend.

### State
`store/index.ts` combines the `cart`, `auth` and `common` slices with the RTK Query reducer. The cart is persisted to `localStorage.cart_items` through a `store.subscribe` call. The auth token is stored in `localStorage.token` (`utils/token.ts`). That module touches `localStorage`, so only use it on the client.

### Checkout and payments
- The checkout flow is in `app/[locale]/(main)/checkout/page.tsx`, with helpers in `lib/checkout.ts`, `lib/order-pay.ts`, `hooks/useOrderPlace.ts` and `hooks/useCart.ts`.
- Payment gateways are implemented as route handlers:
  - `app/api/payments/sslcz/`: SSLCommerz, with `success`, `fail` and `ipn` callbacks.
  - `app/api/payments/bkash/`: bKash tokenized checkout, with token grant and persistence in `helpers/`.
- Purchase tracking for Facebook Pixel and GTM lives in `lib/fpixel.ts`, `lib/gtm-data-formatter.ts` and `hooks/usePurchaseTracking.ts`.

### Cache revalidation
The backend calls `GET /api/revalidate-cache?path=&type=&tag=` with an `AmsPrivateKey` header to bust ISR caches. With no parameters it revalidates the whole site.

### Styling
- Tailwind with custom breakpoints: `sm` 576, `md` 768, `lg` 992, `xl` 1280.
- Brand colors are `primary` and `secondary`. Fonts are `font-body` (Noto Sans Bengali), `font-title` and `font-poppins`.
- Custom plugin at `config/tailwind-custom-plugin.ts`. Global styles live in `app/[locale]/globals.css`.
- Currency and phone validation for Bangladesh (৳ / BDT, `01[3-9]XXXXXXXX`) are configured in `config/site.tsx`.
- `images.unoptimized: true` is set in `next.config.ts`.

## TypeScript

- All shared types live in the root `types/` folder, one file per domain model (`product.ts`, `cart.ts`, `order.ts`, `checkout.ts`, `settings.ts`, `routes.ts`, ...), re-exported from `types/index.ts`. Import with `import type { Product } from "@/types"`. Reuse and extend existing types (`CartItem extends Product`, `ApiResponse<T>`, `PaginatedResponse<T>`) instead of declaring new inline shapes.
- Backend model fields are mostly optional because the API may omit them. Add a JSDoc comment when a field's meaning is not obvious.
- `types/global.d.ts` types `window.fbq` / `window.dataLayer` and the env variables; `types/modules.d.ts` declares untyped packages (`drift-zoom`, `sslcommerz-lts`).
- Redux: use `useAppSelector` / `useAppDispatch` from `@/store/hooks` (never the untyped `useSelector`/`useDispatch`). `RootState` and `AppDispatch` come from `@/store`. RTK Query endpoints use `builder.query<Result, Arg>` / `builder.mutation<Result, Arg>`.
- Server fetches are generic: `fetchData<ApiResponse<SiteSettings>>({ api: "info/basic" })`. The result can still be `null`.
- Route files use `PageProps<{ slug: string }>`, `LayoutProps` and `MetadataProps` from `@/types` (params and searchParams are Promises).
- `tsconfig.json` uses `strict: false` with `noImplicitAny` on, as a migration step. Turning on `strictNullChecks` (then full `strict`) is the next step.
- `allowJs` is on: a few files are still JavaScript (`postcss.config.js`, `public/scripts/pixel.js`, and the order-details `_components`).
