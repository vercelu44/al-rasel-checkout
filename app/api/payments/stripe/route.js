// API route file
import { postData } from "@/lib/post-data";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2022-11-15',
});

export async function POST(request) {
  const { origin: baseUrl } = new URL(request.url);
  const { orderId, newOrder, isGuestCheckout, isDeliveryChargePayment } =
    await request.json();
  let order = null;

  try {
    // if (orderId) {
    //   //getting existing order
    //   const res = await fetch(`${process.env.server}/sale/details/${orderId}`, {
    //     headers: {
    //       // AmsPublickey: process.env.AMS_PUBLIC_KEY, //will be removed
    //       AmsPrivateKey: process.env.AMS_PRIVATE_KEY,
    //     },
    //     cache: "no-store", //this is important
    //   });
    //   order = await res.json();
    //   console.log(order);
    // } else {
    //   //creating new order
    //   order = await postData(
    //     {
    //       api: isGuestCheckout ? "guest-checkout" : "checkout",
    //       authorization: `Bearer ${bearerToken}`,
    //     },
    //     newOrder
    //   );
    //   // console.log(order);
    // }

    // const consumer = await stripe.customers.create({
    //   //   description: data.name,
    //   name: "Jenny Rosen",
    //   address: {
    //     line1: "510 Townsend St",
    //     postal_code: "98140",
    //     city: "San Francisco",
    //     state: "CA",
    //     country: "US",
    //   },
    // });
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      // customer: consumer.id,
      line_items: [
        {
          price_data: {
            // currency: 'usd',
            // If you want to charge $3.00, you multiply by 100 to convert dollars to cents: 3.00 * 100 = 300.
            // unit_amount: 300*100,
            currency: 'aed',
            unit_amount: 200 * 100,
            product_data: {
              name: "Test Product",
            },
          },
          // price: data.price as unknown as string, // Replace with the actual price ID from your Stripe Dashboard
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/stripe-payment/success?order_id=${orderId}`,
      cancel_url: `${baseUrl}/stripe-payment/cancel?order_id=${orderId}`,
      metadata: {
        orderId,
        email: "touhid@me.com",
      },
    });

    console.log("session created---------------------------");

    return NextResponse.json({
      sessionId: checkoutSession.id,
      status: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.error(
      { message: "Order Creation failed" },
      { status: 500 }
    );
  }
}
