import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { postData } from "@/lib/post-data";
// export const dynamic = 'force-static';

export async function POST(request) {
  console.log("Inside webhook");
  // const body = await request.text();
  // console.log(body, "boy request text.. line 9")

  const something = await request.json();
  console.log(something, "something, line 12")
  // const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  // const sig = headers().get("stripe-signature");
  const notificationsSecret = request.headers.get("X-Notification-Secret");
  console.log(notificationsSecret, 'notification secret, line 16')

  if(something) {
    console.log("inside something");
    console.log(something?.merchant, "something merchant, line 20");
    console.log(something?.response?.gatewayCode, "something response, line 21");
  }

  let event;
  // try {
  //   event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  // } catch (err) {
  //   return NextResponse.json(
  //     { message: `Webhook Error: ${err}` },
  //     {
  //       status: 400,
  //     }
  //   );
  // }

  // console.log("✅ event contracted successfully:", event.id);

  const eventType = event?.type;
  if (
    eventType !== "checkout.session.completed" &&
    eventType !== "checkout.session.async_payment_succeeded"
  )
    return NextResponse.json(
      { message: "Test success by touhid" },
      {
        status: 200,
      }
    );
  const data = event.data.object;
  const metadata = data.metadata;
  const orderId = metadata.orderId;
  const amount = data.amount_total;
  const paymentIntentId = data.payment_intent;

  const paymentData = {
    air_ticket_id: orderId,
    transaction_id: paymentIntentId,
    payment_method: "southeastbank",
    amount: amount / 100 || 0,
  };

  try {
    //Updating payment info of order
    const paymentUpdateResult = await postData(
      {
        api: "air-ticket/online-payment-status-change",
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
