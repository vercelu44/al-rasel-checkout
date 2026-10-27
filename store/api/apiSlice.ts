// Need to use the React-specific entry point to allow generating React hooks
// Important note: if we use /react entry point then we can't able to use redux in server component
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getToken from "@/utils/token";

// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
	reducerPath: "apiSlice",
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.server,
		prepareHeaders: (headers) => {
			// Retrieve the API keys from next config env variables
			const publicKey = process.env.amsPublickey;
			// const privateKey = process.env.amsPrivateKey;
			const token = getToken();

			// Set the API key headers
			headers.set("AmsPublicKey", publicKey ?? "");
			// headers.set("AmsPrivateKey", privateKey);

			// Set the lang key headers
			// const locale = getState().common.locale;
			// console.log(locale);
			// headers.set("lang", locale);

			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}

			return headers;
		},
		// credentials: "include",
	}),

	tagTypes: [
		"countries",
		"user",
		"wishlist",
		"s-ticket",
		"s-ticket-type",
		"visited",
		"orders",
		"order",
		"categories",
		"popular-categories",
		"product-qna",
		"faqs",
		"user-reviews",
		"product-reviews",
		"user-review-show",
		"popular-search",
		"search-histories",
		"search-suggestions",
		"brands",
		"filter-options",
		"review-summary",
		"review-images",
		"review-details",
		"product-flash-sale",
		"payment-methods",
	],
	endpoints: () => ({}),
});

export default apiSlice;
