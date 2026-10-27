import apiSlice from "./apiSlice";
import type { ApiResponse, LocaleArg, QnaItem } from "@/types";

const faqsAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query<ApiResponse<QnaItem[]>, LocaleArg>({
      query: (payload) => ({
        url: "faqs",
        headers: {
          lang: payload?.locale,
        },
      }),
      providesTags: ["faqs"],
    }),
  }),
});

export const { useGetFaqsQuery } = faqsAPI;
