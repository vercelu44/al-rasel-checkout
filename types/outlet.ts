/** A physical shop/branch, from the `outlets` endpoint (shown on /outlets) */
export interface Outlet {
	id?: number;
	/** Outlet name */
	title?: string;
	/** Photo of the outlet (absolute URL) */
	image?: string;
	address?: string;
	phone?: string;
	/** Free text, e.g. "10:00 AM - 10:00 PM" */
	open_close_time?: string;
	/** Google Maps link */
	map_location_link?: string;
}
