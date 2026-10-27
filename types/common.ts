/**
 * Shared building blocks used by all other types.
 */

/** Database id sent by the backend (AMS). */
export type ID = number;

/** The backend sends many on/off settings as 1 (on) or 0 (off). */
export type BinaryFlag = 0 | 1;

/** Supported site languages (see `routing.ts`). */
export type Locale = "en" | "bn";

/** UI text from the backend `translations` endpoint: key → translated text. */
export type Translations = Record<string, string>;

/** Date/time string from the backend, e.g. "2026-01-31 10:15:00". */
export type DateString = string;

/** One link in the backend's pagination `links` list. */
export interface PaginationLink {
	url: string | null;
	label: string;
	active: boolean;
}

/** Pagination info the backend sends with list responses. */
export interface PaginationMeta {
	current_page: number;
	last_page: number;
	per_page?: number;
	total: number;
	from?: number | null;
	to?: number | null;
	path?: string;
	links?: PaginationLink[];
}

/** Standard backend response: the payload is always inside `data`. */
export interface ApiResponse<T> {
	data: T;
	message?: string;
	status?: boolean | number;
}

/** Backend list response with pagination. */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
	meta: PaginationMeta;
}

/** Error shape returned by RTK Query `unwrap()` and failed API calls. */
export interface ApiError {
	status?: number | string;
	data?: {
		message?: string;
		errors?: Record<string, string[]>;
	};
	message?: string;
}

/** `{ locale }` argument accepted by most RTK Query endpoints (sent as `lang` header). */
export interface LocaleArg {
	locale?: string;
}
