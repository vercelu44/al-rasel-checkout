import apiSlice from "./apiSlice";
import type { ApiResponse, ID, ProductReview, ReviewReactionType } from "@/types";

interface ReviewReactRequest {
	comment_id: ID;
	type: ReviewReactionType;
}

const productReviewAPI = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		//Creating new ordered products review
		addReview: builder.mutation<unknown, FormData | Record<string, unknown>>({
			query: (payload) => ({
				url: "product-review",
				method: "POST",
				body: payload,
			}),
			invalidatesTags: ["user-reviews", "product-reviews"],
		}),

		// Dashboard Orders reviews
		getUserReviews: builder.query<ApiResponse<ProductReview[]>, void>({
			query: () => `sell-product-review`,
			providesTags: ["user-reviews"],
		}),

		// Dashboard order review show
		getUserReviewShow: builder.query<ApiResponse<ProductReview[]>, ID>({
			query: (orderId) => `sell-product-review/${orderId}`,
			providesTags: ["user-review-show"],
		}),

		//Get Product all reviews
		getProductReviews: builder.query<ApiResponse<ProductReview[]>, ID>({
			query: (productId) => `product-review?product_id=${productId}`,
			providesTags: ["product-reviews"],
		}),

		//Product Review Summary
		getReviewSummary: builder.query<ApiResponse<Record<string, number>>, ID>({
			query: (productId) => `review-summary/${productId}`,
			providesTags: ["review-summary"],
		}),

		//Product all review images
		getReviewImages: builder.query<ApiResponse<string[]>, ID>({
			query: (productId) => `review-images/${productId}`,
			providesTags: ["review-images"],
		}),

		//Product review show
		getReviewDetails: builder.query<ApiResponse<ProductReview>, string | number>({
			query: (payload) => `review-details/${payload}`,
			providesTags: ["review-details"],
		}),

		//Product review like/dislike
		addReviewReact: builder.mutation<unknown, ReviewReactRequest>({
			query: (payload) => ({
				url: "product-comment/react",
				method: "POST",
				body: payload,
			}),
			invalidatesTags: ["product-reviews", "review-details"],
		}),
	}),
});

export const {
	useAddReviewMutation,
	useGetProductReviewsQuery,
	useGetUserReviewsQuery,
	useGetUserReviewShowQuery,
	useGetReviewSummaryQuery,
	useGetReviewImagesQuery,
	useAddReviewReactMutation,
	useGetReviewDetailsQuery,
} = productReviewAPI;
