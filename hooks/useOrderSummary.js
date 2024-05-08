import { useState, useEffect } from "react";

/**
 * The function `useOrderSummary` is a custom React hook that fetches an order summary based on an
 * order ID and returns the order data, loading state, and error message.
 * @param orderId - The `orderId` parameter is the unique identifier of the order for which you want to
 * fetch the order summary.
 * @returns The function `useOrderSummary` returns an object with three properties: `order`, `loading`,
 * and `error`.
 */
function useOrderSummary(orderId) {
	const [order, setOrder] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchOrderSummary = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/order-summary-show/${orderId}`);
				if (!res.ok) {
					throw new Error("Failed to fetch data");
				}
				const orderData = await res.json();
				setOrder(orderData);
				setError(null);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (orderId) {
			fetchOrderSummary();
		}
	}, [orderId]);

	return { order, loading, error };
}

export default useOrderSummary;
