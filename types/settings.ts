import type { BinaryFlag } from "./common";

/** Brand colours configured in the admin panel. */
export interface ThemeColors {
	primary?: string;
	primary_text?: string;
	secondary?: string;
	secondary_text?: string;
	tertiary?: string;
	tertiary_text?: string;
	default_text?: string;
}

/** A menu link to a CMS page (header, footer and help menus). */
export interface PageLink {
	id?: number;
	name: string;
	title?: string;
	slug?: string;
	path?: string;
	url?: string;
	type?: string;
	/** Agreement links: target URL and label */
	link?: string;
	link_type?: string;
}

/** Website popup shown on the home page. */
export interface WebsitePopup {
	show_website_popup?: BinaryFlag | boolean;
	popup_image?: string;
	popup_url?: string;
}

/** Default SEO text for the whole site. */
export interface SeoSettings {
	meta_title?: string;
	meta_description?: string;
}

/** Custom HTML/JS added from the admin panel. */
export interface CustomScripts {
	header_custom_script?: string | null;
	footer_custom_script?: string | null;
}

/**
 * Site-wide settings from `GET info/basic`.
 * Every field is optional: the backend can leave any of them empty.
 */
export interface SiteSettings {
	// ---- Branding ----
	name?: string;
	logo?: string;
	footer_logo?: string;
	favicon?: string;
	colors?: ThemeColors;
	seo?: SeoSettings;
	offer_massage?: string;
	trade_licence_no?: string;

	// ---- Contact ----
	phone?: string[];
	email?: string[];
	addresses?: string[];
	google_map_link?: string;

	// ---- Social links ----
	facebook_link?: string;
	instagram_link?: string;
	twitter_link?: string;
	youtube_link?: string;
	linkedin_link?: string;
	pinterest_link?: string;
	tiktok_link?: string;
	whatsapp_link?: string;
	android_app_link?: string;
	ios_app_link?: string;

	// ---- Menus & pages ----
	header_page?: PageLink[];
	footer_page?: PageLink[];
	help_page?: PageLink[];
	agreement_links?: PageLink[];
	agreement_text?: string;

	// ---- Home page sections (1 = show) ----
	slider_section?: BinaryFlag;
	category_section?: BinaryFlag;
	video_section?: BinaryFlag;
	best_selling_section?: BinaryFlag;
	shop_section?: BinaryFlag;
	featured_products_section?: BinaryFlag;
	newsletter_section?: BinaryFlag;
	footer_branding_section?: BinaryFlag;
	home_review_banner?: string;
	review_video_link?: string;
	review_video_file?: string;
	popup?: WebsitePopup;

	// ---- Checkout & delivery ----
	guest_checkout?: BinaryFlag;
	guest_ShippingForm?: BinaryFlag;
	allow_stock_out_product_add_to_cart?: BinaryFlag;
	delivery_region?: string;
	inside_dhaka_delivery_charges?: number;
	sub_dhaka_delivery_charges?: number;
	outside_dhaka_delivery_charges?: number;
	free_delivery_charges_limit?: number;
	is_delivery_charge_required_for_inside?: BinaryFlag;
	is_delivery_charge_required_for_sub_region?: BinaryFlag;
	is_delivery_charge_required_for_outside?: BinaryFlag;

	// ---- Tracking & verification ----
	fb_pixel_id?: string;
	fb_access_token?: string;
	fb_domain_verification?: string;
	gtm_id?: string;
	google_site_verification?: string;
	google_adsense_verification?: string;
	selfeb_script_url?: string;
	custom_script?: CustomScripts;
}
