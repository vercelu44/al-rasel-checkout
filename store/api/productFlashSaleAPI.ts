import apiSlice from "./apiSlice";
import type { FlashSaleResponse, LocaleArg } from "@/types";

interface FlashSaleArg extends LocaleArg {
  searchQuery?: string;
}

const productFlashSaleAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductFlashSale: builder.query<FlashSaleResponse, FlashSaleArg>({
      query: (payload) => ({
        url: `product-flash-sale?${payload?.searchQuery}`,
        headers: {
          lang: payload?.locale,
        },
      }),
      providesTags: ["product-flash-sale"],
    }),
  }),
});

export const { useGetProductFlashSaleQuery } = productFlashSaleAPI;
