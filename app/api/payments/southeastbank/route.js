import { postData } from "@/lib/post-data";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request) {
  const { origin: baseUrl } = new URL(request.url);
  const { orderId, newOrder, isGuestCheckout, isDeliveryChargePayment } =
    await request.json();
  const headersList = headers();
  const bearerToken = headersList.get("authorization");
  let order = null;

  // Encoding Username and Password for Basic Authorization
  const username = `merchant.${process.env.SOUTHEAST_MERCHANT_ID}`; // Replace with actual username
  const password = process.env.SOUTHEAST_API_PASS; // Replace with actual password
  const authString = `${username}:${password}`;
  const encodedAuth = Buffer.from(authString).toString("base64");

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

    const paymentData = {
      apiOperation: "INITIATE_CHECKOUT",
      checkoutMode: "WEBSITE",
      interaction: {
        operation: "PURCHASE",
        merchant: {
          name: "Online Markets bd",
          url: baseUrl,
        },
        returnUrl: `${baseUrl}/checkout/success/${sale.id}`,
      },
      order: {
        currency: process.env.SOUTHEAST_CURRENCY,
        amount: `${
          isDeliveryChargePayment
            ? sale?.shipping?.delivery_charge
            : sale.due_amount
        }`,
        id: `${sale.id}`,
        description: `${
          isDeliveryChargePayment
            ? "Delivery Charge Payment"
            : "Order Full Payment"
        }`,
      },
    };

    const API = `${process.env.SOUTHEAST_HOST}/api/rest/version/llaatteesstt/merchant/${process.env.SOUTHEAST_MERCHANT_ID}/session`;

    // console.log(API);

    const result = await fetch(API, {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedAuth}`, // Adding Basic Auth header
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });
    const paymentResData = await result.json();

    // console.log("working...................");
    // console.log(data);

    return NextResponse.json({
      southeastSession: paymentResData?.session,
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
