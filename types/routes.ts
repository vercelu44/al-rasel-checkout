import type * as React from "react";
/**
 * Props that Next.js passes to pages, layouts and route handlers.
 * Since Next.js 15, `params` and `searchParams` are Promises (use `await`
 * in Server Components and `use()` in Client Components).
 */

/** Value of a URL query parameter. */
export type SearchParamValue = string | string[] | undefined;
export type SearchParams = Record<string, SearchParamValue>;

/** Every route lives under `app/[locale]/`. */
export interface LocaleParams {
	locale: string;
}

/** Props of a page. `P` = the dynamic segments of that route. */
export interface PageProps<P extends object = LocaleParams> {
	params: Promise<P & LocaleParams>;
	searchParams: Promise<SearchParams>;
}

/** Props of a layout. */
export interface LayoutProps<P extends object = LocaleParams> {
	children: React.ReactNode;
	params: Promise<P & LocaleParams>;
}

/** Props passed to `generateMetadata`. */
export interface MetadataProps<P extends object = LocaleParams> {
	params: Promise<P & LocaleParams>;
	searchParams?: Promise<SearchParams>;
}

/** Second argument of a route handler, e.g. `GET(request, context)`. */
export interface RouteContext<P extends object> {
	params: Promise<P>;
}
