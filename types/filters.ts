import type { Brand, Category } from "./category";

/** A colour option in the filter sidebar. */
export interface FilterColor {
	name: string;
	/** CSS colour, e.g. "#ff0000" */
	code?: string;
}

/** A size option in the filter sidebar. */
export interface FilterSize {
	name: string;
}

/** Options for the product filter sidebar (`search-summary`). */
export interface FilterOptions {
	brands?: Brand[];
	colors?: FilterColor[];
	sizes?: FilterSize[];
	categories?: Category[];
	min_price?: number;
	max_price?: number;
}

/**
 * Query values used to load products.
 * Comes from the page URL (`searchParams`) plus page-specific values.
 */
export interface ProductSearchParams {
	text?: string;
	reference_id?: string | number;
	brand_ids?: string | string[];
	sort_type?: string;
	category_id?: string | number;
	category_ids?: string | string[];
	per_page?: string | number;
	page?: string | number;
	colors?: string | string[];
	sizes?: string | string[];
	min_price?: string | number;
	max_price?: string | number;
	/** Grid column count chosen by the user. */
	col?: string | number;
	[key: string]: string | number | string[] | undefined;
}

/** A saved or popular search keyword. */
export interface SearchKeyword {
	id: number;
	search_name: string;
}

/** Product suggestion shown while typing in the search box. */
export interface SearchSuggestion {
	text: string;
	image?: string;
	slug?: string;
}
