"use client";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import ArticleLoader from "@/components/elements/loaders/ArticleLoader";
import { getFormattedDate } from "@/utils/format-date";
const Lottie = dynamic(() => import("lottie-react"));
import successAnimation from "@/public/assets/lottie/success_2.json";
import { siteConfig } from "@/config/site";
import useOrderSummary from "@/hooks/useOrderSummary";
import { useSelector } from "react-redux";
import * as pixel from "/lib/fpixel";

const OrderSuccess = ({ params }) => {
  const { order_id } = params;
  const { order, loading, error } = useOrderSummary(order_id);
  const { settings, isFbPixelInitialized } = useSelector(
    (state) => state.common
  );
  const isGuestCheckout = !!settings?.guest_checkout;
  const flag = useRef(true);

  // Facebook Pixel Initiate Checkout Event
  useEffect(() => {
    // Check if product ID exists to avoid errors
    if (isFbPixelInitialized && flag.current && order?.id) {
      pixel.event(
        "Purchase",
        pixel.getPurchasedItemsPixelData(order.ordered_items, order.sub_total),
        {
          eventID: order.id, // to prevent duplicate events from conversations API
        }
      );
      console.log("purchase complete");
      flag.current = false;
    }
  }, [order, isFbPixelInitialized]);

  return (
    <>
      <div className="container">
        <div className="w-full md:w-[540px] mx-auto my-12 md:my-28 p-5 border border-slate-200">
          <div className="text-center font-bold">
            <div className="flex-center h-28">
              <Lottie
                animationData={successAnimation}
                className="h-full"
                loop={false}
              />
            </div>
            <h1 className="text-slate-800 text-3xl font-title">
              Order Successful!
            </h1>
            <h3 className="text-slate-800 text-2xl my-2">
              Thank you for ordering
            </h3>
          </div>
          {loading ? (
            <ArticleLoader />
          ) : (
            <div className="order-info">
              <div className="order-info bg-slate-50 px-3 py-4 m-4 border-y border-slate-200">
                <div className="flex-between my-2">
                  <p>Invoice No</p>
                  <p>#{order?.invoice_no}</p>
                </div>
                <div className="flex-between my-2">
                  <p>Date</p>
                  <p>{getFormattedDate(order?.sale_date)}</p>
                </div>
                <div className="flex-between my-2">
                  <p>Total Amount</p>
                  <p>
                    {siteConfig.currency.shortForm}
                    {order?.total_amount}
                  </p>
                </div>
                <div className="border-b border-slate-700 my-2"></div>
                <div className="flex-between my-2 font-bold">
                  <p>
                    {order?.due_amount ? (
                      <>
                        Amount Payable{" "}
                        <span className="bg-red-100 px-2 text-red-500">
                          Due
                        </span>
                      </>
                    ) : (
                      <>
                        Amount Paid{" "}
                        <span className="bg-green-100 px-2 text-green-500">
                          Paid
                        </span>
                      </>
                    )}
                  </p>
                  <p>
                    {siteConfig.currency.shortForm}
                    {order?.due_amount ? order?.due_amount : order?.paid_amount}
                  </p>
                </div>
              </div>
              <div className="actions px-4 my-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                {isGuestCheckout ? (
                  <Link
                    target="_blank"
                    href={order?.invoice_url || "#"}
                    className="border py-3 w-full px-6 text-center active:scale-95"
                    style={{
                      border: `1px solid ${settings?.colors?.default_text}`,
                      color: settings?.colors?.default_text,
                    }}
                  >
                    Download Invoice
                  </Link>
                ) : (
                  <Link
                    href={`/dashboard/my-orders/details/${order_id}`}
                    className="py-3 w-full px-6 text-center active:scale-95"
                    style={{
                      border: `1px solid ${settings?.colors?.default_text}`,
                      color: settings?.colors?.default_text,
                    }}
                  >
                    View Order
                  </Link>
                )}
                <Link
                  href={"/products?sort_type=new"}
                  className="py-3 w-full px-6 text-center active:scale-95"
                  style={{
                    background: settings?.colors?.primary,
                    border: `1px solid ${settings?.colors?.primary_text}`,
                    color: settings?.colors?.primary_text,
                  }}
                >
                  Continue shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
