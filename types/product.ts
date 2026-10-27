/**
 * Products and their variants, photos and coupons.
 *
 * Most fields are optional because the backend may leave any of them out
 * (and pages fall back to `{}` when a request fails).
 */
import type { BinaryFlag, DateString, ID } from "./common";
import type { Brand, Category } from "./category";
import type { QnaItem } from "./content";

/**
 * One sellable variant of a product (a colour + size combination).
 * The backend calls it a "barcode".
 */
export interface ProductVariant {
	id: ID;
	barcode?: string;
	/** Empty string when the product has no colour options. */
	color: string;
	/** Empty string when the product has no size options. */
	size: string;
	selling_price: number;
	discount_selling_price: number;
	stock_qty: number;
}

/** Product image; `color_name` links the photo to a colour variant. */
export interface ProductPhoto {
	id?: ID;
	image?: string;
	color_name?: string;
	/** Optional video shown on this slide */
	video_link?: string;
	title?: string;
	title_2?: string;
}

/** Discount coupon attached to a product or applied at checkout. */
export interface Coupon {
	id?: ID;
	code?: string;
	/** "cart" coupons apply to the whole cart. */
	coupon_type?: "cart" | string;
	discount_type?: "percentage" | "flat";
	discount_amount?: number;
	max_discount?: number;
	minimum_order?: number;
}

/** Size chart image of a product. */
export interface SizeChart {
	image?: string;
}

/** A product shown in listings, cards and the product details page. */
export interface Product {
	id?: ID;
	slug?: string;
	product_name?: string;
	sku?: string;
	image?: string;
	hover_image?: string;
	photos?: ProductPhoto[];

	// ---- Price & stock ----
	new_price?: number;
	old_price?: number;
	discount_percentage?: number;
	stock_qty?: number;
	total_sale_qty?: number;
	is_free_delivery?: BinaryFlag;
	minimum_wholesale_quantity?: number;

	// ---- Variants ----
	barcodes?: ProductVariant[];

	// ---- Grouping ----
	brand?: Brand | null;
	category?: Category | null;
	sub_category?: Category | null;
	child_category?: Category | null;

	// ---- Ratings ----
	average_rating?: number;
	/** Spelling used by some backend endpoints. */
	averate_rating?: number;
	total_rating?: number;

	// ---- Content ----
	product_short_description?: string;
	details?: string;
	specification?: string;
	size_chart?: SizeChart | null;
	review_video?: string;
	coupons?: Coupon[];
	includedProducts?: Array<{ image: string }>;
	meta_title?: string;
	meta_description?: string;
	/** Custom JSON-LD script for SEO. */
	header_script?: string;

	priority?: number;
	created_at?: DateString;
	updated_at?: DateString;
}

/** Customer review photo shown on product landing pages. */
export interface LandingReview {
	image?: string;
}

/** Product returned by `products/landing-page-show/:slug` (landing pages). */
export interface LandingPageProduct extends Product {
	faqs?: QnaItem[];
	/** Review screenshots (backend field name) */
	product_review_sses?: LandingReview[];
}
