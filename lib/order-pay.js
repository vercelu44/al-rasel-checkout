import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";

/**
 * The function `getPaymentUriByTitle` returns the payment URI based on the title provided as input.
 * @param title - The `getPaymentUriByTitle` function takes a `title` parameter as input and returns
 * the corresponding payment URI based on the title provided. If the title matches "Bkash Payment", it
 * returns "/api/payments/bkash". If the title matches "SSL Payment", it returns "/
 * @returns The function `getPaymentUriByTitle` returns the API endpoint URI based on the payment title
 * provided as an argument. If the title is "Bkash Payment", it returns "/api/payments/bkash". If the
 * title is "SSL Payment", it returns "/api/payments/sslcz". For any other title, it returns `null`.
 */
export const getPaymentUriByTitle = (title) => {
	switch (title) {
		case "Bkash Payment":
			return "/api/payments/bkash";
		case "SSL Payment":
			return "/api/payments/sslcz";
		case "Stripe":
			return "/api/payments/stripe";
		case "MasterCard":
			return "/api/payments/southeastbank";
		default:
			return null;
	}
};

/**
 * The function `handleOrderPayLater` is an asynchronous function that handles the payment process
 * for an order using SSLCZ gateway.
 * @param orderId - The orderId parameter is the unique identifier for the order that needs to be
 * processed for SSL payment.
 * @param setLoading - A function that sets the loading state of the component. It is used to indicate
 * that the payment process is in progress.
 */
export const handleOrderPayLater = async (
	orderId,
	paymentOption,
	PayMethod,
	setLoading
) => {
	// console.log(selectedPayMethod);
	const isDeliveryChargePayment =
		paymentOption?.key === "delivery_charge_payment";
	let paymentUri = getPaymentUriByTitle(PayMethod?.title);

	try {
		setLoading(true);
		const res = await fetch(paymentUri, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// authorization: getToken(),
			},
			body: JSON.stringify({
				orderId,
				isDeliveryChargePayment,
			}),
		});
		const data = await res.json();

		// console.log(data);
		setLoading(false);
		if (data?.sessionId) {
			toast.success("Stripe payment is processing please wait");
			const stripe = await loadStripe(
			  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
			);
			if (!stripe) return;
			await stripe.redirectToCheckout({
			  sessionId: data.sessionId,
			});
		  } else if (data?.GatewayPageURL) {
			toast.success("Online payment is processing please wait");
			window.location.replace(data.GatewayPageURL);
		} else {
			toast.error("Something went wrong");
		}
	} catch (error) {
		setLoading(false);
		toast.error("Something went wrong...", error);
	}
};