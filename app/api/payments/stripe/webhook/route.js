import Stripe from "stripe";
import { NextResponse } from "next/server";
import { postData } from "@/lib/post-data";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  console.log("Inside webhook");

  const body = await request.text();
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const sig = request.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);

    return NextResponse.json(
      {
        message: `Webhook Error: ${err.message}`,
      },
      {
        status: 400,
      }
    );
  }


  // console.log({event});
  

  try {
    switch (event.type) {

      // checkout.session.completed  this status for CARD payment
      // checkout.session.async_payment_succeeded for Sub payment method like (Bank account, mobile Banking)
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const data = event.data.object;

        const orderId = data.metadata?.orderId;
        const amount = data.amount_total;
        const paymentIntentId = data.payment_intent;

        const paymentData = {
          order_id: orderId,
          status: "successful",
          amount: (amount || 0) / 100,
          payment_method: "stripe",
          transaction_id: paymentIntentId,
        };

        // console.log({paymentData});
        

        const paymentUpdateResult = await postData(
          {
            api: "online-payment-status-change",
            isPrivate: true,
          },
          paymentData
        );

        console.log("Payment Updated:", paymentUpdateResult);

        break;
      }

      default:
        console.log(`Ignoring event: ${event.type}`);
        break;
    }

    // Allowes return success response
    return NextResponse.json(
      {
        received: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Webhook processing failed:", error);

    return NextResponse.json(
      {
        message: "Webhook processing failed",
      },
      {
        status: 500,
      }
    );
  }
}
