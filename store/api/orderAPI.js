import apiSlice from "./apiSlice";

const orderAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    placeAnOrder: builder.mutation({
      query: (payload) => ({
        url: !payload?.isGuestCheckout ? "checkout" : "guest-checkout",
        method: "POST",
        body: payload?.newOrder,
      }),
      invalidatesTags: ["orders"],
    }),
    placeIncompleteOrder: builder.mutation({
      query: (payload) => ({
        url: "incomplete-order",
        method: "POST",
        body: payload,
      }),
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
  usePlaceIncompleteOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
} = orderAPI;
