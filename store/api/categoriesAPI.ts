import apiSlice from "./apiSlice";
import type { ApiResponse, Category, LocaleArg } from "@/types";

const categoriesAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<ApiResponse<Category[]>, LocaleArg>({
      query: (payload) => ({
        url: "categories",
        headers: {
          lang: payload?.locale,
        },
      }),
      providesTags: ["categories"],
    }),
    
    getPopularCategories: builder.query<ApiResponse<Category[]>, void>({
      query: () => `popular-categories?no_child=1`,
      providesTags: ["popular-categories"],
    }),
  }),
});

export const { useGetCategoriesQuery , useGetPopularCategoriesQuery} = categoriesAPI;
