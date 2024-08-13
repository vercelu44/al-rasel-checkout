"use client";
import { getPaymentUriByTitle } from "@/lib/order-pay";
import { useRouter } from "@/navigation";
import { setGlobalLoader } from "@/store/slices/commonSlice";
import getToken from "@/utils/token";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const StripePayment = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleStripePayment = async () => {
    let paymentUri = getPaymentUriByTitle("Stripe Payment");
    let isDeliveryChargePayment = false;
    let isGuestCheckout = false;
    const orderId = 93147;
    try {
      const res = await fetch(paymentUri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: getToken(),
        },
        body: JSON.stringify({
          orderId,
          isGuestCheckout,
          isDeliveryChargePayment,
        }),
      });
      const data = await res.json();
      dispatch(setGlobalLoader(false));
      // console.log(data);
      if (data?.GatewayPageURL) {
        toast.success("Online payment is processing please wait");
        window.location.replace(data.GatewayPageURL);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      dispatch(setGlobalLoader(false));
      toast.error("Something went wrong...", error);
      console.log(error);
    }
  };

  return (
    <div className="container flex justify-center items-center h-[100vh]">
      <button
        className="py-2 px-4 bg-primary text-white"
        onClick={handleStripePayment}
      >
        Pay Now
      </button>
    </div>
  );
};

export default StripePayment;
