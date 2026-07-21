import { NextResponse } from "next/server";
import { postData } from "@/lib/post-data";
import { verifyPayment } from "../SSLPayment";

export async function POST(request) {
  
  try {
    const formData = await request.formData();

    const status = formData.get("status");
    const orderId = formData.get("value_a"); // Order id field
    const tranId = formData.get("tran_id");
    const valId = formData.get("val_id");
    const amount = formData.get("amount");

    console.log({
      status,
      orderId,
      tranId,
      valId,
      amount,
    });
    // comment nothing


    console.log({formData});
    

    switch (status) {
      case "VALID":

        if (!valId) {
          console.error("val_id not found");
          break;
        }

        const verification = await verifyPayment(String(valId));

        console.log({verification});
        


        const isVerified =
          (verification.status === "VALID" ||
            verification.status === "VALIDATED") &&
          verification.tran_id === tranId &&
          Number(verification.amount) === Number(amount);

        if (!isVerified) {
          console.error("SSL verification failed", verification);
          break;
        }


        await postData(
          {
            api: "online-payment-status-change",
            isPrivate: true,
          },
          {
            order_id: orderId,
            status: "successful",
            amount,
            payment_method: "sslcommerz",
            transaction_id: tranId,
          }
        );

        break;

      // case "FAILED":
      //   await postData(
      //     {
      //       api: "online-payment-status-change",
      //       isPrivate: true,
      //     },
      //     {
      //       order_id: orderId,
      //       status: "failed",
      //       amount,
      //       payment_method: "sslcommerz",
      //       transaction_id: tranId,
      //     }
      //   );
      //   break;

      // case "CANCELLED":
      //   await postData(
      //     {
      //       api: "online-payment-status-change",
      //       isPrivate: true,
      //     },
      //     {
      //       order_id: orderId,
      //       status: "cancelled",
      //       amount,
      //       payment_method: "sslcommerz",
      //       transaction_id: tranId,
      //     }
      //   );
      //   break;

      default:
        console.log("Unknown SSL Status:", status);
    }

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "IPN Error",
      },
      {
        status: 500,
      }
    );
  }
}