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
    webHookSecret !== process.env.SOUTHEST_WEBHOOK_SECRET
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
    air_ticket_id: reqData?.order?.id,
    transaction_id: reqData?.transaction?.id,
    payment_method: "southeastbank",
    amount: reqData?.transaction?.amount,
  };

  console.log(paymentData, "paymentData, line 34");

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
