import apiSlice from "./apiSlice";
import type { ApiResponse, Brand, LocaleArg } from "@/types";

const brandsAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<ApiResponse<Brand[]>, LocaleArg>({
      query: (payload) => ({
        url: "brands",
        headers: {
          lang: payload?.locale,
        },
      }),
      providesTags: ["brands"],
    }),
  }),
});

export const { useGetBrandsQuery } = brandsAPI;
