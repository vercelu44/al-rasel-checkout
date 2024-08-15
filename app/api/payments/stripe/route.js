// API route file
import { postData } from "@/lib/post-data";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export async function POST(request) {
  const { origin: baseUrl } = new URL(request.url);
  const { orderId, newOrder, isGuestCheckout, isDeliveryChargePayment } =
    await request.json();
  let order = null;

  try {
    if (orderId) {
      //getting existing order
      const res = await fetch(`${process.env.server}/sale/details/${orderId}`, {
        headers: {
          // AmsPublickey: process.env.AMS_PUBLIC_KEY, //will be removed
          AmsPrivateKey: process.env.AMS_PRIVATE_KEY,
        },
        cache: "no-store", //this is important
      });
      order = await res.json();
      // console.log(order);
    } else {
      //creating new order
      order = await postData(
        {
          api: isGuestCheckout ? "guest-checkout" : "checkout",
          authorization: `Bearer ${bearerToken}`,
        },
        newOrder
      );
      // console.log(order);
    }

    if (!order || order?.status === false) {
      console.log(order, "order response inside stripe route");
      return NextResponse.error(
        { message: "Order Creation failed" },
        { status: 500 }
      );
    }
    // after order creation we need to initialize bkash payment
    const { sale } = order;

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
            currency: "aed",
            // If you want to charge $3.00, you multiply by 100 to convert dollars to cents: 3.00 * 100 = 300.
            unit_amount: isDeliveryChargePayment
              ? sale?.shipping?.delivery_charge * 100
              : sale.due_amount * 100,
            product_data: {
              name: isDeliveryChargePayment
                ? "Delivery Charge Payment"
                : "Order Full Payment",
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/checkout/success/${sale.id}`,
      cancel_url: `${baseUrl}/checkout/fail/${sale.id}`,
      metadata: {
        orderId: sale.id,
        // user: sale?.customer?.name,
        // email: sale?.customer?.email,
        // mobile: sale?.customer?.mobile,
        // shippingName: sale?.shipping?.name,
        // shippingPhone: sale?.shipping?.phone,
        // shippingAddress: sale?.shipping?.address,
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
