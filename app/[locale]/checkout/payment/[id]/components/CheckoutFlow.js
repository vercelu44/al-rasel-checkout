"use client";

import { useEffect } from "react";
import { loadCheckoutWebComponents } from "@checkout.com/checkout-web-components";
import { useRouter } from "next/navigation";

export default function CheckoutFlow({ orderId }) {
  const router = useRouter();
  useEffect(() => {
    init();
  }, []);

  async function init() {
    const res = await fetch("/api/payments/checkout-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    });

    const data = await res.json();

    const checkout = await loadCheckoutWebComponents({
      environment: "sandbox",

      publicKey: process.env.NEXT_PUBLIC_CHECKOUT_PUBLIC_KEY,

      paymentSession: data.paymentSession,

      // redirect to success page after payment completion
      onPaymentCompleted: (_self, payment) => {
        console.log({payment});
        
        router.push(`/checkout/success/${orderId}`);
      },
      onError(error) {
        router.push(`/checkout/fail`); 
      },
    });

    const flow = checkout.create("flow");

    flow.mount("#flow-container");
  }

  return <div className="w-[500px] mx-auto h-[600px] md:h-[800px] lg:h-[1000px] 2xl:h-[1200px]">
    <div id="flow-container" />
  </div>;
}