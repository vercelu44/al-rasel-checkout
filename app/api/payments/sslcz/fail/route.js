// import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(request) {
  // This is to handle req from localhost on custom server
  const { searchParams, origin: baseUrlFromRequest } = new URL(request.url);
  const nextBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || baseUrlFromRequest;

  const orderId = searchParams.get("order");
  // redirect(`/checkout/fail/${orderId}`);

  // const failUrl = new URL(`/checkout/fail/${orderId}`, request.url);
  return NextResponse.redirect(`${nextBaseUrl}/checkout/fail/${orderId}`, {
    status: 301,
  });
}
