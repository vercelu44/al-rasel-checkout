import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  console.log("Yee, it's working...");
  const body = await request.text();
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = headers().get("stripe-signature");
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

  // console.log('✅ Success:', event.id);

  const eventType = event.type;
  // if (
  //   eventType !== "checkout.session.completed" &&
  //   eventType !== "checkout.session.async_payment_succeeded"
  // )
  //   return NextResponse.json(
  //     { message: "Server Error" },
  //     {
  //       status: 500,
  //     }
  //   );
  // const data = event.data.object;
  // const metadata = data.metadata;
  // const orderId = metadata.orderId;
  // const email = metadata.email;
  // const created = data.created;
  // const currency = data.currency;
  // const customerDetails = data.customer_details;
  // const amount = data.amount_total;

  // console.log(email, orderId, created, currency, "result");
  // console.log(customerDetails, amount, "result 2");

  try {
    // database update here
    // stripe webhook checkout events
    switch (event.type) {
      case "checkout.session.async_payment_failed":
        const checkoutSessionAsyncPaymentFailed = event.data.object;
        // Then define and call a function to handle the event checkout.session.async_payment_failed
        console.log("checkoutSessionAsyncPaymentFailed", checkoutSessionAsyncPaymentFailed);
        break;
      case "checkout.session.async_payment_succeeded":
        const checkoutSessionAsyncPaymentSucceeded = event.data.object;
        // Then define and call a function to handle the event checkout.session.async_payment_succeeded
        console.log("checkoutSessionAsyncPaymentSucceeded", checkoutSessionAsyncPaymentSucceeded);
        break;
      case "checkout.session.completed":
        const checkoutSessionCompleted = event.data.object;
        // Then define and call a function to handle the event checkout.session.completed
        console.log("checkoutSessionCompleted", checkoutSessionCompleted);
        break;
      case "checkout.session.expired":
        const checkoutSessionExpired = event.data.object;
        // Then define and call a function to handle the event checkout.session.expired
        console.log("checkoutSessionExpired", checkoutSessionExpired);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "something went wrong",
        ok: false,
      },
      { status: 500 }
    );
  }
}
