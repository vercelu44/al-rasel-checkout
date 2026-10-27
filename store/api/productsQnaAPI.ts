import apiSlice from "./apiSlice";
import type { ApiResponse, ID, QnaItem } from "@/types";

interface AddQuestionRequest {
  product_id: ID;
  question: string;
}

const productsQnaAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addToProductQna: builder.mutation<unknown, AddQuestionRequest>({
      query: (payload) => ({
        url: "product-questions",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["product-qna"],
    }),
    getProductQnaList: builder.query<ApiResponse<QnaItem[]>, ID>({
      query: (productId) => `products-questions/${productId}`,
      providesTags: ["product-qna"],
    }),
  }),
});

export const { useAddToProductQnaMutation, useGetProductQnaListQuery } =
  productsQnaAPI;
