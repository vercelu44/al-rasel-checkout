import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { postData } from "@/lib/post-data";
// export const dynamic = 'force-static';

export async function POST(request) {
  console.log("Inside webhook");
  const reqData = await request.json();
  console.log(reqData, "reqData, line 9");
  const webHookSecret = request.headers.get("X-Notification-Secret");
  console.log(webHookSecret, "notification secret, line 11");

  if (
    !reqData?.response?.gatewayCode !== "APPROVED" &&
    !reqData?.result !== "SUCCESS" &&
    webHookSecret !== process.env.SOUTHEAST_WEBHOOK_SECRET
  ) {
    console.log("Your failed in your exam");
    return NextResponse.json(
      { message: "Something went wrong" },
      {
        status: 401,
      }
    );
  }

  const paymentData = {
    order_id: reqData?.order?.id,
    status: "successful",
    amount: reqData?.transaction?.amount,
    payment_method: "stripe", // need to change later
    transaction_id: reqData?.transaction?.id,
  };

  console.log(paymentData, "paymentData, line 35");

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
