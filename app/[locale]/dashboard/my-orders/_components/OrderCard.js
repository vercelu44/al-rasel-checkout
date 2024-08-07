"use client";
import { Link } from "@/navigation";
import React, { useState } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { HiArrowLongRight } from "react-icons/hi2";
import orderFilterKeys from "./OrderFilterKeys";
import { getFormattedDate } from "@/utils/format-date";
import { siteConfig } from "@/config/site";
import PaymentModal from "@/components/modals/PaymentModal";

function OrderCard({ order, translations = {} }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const {
    id,
    invoice_no,
    sale_date,
    status,
    total_amount,
    due_amount,
    shipping,
    total_product,
    payment_type,
  } = order;

  const getOrderStatus = (status) => {
    let statusElement = <span className="rounded-lg px-2 py-1">{status}</span>;
    switch (status) {
      case orderFilterKeys.pending:
        statusElement = (
          <span className="rounded-lg px-1 py-[2px] bg-yellow-500">
            {translations["pending"] || "Pending"}
          </span>
        );
        break;
      case orderFilterKeys.processing:
        statusElement = (
          <span className="rounded-lg px-1 py-[2px] bg-lime-500">
            {translations["processing"] || "Processing"}
          </span>
        );
        break;
      case orderFilterKeys.confirmed:
        statusElement = (
          <span className="rounded-lg px-1 py-[2px] bg-secondary-700">
            {translations["confirmed"] || "Confirmed"}
          </span>
        );
        break;
      case orderFilterKeys.inDeliver:
        statusElement = (
          <span className="rounded-lg px-1 py-[2px] bg-blue-500">
            {translations["on-delivery"] || "On Delivery"}
          </span>
        );
        break;
      case orderFilterKeys.complete:
        statusElement = (
          <span className="rounded-lg px-1 py-[2px] bg-green-500">
            {translations["complete"] || "Complete"}
          </span>
        );
        break;
      case orderFilterKeys.cancelled:
        statusElement = (
          <span className="rounded-lg px-1 py-[2px] bg-red-500">
            {translations["cancel"] || "Cancelled"}
          </span>
        );
        break;
    }
    return statusElement;
  };

  return (
    <>
      <div className="text-slate-900 rounded-xl bg-slate-100 border border-slate-100 hover:border hover:border-primary mt-3">
        <div className="lg:hidden p-3 flex-between col-span-2">
          <h3>{getFormattedDate(sale_date)}</h3>
          <h3>{invoice_no}</h3>
        </div>
        <div className="bg-slate-50 p-3 lg:p-4 rounded-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 justify-between">
            <div className="hidden lg:block">
              <h3 className="text-slate-500 mb-3">
                {translations["date"] || "Date"}
              </h3>
              <h3>{getFormattedDate(sale_date)}</h3>
            </div>
            <div className="hidden lg:block">
              <h3 className="text-slate-500 mb-3">
                {translations["order-id"] || "Order ID"}
              </h3>
              <h3>{invoice_no}</h3>
            </div>

            <div>
              <h3 className="text-slate-500 mb-3">
                {translations["total-amount"] || "Total Amount"}
              </h3>
              <h3 className="">
                {siteConfig.currency.sign} {total_amount || "Invalid"}{" "}
                <span
                  className={` ${
                    due_amount > 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {due_amount > 0
                    ? payment_type !== "COD"
                      ? translations["payment-incomplete"] ||
                        "Payment Incomplete"
                      : translations["due"] || "Due"
                    : translations["paid"] || "Paid"}
                </span>
              </h3>
            </div>
            {due_amount > 0 && payment_type !== "COD" ? (
              <div className="text-right">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="inline-block bg-primary py-2 px-4 text-white rounded-lg text-center active:scale-95"
                >
                  {translations["make-payment"] || "Make Payment"}
                </button>
              </div>
            ) : (
              <div className="text-right">
                <h3 className="text-white mb-3 mt-[3px]">
                  {getOrderStatus(status)}
                </h3>
                <h3>
                  {total_product} {translations["items"] || "Items"}
                </h3>
              </div>
            )}
          </div>
          <div className="border-t border-slate-200 flex justify-between items-center pt-2 mt-2 lg:mt-3">
            <h3>
              <HiLocationMarker className="text-red-500" /> {shipping?.address}
            </h3>
            <Link
              href={`/dashboard/my-orders/details/${id}`}
              className="text-slate-500 hover:text-primary"
            >
              {translations["see-details"] || "See Details"}{" "}
              <HiArrowLongRight className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
      {selectedOrder && (
        <PaymentModal
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
      )}
    </>
  );
}

export default OrderCard;
