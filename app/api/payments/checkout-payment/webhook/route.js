import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    const body = await req.text();

    console.log("Webhook Body:", body);

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}

// import {  NextResponse } from "next/server";

// export async function POST(req) {
//   const payload = await req.json();

//   const orderId = payload.data.metadata.order_id;

//   console.log("Checkout Webhook:", payload);
//   console.log("Order ID:", orderId);

//   switch (payload.type) {
//     case "payment_approved":

//     console.log("Payment Approved:", payload.data);
//       // Update database
//       break;

//     case "payment_declined":
//       break;

//     case "payment_captured":
//       break;
//   }

//   return NextResponse.json({ received: true });
// }