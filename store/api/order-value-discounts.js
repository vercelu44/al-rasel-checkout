import apiSlice from "./apiSlice";

const orderValueDiscountsAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrderValueDiscounts: builder.query({
      query: () => ({
        url: "promotion/order-value-discounts",
      }),
      providesTags: ["order-value-discounts"],
    }),
  }),
});

export const { useGetOrderValueDiscountsQuery } = orderValueDiscountsAPI;
