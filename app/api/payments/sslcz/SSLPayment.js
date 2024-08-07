import { generateUniqueId } from "@/utils/get-unique";
import { headers } from "next/headers";
const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
const is_live = process.env.IS_LIVE === "YES" ? true : false;

export const handleOrderSSLPay = async (order, isDeliveryChargePayment) => {
	const headersList = headers();
	const protocol = headersList.get("x-forwarded-proto") || "http";
	const host = headersList.get("host");
	const nextBaseUrl = `${protocol}://${host}`;

	const { sale } = order;
	const tranId = generateUniqueId(); // generating unique Id

	const successParams = new URLSearchParams({
		order: sale.id,
		tran: tranId,
		amount: isDeliveryChargePayment
			? sale?.shipping?.delivery_charge
			: sale.due_amount,
	});

	const sslPaymentData = {
		total_amount: isDeliveryChargePayment
			? sale?.shipping?.delivery_charge
			: sale.due_amount,
		currency: "BDT",
		tran_id: tranId, // use unique tran_id for each api call
		success_url: `${nextBaseUrl}/api/payments/sslcz/success?${successParams.toString()}`,
		fail_url: `${nextBaseUrl}/api/payments/sslcz/fail?order=${sale.id}`,
		cancel_url: `${nextBaseUrl}/api/payments/sslcz/fail?order=${sale.id}`,
		ipn_url: `${nextBaseUrl}/api/payments/sslcz/ipn`,
		shipping_method: "Courier",
		product_name: "Computer.",
		product_category: "Electronic",
		product_profile: "general",
		cus_name: sale.customer.name || sale.shipping.name,
		cus_email: sale.customer.email || "demo@demo.com",
		cus_add1: "Dhaka",
		cus_add2: "Dhaka",
		cus_city: "Dhaka",
		cus_state: "Dhaka",
		cus_postcode: "1000",
		cus_country: "Bangladesh",
		cus_phone: sale.customer.mobile || sale.shipping.phone,
		// cus_fax: "01711111111",
		ship_name: sale.shipping.name,
		ship_add1: sale.shipping.address,
		ship_add2: sale.shipping.alt_address,
		ship_city: "Dhaka",
		ship_state: "Dhaka",
		ship_postcode: 1000,
		ship_country: "Bangladesh",
	};
	// console.log(sslPaymentData);

	const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
	const sslResponse = await sslcz.init(sslPaymentData);
	// console.log(sslResponse);
	return sslResponse;
};
