import { postData } from "@/lib/post-data";
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
        const amount = payment?.amount;

        if (orderId) {
          // TODO:
          // await updateOrder(orderId);

          const paymentData = {
            order_id: orderId,
            status: "successful",
            amount: (amount || 0) / 100,
            payment_method: "stripe",
            transaction_id: payment?.reference,
          };

          // console.log({paymentData});

          const paymentUpdateResult = await postData(
            {
              api: "online-payment-status-change",
              isPrivate: true,
            },
            paymentData,
          );

          console.log("Payment Updated:", paymentUpdateResult);

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
        status: 200,
      },
    );
  }
}
