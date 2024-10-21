import apiSlice from "./apiSlice";

const serverSideTrackingAPI = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		addToTracking: builder.mutation({
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
