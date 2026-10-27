import apiSlice from "./apiSlice";
import type { ApiResponse, ID, LocaleArg, Product } from "@/types";

const visitedProductsAPI = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		addToVisited: builder.mutation<unknown, { product_id: ID; date?: Date }>({
			query: (payload) => ({
				url: "visit-history",
				method: "POST",
				body: payload,
			}),
			invalidatesTags: ["visited"],
		}),
		getVisitedProducts: builder.query<ApiResponse<Product[]>, LocaleArg>({
			query: (payload) => ({
				url: "visit-history",
				headers: {
					lang: payload?.locale,
				},
			}),
			providesTags: ["visited"],
		}),
	}),
});

export const { useAddToVisitedMutation, useGetVisitedProductsQuery } =
	visitedProductsAPI;
