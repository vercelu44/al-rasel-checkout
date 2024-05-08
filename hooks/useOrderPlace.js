import { useRouter } from "@/navigation";
import { usePlaceAnOrderMutation } from "@/store/api/orderAPI";
import { toast } from "react-toastify";
import getToken from "@/utils/token";
import { clearCart, clearDiscountInfo } from "@/store/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { setGlobalLoader } from "@/store/slices/commonSlice";

const useOrderPlace = () => {
	const [placeAnOrder] = usePlaceAnOrderMutation();
	const { settings } = useSelector((state) => state.common);
	const isGuestCheckout = !!settings?.guest_checkout;
	const dispatch = useDispatch();
	const router = useRouter();
	const handleOrderPlace = async (newOrder) => {
		// console.log(newOrder);
		if (newOrder.payment_type !== "COD" && isGuestCheckout) {
			toast.error("Guest Payment Option is not available yet");
			return;
		}

		dispatch(setGlobalLoader(true));
		// "Online Payment"
		if (newOrder.payment_type !== "COD") {
			//currently getting payment_type "Online Payment" but checkout accepts "Online"
			newOrder.payment_type = "Online"; //forcing to use payment type Online
			try {
				const res = await fetch("/api/payments/sslcz", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						authorization: `Bearer ${getToken()}`,
					},
					body: JSON.stringify(newOrder),
				});
				const data = await res.json();
				dispatch(setGlobalLoader(false));
				// console.log(data);
				if (data?.GatewayPageURL) {
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
			placeAnOrder({ newOrder, isGuestCheckout })
				.unwrap()
				.then((response) => {
					// Handle the successful response if necessary
					// console.log(response);
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
