import apiSlice from "./apiSlice";
import type { ApiResponse, LocaleArg } from "@/types";

export interface SupportTicket {
	id: number;
	subject?: string;
	message?: string;
	status?: string;
	[key: string]: unknown;
}

const supportTicketAPI = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		addSupportTicket: builder.mutation<unknown, FormData | Record<string, unknown>>({
			query: (ticketInfo) => ({
				url: "support-ticket",
				method: "POST",
				body: ticketInfo,
			}),
			invalidatesTags: ["s-ticket"],
		}),
		getSupportTicket: builder.query<ApiResponse<SupportTicket[]>, LocaleArg>({
			query: (payload) => ({
				url: "support-ticket",
				headers: {
					lang: payload?.locale,
				},
			}),
			providesTags: ["s-ticket"],
		}),
		getSupportTicketTypes: builder.query<ApiResponse<Array<{ id: number; name: string }>>, LocaleArg>({
			query: (payload) => ({
				url: "support-ticket-type",
				headers: {
					lang: payload?.locale,
				},
			}),
			providesTags: ["s-ticket-type"],
		}),
	}),
});

export const {
	useAddSupportTicketMutation,
	useGetSupportTicketQuery,
	useGetSupportTicketTypesQuery,
} = supportTicketAPI;
