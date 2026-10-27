/**
 * CMS pages, blog posts, FAQs, banners and campaigns.
 *
 * Most fields are optional because the backend may leave any of them out
 * (and pages fall back to `{}` when a request fails).
 */
import type { DateString, ID } from "./common";
import type { Product } from "./product";

/** A CMS page or blog post (`pages/:slug`). */
export interface CmsPage {
	id?: ID;
	name?: string;
	title?: string;
	slug?: string;
	type?: "page" | "blog" | (string & {});
	image?: string;
	excerpt?: string;
	description?: string;
	meta_description?: string;
	path?: string;
	url?: string;
	priority?: number;
	updated_at?: DateString;
}

/** Question & answer item (FAQ, product Q&A, landing page FAQ). */
export interface QnaItem {
	id?: ID;
	question?: string;
	answer?: string;
}

/** Home page slider / category banner item. */
export interface Banner {
	id?: ID;
	image?: string;
	title?: string;
	/** Second title line (home slider) */
	title_2?: string;
	link?: string;
	link_type?: string;
	url?: string;
	text?: string;
}

/** Flash sale info shown on the flash sale page. */
export interface FlashSale {
	id?: ID;
	title?: string;
	banner_image?: string;
	expire_time?: DateString;
	flash_sale_note?: string;
}

/** Response of `product-flash-sale`. */
export interface FlashSaleResponse {
	flashSale?: FlashSale;
	data?: Product[];
	meta?: import("./common").PaginationMeta;
	status?: boolean;
}

/** Featured products campaign info. */
export interface FeaturedProductInfo {
	name?: string;
	image?: string;
}

/** Response of `featured-product`. */
export interface FeaturedProductResponse {
	featuredProduct?: FeaturedProductInfo;
	data?: Product[];
	meta?: import("./common").PaginationMeta;
}
