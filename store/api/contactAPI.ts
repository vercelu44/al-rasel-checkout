import apiSlice from "./apiSlice";

/** Body of the contact form. */
export interface ContactMessageRequest {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
}

/** Body of the newsletter subscription form. */
export interface NewsletterRequest {
  email: string;
}

interface MessageResponse {
  message?: string;
  status?: boolean | number;
}

const contactAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    contactNow: builder.mutation<MessageResponse, ContactMessageRequest>({
      query: (payload) => ({
        url: "contact-message",
        method: "POST",
        body: payload,
      }),
    }),
    addToNewsletter: builder.mutation<MessageResponse, NewsletterRequest>({
      query: (payload) => ({
        url: "newsletter",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useContactNowMutation, useAddToNewsletterMutation } = contactAPI;
