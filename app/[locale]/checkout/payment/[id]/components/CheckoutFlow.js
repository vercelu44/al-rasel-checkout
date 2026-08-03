"use client";

import { useEffect } from "react";
import { loadCheckoutWebComponents } from "@checkout.com/checkout-web-components";
import { useRouter } from "next/navigation";

export default function CheckoutFlow({ orderId }) {
  const router = useRouter();

  useEffect(() => {
    if (!orderId) return;

    let flow;

    const init = async () => {
      const getToken = localStorage.getItem("checkout_payment_session");

      if (!getToken) {
        router.replace("/");
        return;
      }

      const paymentSession = JSON.parse(getToken);

      const environment =
        process.env.CHECKOUT_SANDBOX === "sandbox" ? "sandbox" : "production";

      const checkout = await loadCheckoutWebComponents({
        environment: "sandbox",
        publicKey: process.env.NEXT_PUBLIC_CHECKOUT_PUBLIC_KEY,
        paymentSession,

        onPaymentCompleted() {
          localStorage.removeItem("checkout_payment_session");
          router.push(`/checkout/success/${orderId}`);
        },

        onError(error) {
          console.error(error);
          localStorage.removeItem("checkout_payment_session");
          router.push(`/checkout/fail/${orderId}`);
        },
      });

      flow = checkout.create("flow");

      flow.mount("#flow-container");
    };

    init();

    return () => {
      flow?.unmount?.();
    };
  }, [orderId, router]);

  return (
    <div className="w-[500px] mx-auto h-[600px] md:h-[800px] lg:h-[1000px] 2xl:h-[1200px]">
      <div id="flow-container" />
    </div>
  );
}
