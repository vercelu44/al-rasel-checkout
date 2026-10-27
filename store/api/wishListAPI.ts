import apiSlice from "./apiSlice";
import type { ApiResponse, ID, LocaleArg, Product } from "@/types";

const wishListAPI = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		addToWishList: builder.mutation<unknown, { product_id: ID }>({
			query: (productInfo) => ({
				url: "wishlist",
				method: "POST",
				body: productInfo,
			}),
			invalidatesTags: ["wishlist"],
		}),
		getWishList: builder.query<ApiResponse<Product[]>, LocaleArg>({
			query: (payload) => ({
				url: `wishlist`,
				headers: {
					lang: payload.locale || "en",
				},
			}),
			providesTags: ["wishlist"],
		}),
		removeFromWishList: builder.mutation<unknown, ID>({
			query: (productId) => ({
				url: `wishlist/${productId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["wishlist"],
		}),
	}),
});

export const {
	useAddToWishListMutation,
	useGetWishListQuery,
	useRemoveFromWishListMutation,
} = wishListAPI;
