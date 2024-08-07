// import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { searchParams, origin } = new URL(request.url);
  const orderId = searchParams.get("order");
  // redirect(`/checkout/fail/${orderId}`);

  // const failUrl = new URL(`/checkout/fail/${orderId}`, request.url);
  return NextResponse.redirect(`${origin}/checkout/fail/${orderId}`, {
    status: 301,
  });
}
