import { generateUniqueId } from "@/utils/get-unique";
// import { headers } from "next/headers";
// const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
const is_live = process.env.IS_LIVE === "YES" ? true : false;

const SSL_URL = is_live ? "https://securepay.sslcommerz.com": "https://sandbox.sslcommerz.com";

export const handleOrderSSLPay = async (order, nextBaseUrl, isDeliveryChargePayment) => {

	const { sale } = order;
	// console.log({sale});
	
	const tranId = generateUniqueId(); // generating unique Id

	const sslPaymentData = {
		store_id: store_id,
    store_passwd: store_passwd,
		total_amount: isDeliveryChargePayment
			? sale?.shipping?.delivery_charge
			: sale.due_amount,
		currency: "BDT",
		value_a: sale.id, // Order ID here 
		tran_id: tranId, // use unique tran_id for each api call
		success_url: `${nextBaseUrl}/api/payments/sslcz/success`,
		fail_url: `${nextBaseUrl}/api/payments/sslcz/fail`,
		cancel_url: `${nextBaseUrl}/api/payments/sslcz/fail`,
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

	// Package formate
	// const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
	// const sslResponse = await sslcz.init(sslPaymentData);
	// console.log(sslResponse);
	// return sslResponse;






	// This payment formate using SSL Commarze API
	const bodyParams = new URLSearchParams();
  Object.entries(sslPaymentData).forEach(([key, value]) => {
    bodyParams.append(key, String(value));
  });


	const getWayUrl =`${SSL_URL}/gwprocess/v4/api.php`;

  const response = await fetch(getWayUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyParams,
  });

  // console.log({bodyParams});
  const data = await response.json();
	

	return data;
};






// Verify transaction using val_id
export const verifyPayment = async (valId) => {
  const response = await fetch(
    `${SSL_URL}/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`
  );

  const data = await response.json();
  return data;
}
