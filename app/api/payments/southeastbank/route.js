import { postData } from "@/lib/post-data";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { origin: baseUrl } = new URL(request.url);
  const { data } = await request.json();
  const headersList = headers();

  // Encoding Username and Password for Basic Authorization
  const username = `merchant.${process.env.SOUTHEST_MERCHANT_ID}`; // Replace with actual username
  const password = process.env.SOUTHEST_API_PASS; // Replace with actual password
  const authString = `${username}:${password}`;
  const encodedAuth = Buffer.from(authString).toString("base64");

  let order = null;

  try {
    // console.log(data, "...................");

    order = await postData(
      {
        api: "air-ticket",
      },
      data
    );

    // console.log(order);

    if (order) {
      const paymentData = {
        apiOperation: "INITIATE_CHECKOUT",
        checkoutMode: "WEBSITE",
        interaction: {
          operation: "PURCHASE",
          merchant: {
            name: "Online Markets bd",
            url: "https://akaarit.com",
          },
          returnUrl: `${baseUrl}/flights-ticket-booking?success=true`,
        },
        order: {
          currency: "BDT",
          amount: `${order?.data?.due}`,
          id: `${order?.data?.id}`,
          description: `${order?.data?.name}`,
        },
      };

      const API = `https://${process.env.SOUTHEST_HOST}/api/rest/version/llaatteesstt/merchant/${process.env.SOUTHEST_MERCHANT_ID}/session`;

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
        data: paymentResData,
        status: true,
      });
    } else {
      return NextResponse.error(
        { message: "Order Creation failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.error(
      { message: "Order Creation failed" },
      { status: 500 }
    );
  }
}
