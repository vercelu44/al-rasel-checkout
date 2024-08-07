/**
 * The function `getDCPaidLabel` returns a green label indicating "DC Paid" if the due amount is not
 * equal to the total amount and the payment type is not "COD".
 * @param due_amount - The `due_amount` parameter represents the amount that is due for payment.
 * @param total_amount - The `total_amount` parameter represents the total amount that needs to be paid
 * for a particular transaction.
 * @param payment_type - The `payment_type` parameter is a string that represents the type of payment
 * made for an order. In this case, the function is checking if the payment type is not "COD" (Cash on
 * Delivery) to determine if the order has been partially paid by a delivery company (DC).
 * @returns A JSX element is being returned with the text "DC Paid" styled with green text color and a
 * light green background, enclosed in a rounded rectangle.
 */
export const getDCPaidLabel = (due_amount, total_amount, payment_type) => {
	if (due_amount && due_amount !== total_amount && payment_type !== "COD") {
		return (
			<span className="text-green-500 bg-green-100 px-2 rounded-lg">
				DC Paid
			</span>
		);
	}
	return null;
};

/**
 * The function `getPaymentLabel` determines the payment status based on the due amount, total amount,
 * and payment type, and returns a corresponding label with styling.
 * @param due_amount - The `due_amount` parameter represents the amount that is yet to be paid for a
 * particular transaction or order.
 * @param total_amount - The `total_amount` parameter represents the total amount that needs to be paid
 * for a particular transaction or order.
 * @param payment_type - The `payment_type` parameter in the `getPaymentLabel` function represents the
 * type of payment method used for a transaction. It could be "COD" (Cash on Delivery) or any other
 * payment method. The function uses this parameter along with the `due_amount` and `total_amount` to
 * @returns The `getPaymentLabel` function returns a JSX element containing a span with a specific
 * label and styling based on the conditions provided in the function. The label text and styling are
 * determined based on the values of `due_amount`, `total_amount`, and `payment_type`. The function
 * returns the JSX element with the appropriate label and class name based on the conditions met.
 */
export const getPaymentLabel = (due_amount, total_amount, payment_type) => {
	let label = "";
	let className = "px-2 rounded-lg ";

	if (!due_amount) {
		label = "Paid";
		className += "text-green-500 bg-green-100";
	} else if (due_amount && payment_type === "COD") {
		label = "COD";
		className += "text-green-500 bg-green-100";
	} else if (due_amount !== total_amount) {
		label = "DC Paid";
		className += "text-green-500 bg-green-100";
	} else if (due_amount === total_amount) {
		label = "Payment Incomplete";
		className += "text-red-500 bg-red-100";
	}

	return label ? <span className={className}>{label}</span> : null;
};

/**
 * The function `getPayableStatus` determines the payment status based on the due amount, total amount,
 * and payment type.
 * @param due_amount - The `due_amount` parameter represents the amount that is yet to be paid by the
 * customer.
 * @param total_amount - The `total_amount` parameter represents the total amount that needs to be paid
 * for a particular transaction or order.
 * @param payment_type - The `payment_type` parameter in the `getPayableStatus` function refers to the
 * method of payment used for the transaction. It could be a string indicating the type of payment,
 * such as "COD" for Cash on Delivery or other payment methods like credit card, online transfer, etc.
 * @returns A JSX element containing a span with a className attribute set based on the conditions in
 * the getPayableStatus function. The span will display the label text determined by the conditions.
 */
export const getPayableStatus = (due_amount, total_amount, payment_type) => {
	let label = "";
	let className = "px-2 rounded-lg ";

	if (!due_amount) {
		label = "Paid";
		className += "text-green-500 bg-green-100";
	} else if (due_amount === total_amount && payment_type !== "COD") {
		label = "Payment Incomplete";
		className += "text-red-500 bg-red-100";
	} else {
		label = "Due";
		className += "text-red-500 bg-red-100";
	}

	return label ? <span className={className}>{label}</span> : null;
};