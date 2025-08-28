// API route file
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import generateGrantToken from "./helpers/grant-token";
import { getAuthHeaders } from "./helpers/bkash-headers";
import { postData } from "@/lib/post-data";
import { getTokenFromDB, saveTokenToDB } from "./helpers/token-persist";

let orderIdForError = null;

export async function POST(request) {
	let bkashGrantToken = null;
	const savedTokenInfo = await getTokenFromDB(); // Fetch token from DB
	// console.log(savedTokenInfo, "savedTokenInfo");

	if (!savedTokenInfo || !savedTokenInfo?.data?.is_valid) {
		// Call grantToken to generate the token before proceeding
		const { grantToken } = await generateGrantToken();
		// console.log(grantToken, "Inside grant token generate");
		if (!grantToken) {
			return NextResponse.json({ status: "token generation failed" });
		}
		bkashGrantToken = grantToken;
		const savedToken = await saveTokenToDB(grantToken); // Save token to DB
		// console.log(savedToken, "new token generated and saved");
	} else {
		bkashGrantToken = savedTokenInfo?.data?.token;
		// console.log(bkashGrantToken, "existing token used");
	}

	const { origin: baseUrlFromRequest } = new URL(request.url);
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || baseUrlFromRequest;
	const { orderId, newOrder, isGuestCheckout, isDeliveryChargePayment } =
		await request.json();
	const headersList = headers();
	const bearerToken = headersList.get("authorization");
	let order = null;
	// console.log(isGuestCheckout);

	try {
		if (orderId) {
			//getting existing order
			const res = await fetch(`${process.env.server}/sale/details/${orderId}`, {
				headers: {
					// AmsPublickey: process.env.AMS_PUBLIC_KEY, //will be removed
					AmsPrivateKey: process.env.AMS_PRIVATE_KEY,
				},
				cache: "no-store", //this is important
			});
			order = await res.json();
			// console.log(order);
		} else {
			//creating new order
			order = await postData(
				{
					api: isGuestCheckout ? "guest-checkout" : "checkout",
					authorization: `Bearer ${bearerToken}`,
				},
				newOrder
			);
			// console.log(order);
		}
		if (!order || order?.status === false) {
			// console.log(order, "order creation response in bkash");
			return NextResponse.json(
				{ message: order?.message || "Order Creation failed", status: false },
			);
		}
		// after order creation we need to initialize bkash payment
		const { sale } = order;
		orderIdForError = sale.id; // set the global order id for failed payment

		const result = await fetch(`${process.env.BKASH_BASE_URL}/create`, {
			method: "POST",
			headers: {
				...(await getAuthHeaders()),
				authorization: bkashGrantToken,
			},
			body: JSON.stringify({
				mode: "0011",
				// payerReference: sale.customer.mobile,
				// payerReference:  bearerToken,
				payerReference: sale.customer.id,
				callbackURL: `${baseUrl}/api/payments/bkash`,
				amount: isDeliveryChargePayment
					? sale?.shipping?.delivery_charge
					: sale.due_amount,
				currency: "BDT",
				intent: "sale",
				merchantInvoiceNumber: sale.id,
			}),
		});
		const data = await result.json();
		// console.log(data, "create payment data"); // need to verify sandbox testing (convert it to json format then paste it)

		if (!data || data?.bkashURL === null) {
			return NextResponse.json({
				status: false,
			});
		}
		return NextResponse.json({
			GatewayPageURL: data.bkashURL,
			status: true,
		});
	} catch (error) {
		console.log(error);
		return NextResponse.error(
			{ message: "Order Creation failed" },
			{ status: 500 }
		);
	}
}

export async function GET(request) {
	const { searchParams, origin: baseUrlFromRequest } = new URL(request.url);
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || baseUrlFromRequest;
	const paymentID = searchParams.get("paymentID");
	const status = searchParams.get("status");
	const savedTokenInfo = await getTokenFromDB(); // Fetch token from DB
	const bkashGrantToken = savedTokenInfo?.data?.token;
	// console.log(savedTokenInfo, "savedTokenInfo from bkash request");

	try {
		if (status === "success") {
			// console.log("Execute Payment API Start !!!");
			const executeResponse = await fetch(
				`${process.env.BKASH_BASE_URL}/execute`,
				{
					method: "POST",
					headers: {
						...(await getAuthHeaders()),
						authorization: bkashGrantToken,
					},
					body: JSON.stringify({
						paymentID,
					}),
				}
			);
			const result = await executeResponse.json();
			// console.log("callback execute result", result); // need to verify sandbox testing (convert it to json format then paste it)
			if (result.statusCode && result.statusCode === "0000") {
				console.log("Payment Successful !!! ");
				// save response in your db
				const paymentData = {
					order_id: result.merchantInvoiceNumber,
					status: "successful",
					amount: result?.amount || 0,
					payment_method: "bkash",
					transaction_id: result?.trxID,
				};

				//Updating payment info of order
				const paymentUpdateResult = await postData(
					{
						api: "online-payment-status-change",
						// authorization: `Bearer ${result.payerReference}`,
						isPrivate: true,
					},
					paymentData
				);

				// console.log(paymentUpdateResult);

				return NextResponse.redirect(
					`${baseUrl}/checkout/success/${result.merchantInvoiceNumber}`,
					{
						status: 301,
					}
				);
			} else {
				console.log("Payment Failed !!!");

				return NextResponse.redirect(
					`${baseUrl}/checkout/fail/${orderIdForError}`,
					{
						status: 301,
					}
				);
			}
		} else {
			console.log("Payment cancelled !!!");

			return NextResponse.redirect(
				`${baseUrl}/checkout/fail/${orderIdForError}`,
				{
					status: 301,
				}
			);
		}
	} catch (e) {
		console.error("Error occurred during payment:", e); // Log the error
		// return res.redirect(baseUrl)/payment-fail;
		return NextResponse.redirect(
			`${baseUrl}/checkout/fail/${orderIdForError}`,
			{
				status: 301,
			}
		);
	}
}
