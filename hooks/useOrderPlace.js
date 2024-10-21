import { toast } from "react-toastify";

import getToken from "@/utils/token";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { clearCart, clearDiscountInfo } from "@/store/slices/cartSlice";
import { setGlobalLoader } from "@/store/slices/commonSlice";
import { usePlaceAnOrderMutation } from "@/store/api/orderAPI";
import { getPaymentUriByTitle } from "@/lib/order-pay";
import { loadStripe } from "@stripe/stripe-js";

const useOrderPlace = () => {
  const [placeAnOrder] = usePlaceAnOrderMutation();
  const { settings } = useSelector((state) => state.common);
  const isGuestCheckout = !!settings?.guest_checkout;
  const dispatch = useDispatch();
  const router = useRouter();

  const handleOrderPlace = async (newOrder) => {
    dispatch(setGlobalLoader(true));
    if (newOrder.paymentOption !== "no_payment") {
      newOrder.payment_type = "Online"; //forcing to use payment type Online
      let paymentUri = getPaymentUriByTitle(newOrder.payment_method?.title);
      let isDeliveryChargePayment =
        newOrder?.paymentOption === "delivery_charge_payment" &&
        newOrder?.delivery_charge
          ? true
          : false;
      delete newOrder.payment_method;
      delete newOrder.paymentOption;

      try {
        const res = await fetch(paymentUri, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: getToken(),
          },
          body: JSON.stringify({
            newOrder,
            isGuestCheckout,
            isDeliveryChargePayment,
          }),
        });
        const data = await res.json();
        dispatch(setGlobalLoader(false));

        if (data?.southeastSession) {
          toast.success("SouthEast payment is processing please wait");
          dispatch(clearDiscountInfo());
          dispatch(clearCart());
          Checkout.configure({
            session: {
              id: data?.southeastSession?.id,
            },
          });
          Checkout.showPaymentPage();
        } else if (data?.sessionId) {
          toast.success("Stripe payment is processing please wait");
          dispatch(clearDiscountInfo());
          dispatch(clearCart());
          const stripe = await loadStripe(
            process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
          );
          if (!stripe) return;
          await stripe.redirectToCheckout({
            sessionId: data.sessionId,
          });
        } else if (data?.GatewayPageURL) {
          toast.success("Online payment is processing please wait");
          dispatch(clearDiscountInfo());
          dispatch(clearCart());
          window.location.replace(data.GatewayPageURL);
        } else {
          toast.error("Something went wrong");
        }
      } catch (error) {
        dispatch(setGlobalLoader(false));
        toast.error("Something went wrong...", error);
      }
    } else {
      newOrder.payment_type = "COD"; //forcing to use payment type COD
      delete newOrder.payment_method;
      placeAnOrder({ newOrder, isGuestCheckout })
        .unwrap()
        .then((response) => {
          dispatch(clearDiscountInfo());
          dispatch(setGlobalLoader(false));
          toast.success("Order successful");
          const { sale } = response || {};
          dispatch(clearCart());
          router.push(`checkout/success/${sale?.id}`);
        })
        .catch((error) => {
          // Handle the error if necessary
          dispatch(setGlobalLoader(false));
          toast.error("Failed to place an order");
          console.log(error);
        });
    }
  };
  return {
    handleOrderPlace,
  };
};

export default useOrderPlace;
