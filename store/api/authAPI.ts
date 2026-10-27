import apiSlice from "./apiSlice";
import type { ApiResponse, User } from "@/types";

/** Body of `login-phone` (request an OTP). */
export interface OtpLoginRequest {
  phone_no: string;
  country: string;
}

/** Body of `verify-otp`. */
export interface VerifyOtpRequest extends OtpLoginRequest {
  /** The 6 digit OTP */
  code: string;
}

export interface OtpLoginResponse {
  otp_message?: string;
  message?: string;
}

/** `verify-otp` returns the logged-in user and the auth token. */
export interface VerifyOtpResponse extends ApiResponse<User> {
  token: string;
}

const authAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query<ApiResponse<unknown[]>, void>({
      query: () => `countries`,
      providesTags: ["countries"],
    }),
    otpLogin: builder.mutation<OtpLoginResponse, OtpLoginRequest>({
      query: (loginData) => ({
        url: "login-phone",
        method: "POST",
        body: loginData,
      }),
      invalidatesTags: ["user"],
    }),
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (otpData) => ({
        url: "verify-otp",
        method: "POST",
        body: otpData,
      }),
      invalidatesTags: ["user"],
    }),
    getUser: builder.query<ApiResponse<User>, void>({
      query: () => `user`,
      providesTags: ["user"],
    }),
    updateProfile: builder.mutation<ApiResponse<User>, FormData>({
      query: (payload) => ({
        url: "update-profile",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useOtpLoginMutation,
  useVerifyOtpMutation,
  useGetUserQuery,
  useUpdateProfileMutation,
} = authAPI;
