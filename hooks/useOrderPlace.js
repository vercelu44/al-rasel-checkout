import { toast } from "react-toastify";

import getToken from "@/utils/token";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { clearCart, clearDiscountInfo } from "@/store/slices/cartSlice";
import { setGlobalLoader } from "@/store/slices/commonSlice";
import { usePlaceAnOrderMutation } from "@/store/api/orderAPI";
import { getPaymentUriByTitle } from "@/lib/order-pay";
// import * as pixel from "/lib/fpixel";

const useOrderPlace = () => {
	const [placeAnOrder] = usePlaceAnOrderMutation();
	const { settings } = useSelector((state) => state.common);
	const { cart } = useSelector((state) => state.cart);

	const isGuestCheckout = !!settings?.guest_checkout;
	const dispatch = useDispatch();
	const router = useRouter();

	const handleOrderPlace = async (newOrder) => {
		// console.log(newOrder);
		// if (newOrder.payment_method?.key !== "COD" && isGuestCheckout) {
		// 	toast.error("Guest Payment Option is not available yet");
		// 	return;
		// }

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
			// console.log(newOrder);
			// console.log(isDeliveryChargePayment);
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
				// console.log(data);
				if (data?.GatewayPageURL) {
					//for fb pixel purchase event
					// pixel.event(
					// 	"Purchase",
					// 	pixel.getInitiateCheckoutPixelData(cart, newOrder.subtotal)
					// );

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
					// Handle the successful response if necessary
					// console.log(response);

					//for fb pixel purchase event
					// pixel.event(
					// 	"Purchase",
					// 	pixel.getInitiateCheckoutPixelData(cart, newOrder.subtotal)
					// );

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
					toast.error(error.data.message || "Failed to place an order, something went wrong, please try again");
				});
		}
	};
	return {
		handleOrderPlace,
	};
};

export default useOrderPlace;
