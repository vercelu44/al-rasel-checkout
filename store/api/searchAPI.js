import apiSlice from "./apiSlice";

const searchAPI = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getPopularSearch: builder.query({
			query: () => `popular-search-histories`,
			providesTags: ["popular-search"],
		}),
		getSearchHistories: builder.query({
			query: (userId) => `search-histories?reference_id=${userId}`,
			providesTags: ["search-histories"],
		}),
		removeSearchHistory: builder.mutation({
			query: (payload) => ({
				url: `search-histories-delete/${payload.historyId}?reference_id=${payload.userId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["search-histories"],
		}),
		getSearchSuggestions: builder.query({
			query: (searchText) => `search-suggestion?per_page=10&text=${searchText}`,
			providesTags: ["search-suggestions"],
		}),
		getFilterProducts: builder.query({
			query: ({params}) => {
				const url = `products?${params}`;
				console.log({url});
				return {
					url,
					method: "GET"
				}
			},
			providesTags: [""],
		}),
	}),
});

export const {
	useGetPopularSearchQuery,
	useGetSearchHistoriesQuery,
	useRemoveSearchHistoryMutation,
	useGetSearchSuggestionsQuery,
	useLazyGetSearchSuggestionsQuery,
	useGetFilterProductsQuery,
} = searchAPI;
