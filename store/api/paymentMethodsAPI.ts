import apiSlice from "./apiSlice";
import type { ApiResponse, PaymentMethodMap } from "@/types";

const paymentMethodsAPI = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getPaymentMethods: builder.query<ApiResponse<PaymentMethodMap>, void>({
			query: () => ({
				url: "info/payment-method",
			}),
			providesTags: ["payment-methods"],
		}),
	}),
});

export const { useGetPaymentMethodsQuery } = paymentMethodsAPI;
