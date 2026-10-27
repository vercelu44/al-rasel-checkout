/**
 * Global declarations: browser globals added by tracking scripts,
 * environment variables and packages that ship without types.
 */

declare global {
	interface Window {
		/** Facebook Pixel */
		fbq: (...args: unknown[]) => void;
		/** Google Tag Manager */
		dataLayer?: Record<string, unknown>[];
	}

	namespace NodeJS {
		interface ProcessEnv {
			/** Backend API base URL, exposed to the browser via next.config `env`. */
			server?: string;
			amsPublickey?: string;
			API_BASE_URL?: string;
			AMS_PUBLIC_KEY?: string;
			AMS_PRIVATE_KEY?: string;
			NEXT_PUBLIC_BASE_URL?: string;
			NEXT_PUBLIC_IS_SQUARE_IMAGE?: string;
			NEXT_PUBLIC_FACEBOOK_PIXEL_ID?: string;
			NEXT_PUBLIC_GTM_ID?: string;
			NEXT_PUBLIC_GTM_ENABLED?: string;
			NEXT_PUBLIC_SELFEB_SCRIPT_URL?: string;
			NEXT_PUBLIC_NO_THUMBNAIL?: string;
			NEXT_PUBLIC_INFINITY_SCROLL?: string;
			NEXT_PUBLIC_HEADER_COLOR?: string;
			NEXT_PUBLIC_SORT_TYPE?: string;
			NEXT_PUBLIC_HEADER_TRACK?: string;
			NEXT_PUBLIC_SHOW_SSL_LOGO?: string;
			NEXT_PUBLIC_CAT_GRID_BANNER?: string;
			/** "YES" shows the quality standards section on the home page. */
			IS_QUALITY_STANDARDS?: string;
			STORE_ID?: string;
			STORE_PASS?: string;
			IS_LIVE?: string;
			BKASH_BASE_URL?: string;
			BKASH_USERNAME?: string;
			BKASH_PASSWORD?: string;
			BKASH_APP_KEY?: string;
			BKASH_APP_SECRET?: string;
		}
	}
}

export {};
