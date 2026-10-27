/**
 * Categories and brands.
 *
 * Most fields are optional because the backend may leave any of them out
 * (and pages fall back to `{}` when a request fails).
 */
import type { ID, DateString } from "./common";

/** Product category. Sub and child categories use the same shape. */
export interface Category {
	id?: ID;
	category_name?: string;
	slug?: string;
	icon?: string;
	image?: string;
	banner?: string;
	description?: string;
	meta_title?: string;
	meta_description?: string;
	priority?: number;
	updated_at?: DateString;
	child_categories?: Category[];
	/** Set when this is a sub category */
	parent_id?: ID | null;
	parent_slug?: string;
	parent_name?: string;
}

/** Product brand. */
export interface Brand {
	id?: ID;
	brand_name?: string;
	brand_image?: string;
	title?: string;
	slug?: string;
}
