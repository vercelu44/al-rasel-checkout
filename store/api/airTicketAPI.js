import api from "./api";

const orderAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    placeTicketOrder: builder.mutation({
      query: (payload) => ({
        url: "air-ticket",
        method: "POST",
        body: payload,
      }),
      // invalidatesTags: ["orders"],
    }),
  }),
});

export const { usePlaceTicketOrderMutation } = orderAPI;
