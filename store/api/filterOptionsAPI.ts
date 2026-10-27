import apiSlice from "./apiSlice";
import type { FilterOptions, LocaleArg } from "@/types";

interface FilterOptionsArg extends LocaleArg {
	/** Query string, e.g. "category_id=5" */
	searchQuery: string;
}

const filterOptionsAPI = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getFilterOptionsByCategory: builder.query<FilterOptions, FilterOptionsArg>({
			query: (payload) => ({
				url: `search-summary?${payload.searchQuery}`,
				headers: {
					lang: payload?.locale,
				},
			}),
			providesTags: ["filter-options"],
		}),
	}),
});

export const { useGetFilterOptionsByCategoryQuery } = filterOptionsAPI;
