import apiSlice from "./apiSlice";
import type {
	ApiResponse,
	ID,
	PaginatedResponse,
	Product,
	SearchKeyword,
	SearchSuggestion,
} from "@/types";

interface RemoveHistoryArg {
	historyId: ID;
	userId: ID;
}

interface FilterProductsArg {
	/** Ready-made query string, see `buildProductQueryParams`. */
	params: string;
}

const searchAPI = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getPopularSearch: builder.query<ApiResponse<SearchKeyword[]>, null | void>({
			query: () => `popular-search-histories`,
			providesTags: ["popular-search"],
		}),
		getSearchHistories: builder.query<ApiResponse<SearchKeyword[]>, ID | undefined>({
			query: (userId) => `search-histories?reference_id=${userId}`,
			providesTags: ["search-histories"],
		}),
		removeSearchHistory: builder.mutation<unknown, RemoveHistoryArg>({
			query: (payload) => ({
				url: `search-histories-delete/${payload.historyId}?reference_id=${payload.userId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["search-histories"],
		}),
		getSearchSuggestions: builder.query<ApiResponse<SearchSuggestion[]>, string>({
			query: (searchText) => `search-suggestion?per_page=10&text=${searchText}`,
			providesTags: ["search-suggestions"],
		}),
		getFilterProducts: builder.query<PaginatedResponse<Product>, FilterProductsArg>({
			query: ({params}) => {
				const url = `products?${params}`;
				console.log({url});
				return {
					url,
					method: "GET"
				}
			},
			// previously `[""]` – an empty tag that nothing invalidated
			providesTags: [],
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
