import api from "./api";

const orderAPI = api.injectEndpoints({
	endpoints: (builder) => ({
		placeAnOrder: builder.mutation({
			query: (payload) => ({
				url: !payload?.isGuestCheckout ? "checkout" : "guest-checkout",
				method: "POST",
				body: payload?.newOrder,
			}),
			invalidatesTags: ["orders"],
		}),
		getOrders: builder.query({
			query: () => `order`,
			providesTags: ["orders"],
		}),
		getOrderById: builder.query({
			query: (payload) => ({
				url: `order/show/${payload?.order_id}`,
				headers: {
					lang: payload?.locale,
				},
			}),
			providesTags: ["order"],
		}),
	}),
});

export const {
	usePlaceAnOrderMutation,
	useGetOrdersQuery,
	useGetOrderByIdQuery,
} = orderAPI;
