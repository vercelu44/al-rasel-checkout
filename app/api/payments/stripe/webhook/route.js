import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { postData } from "@/lib/post-data";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// export const dynamic = 'force-static';

export async function POST(request) {
  console.log("Inside webhook");
  const body = await request.text();
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = headers().get("stripe-signature");
  // const sig2 = request.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return NextResponse.json(
      { message: `Webhook Error: ${err}` },
      {
        status: 400,
      }
    );
  }

  // console.log("✅ event contracted successfully:", event.id);

  const eventType = event.type;
  if (
    eventType !== "checkout.session.completed" &&
    eventType !== "checkout.session.async_payment_succeeded"
  )
    return NextResponse.json(
      { message: "Server Error" },
      {
        status: 500,
      }
    );
  const data = event.data.object;
  const metadata = data.metadata;
  const orderId = metadata.orderId;
  const amount = data.amount_total;
  const paymentIntentId = data.payment_intent;

  // console.log(paymentIntentId, "✅ Transaction ID");
  // console.log(amount, "✅ Amount");
  // console.log(orderId, "✅ Order ID");

  const paymentData = {
    order_id: orderId,
    status: "successful",
    amount: amount / 100 || 0,
    payment_method: "stripe",
    transaction_id: paymentIntentId,
  };

  try {
    //Updating payment info of order
    const paymentUpdateResult = await postData(
      {
        api: "online-payment-status-change",
        // authorization: `Bearer ${result.payerReference}`,
        isPrivate: true,
      },
      paymentData
    );
    console.log(paymentUpdateResult, "✅ paymentUpdateResult");
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.warn(error, "❌ Order online payment update failed");
    return NextResponse.json(
      { message: "Order online payment update failed" },
      {
        status: 500,
      }
    );
  }
}
