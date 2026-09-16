import { postData } from "@/lib/post-data";
// import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(request) {
  // This is to handle req from localhost on custom server
  const { origin: baseUrlFromRequest } = new URL(request.url);
  const nextBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || baseUrlFromRequest;

  const formData = await request.formData();
  // console.log({formData});
  const orderId = formData.get("value_a");

  // const successUrl = new URL(`/checkout/success/${orderId}`, request.url);
  return NextResponse.redirect(`${nextBaseUrl}/checkout/success/${orderId}`, {
    status: 301,
  });

  // redirect(`/checkout/success/${orderId}`);
  // return NextResponse.redirect(successUrl.href, {
  //   status: 301,
  // });
}
