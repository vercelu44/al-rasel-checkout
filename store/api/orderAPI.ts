import apiSlice from "./apiSlice";
import type { ApiResponse, LandingPageOrder, LocaleArg, NewOrder, OrderDetails, Sale } from "@/types";

interface PlaceOrderArg {
  newOrder: NewOrder | LandingPageOrder;
  isGuestCheckout?: boolean;
}

interface OrderByIdArg extends LocaleArg {
  order_id: string | number;
}

const orderAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    placeAnOrder: builder.mutation<{ sale?: Sale; message?: string }, PlaceOrderArg>({
      query: (payload) => ({
        url: !payload?.isGuestCheckout ? "checkout" : "guest-checkout",
        method: "POST",
        body: payload?.newOrder,
      }),
      invalidatesTags: ["orders"],
    }),
    placeIncompleteOrder: builder.mutation<unknown, Partial<NewOrder>>({
      query: (payload) => ({
        url: "incomplete-order",
        method: "POST",
        body: payload,
      }),
    }),
    getOrders: builder.query<ApiResponse<Sale[]>, void>({
      query: () => `order`,
      providesTags: ["orders"],
    }),
    getOrderById: builder.query<OrderDetails, OrderByIdArg>({
      query: (payload) => ({
        url: `order/show/${payload?.order_id}`,
        headers: {
          lang: payload?.locale,
        },
      }),
      providesTags: ["order"],
    }),
    /** Some backends wrap the order in `data`, others don't. */
    trackOrder: builder.query<OrderDetails & { data?: OrderDetails }, string>({
      query: (invoice_no) => ({
        url: `order/show-by-invoice/${invoice_no}`,
      }),
    }),
  }),
});

export const {
  usePlaceAnOrderMutation,
  usePlaceIncompleteOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useTrackOrderQuery,
} = orderAPI;
