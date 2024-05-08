import { NextResponse } from "next/server";
import { getPixelFormattedOrderItems } from "./helpers/format-items";

export async function GET(request, { params }) {
	const { order_id } = params;

	try {
		// getting order detail using id
		const res = await fetch(`${process.env.server}/sale/details/${order_id}`, {
			headers: {
				// AmsPublickey: process.env.AMS_PUBLIC_KEY, //will be removed
				AmsPrivateKey: process.env.AMS_PRIVATE_KEY,
			},
			cache: "no-store", //this is important
		});
		const order = await res.json();
		// console.log(order);

		if (order?.status === false || res.status !== 200) {
			// console.log(order, "Could not found the order");
			return NextResponse.error(order, { status: 404 });
		}

		const { sale } = order || {};

		//creating order summary
		const orderSummary = {
			id: sale?.id,
			invoice_no: sale?.invoice_no,
			status: sale?.status,
			sub_total: sale?.sub_total,
			total_amount: sale?.total_amount,
			due_amount: sale?.due_amount,
			paid_amount: sale?.paid_amount,
			ordered_items: getPixelFormattedOrderItems(order?.saleProducts),
			shipping: {
				delivery_charge: sale?.shipping?.delivery_charge,
			},
			customer: sale?.customer,
			sale_date: sale?.sale_date,
		};

		return NextResponse.json(orderSummary, { status: 200 });
	} catch (error) {
		console.error("An error occurred:", error);
		return NextResponse.error(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
