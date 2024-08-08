import api from "./api";

const categoriesAPI = api.injectEndpoints({
	endpoints: (builder) => ({
		getCategories: builder.query({
			query: (payload) => ({
				url: "categories",
				headers: {
					lang: payload?.locale,
				},
			}),
			providesTags: ["categories"],
		}),
		getPopularCategories: builder.query({
			query: (payload) => ({
				url: "popular-categories",
				headers: {
					lang: payload?.locale,
				},
			}),
			providesTags: ["popular-categories"],
		}),
	}),
});

export const { useGetCategoriesQuery, useGetPopularCategoriesQuery } =
	categoriesAPI;
