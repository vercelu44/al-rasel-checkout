import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { postData } from "@/lib/post-data";
import { handleOrderSSLPay } from "./SSLPayment";

export async function POST(request: Request) {
	const { orderId, newOrder, isGuestCheckout, isDeliveryChargePayment } =
		await request.json();
	const headersList = await headers();
	const bearerToken = headersList.get("authorization");
	// console.log(bearerToken);
	let order = null;

	// This is to handle req from localhost on custom server
	const { origin: baseUrlFromRequest } = new URL(request.url);
    const nextBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || baseUrlFromRequest;

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
			console.log(order, "order creation response in ssl");
			// The old arguments were ignored: NextResponse.error() always sends a network error
			return NextResponse.error();
		}
		// console.log("BEFORE SSL RESPONSE",order);
		//Initializing SSL payment using order data
		const sslResponse = await handleOrderSSLPay(order, nextBaseUrl, isDeliveryChargePayment);
		// console.log({sslResponse});
		
		return NextResponse.json(
			{
				GatewayPageURL: sslResponse.GatewayPageURL,
				status: true,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("An error occurred:", error);
		// The old arguments were ignored: NextResponse.error() always sends a network error
		return NextResponse.error();
	}
}
