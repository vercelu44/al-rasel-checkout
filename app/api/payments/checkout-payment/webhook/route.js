import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const payload = await req.json();

    console.log("Webhook Payload:", JSON.stringify(payload, null, 2));

    switch (payload.type) {
      case "payment_approved": {
        const payment = payload.data;

        const orderId = payment?.metadata?.order_id;

        console.log("Payment Approved");
        console.log("Payment ID:", payment?.id);
        console.log("Reference:", payment?.reference);
        console.log("Order ID:", orderId);

        if (orderId) {
          // TODO:
          // await updateOrder(orderId);

          console.log(`Update database for order ${orderId}`);
        } else {
          console.log("No order_id found in metadata.");
        }

        break;
      }

      case "payment_declined":
        console.log("Payment Declined");
        break;

      case "payment_captured":
        console.log("Payment Captured");
        break;

      default:
        console.log("Unhandled Event:", payload.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error);

    return NextResponse.json(
      {
        error: "Webhook Failed",
      },
      {
        status: 200, // ইচ্ছা করলে 500 দিতে পারো, কিন্তু parse error-এর কারণে retry এড়াতে অনেকেই 200 ফেরত দেয়
      }
    );
  }
}