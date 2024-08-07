import { postData } from "@/lib/post-data";
// import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(request) {
	const { searchParams, origin } = new URL(request.url);
	// console.log(origin);
	const orderId = searchParams.get("order");
	const tranId = searchParams.get("tran");
	const paidAmount = searchParams.get("amount");
	// const bearerToken = searchParams.get("auth");

	const paymentData = {
		order_id: orderId,
		status: "successful",
		amount: paidAmount,
		payment_method: "sslcommerz",
		transaction_id: tranId,
	};

	//Updating payment info of order
	const result = await postData(
		{
			api: "online-payment-status-change",
			// authorization: `Bearer ${bearerToken}`,
			isPrivate: true,
		},
		paymentData
	);

	// const successUrl = new URL(`/checkout/success/${orderId}`, request.url);
	return NextResponse.redirect(`${origin}/checkout/success/${orderId}`, {
		status: 301,
	});

	// redirect(`/checkout/success/${orderId}`);
	// return NextResponse.redirect(successUrl.href, {
	//   status: 301,
	// });
}
