import apiSlice from "./apiSlice";

/** Event sent to the backend for Facebook Conversion API. */
export interface TrackingEvent {
	event_id: string | number;
	event_name: string;
	product_ids?: Array<string | number>;
	products?: unknown[];
	url?: string;
	fbp?: string | null;
	fbc?: string | null;
	client_ip_address?: string;
}

const serverSideTrackingAPI = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		addToTracking: builder.mutation<unknown, TrackingEvent>({
			query: (payload) => ({
				url: "server-side-tracking",
				method: "POST",
				body: payload,
				credentials: "include"
			}),
		}),
	}),
});

export const {
	useAddToTrackingMutation,
} = serverSideTrackingAPI;
