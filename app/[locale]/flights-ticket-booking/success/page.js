"use client";
import { Link } from "@/navigation";
import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { FaCheck } from "react-icons/fa";
import ArticleLoader from "@/components/elements/loaders/ArticleLoader";
const Lottie = dynamic(() => import("lottie-react"));
import confetti from "@/public/assets/lottie/confetti.json";
import { FaLocationArrow } from "react-icons/fa";

const OrderSuccess = () => {
  // Static Data
  const order = {
    invoice_no: "TKT123456",
    sale_date: "2024-09-25",
    total_amount: "500.00",
    due_amount: "0.00",
    payment_type: "Credit Card",
    customer: {
      id: "CUST123",
    },
  };
  const isGuestCheckout = false;
  const translations = {
    "order-success-msg": "Ticket Purchase Successful",
    "order-thank-msg": "Thank you for purchasing your air ticket",
    "order-id": "Ticket ID",
    "order-date": "Purchase Date",
    "total-amount": "Total Amount",
    "amount-payable": "Amount Paid",
    "download-invoice": "Download Ticket",
    "track-order": "View Booking",
    "shop-more": "Book Another Flight",
  };

  return (
    <div className="container min-h-[600px]">
      <div className="w-full lg:w-[540px] mx-auto my-6 lg:my-12 py-6 lg:p-5 rounded-lg">
        <div className="text-center font-bold">
          <div className="relative flex-center my-4">
            <div className="p-3 bg-green-100 rounded-[100%]">
              <div className="bg-green-500 rounded-[100%] p-5 w-20">
                <FaCheck className="text-white" size={36} />
              </div>
            </div>
            <div className="absolute">
              <Lottie animationData={confetti} loop={true} />
            </div>
          </div>
          <h1 className="text-green-500 text-2xl lg:text-3xl font-title">
            {translations["order-success-msg"]}
          </h1>
          <h3 className="text-slate-800 text-base lg:text-2xl my-3">
            {translations["order-thank-msg"]}
          </h3>
        </div>

        <div className="order-info bg-slate-50 p-4 my-4 rounded-lg">
          <div className="flex-between my-2">
            <p>{translations["order-id"]}</p>
            <p>#{order.invoice_no}</p>
          </div>
          <div className="flex-between my-2">
            <p>{translations["order-date"]}</p>
            <p>{order.sale_date}</p>
          </div>
          <div className="flex-between my-2">
            <p>{translations["total-amount"]}</p>
            <p>$ {order.total_amount}</p>
          </div>
          <div className="border-b border-slate-700 my-2"></div>
          <div className="flex-between my-2 font-bold">
            <p>{translations["amount-payable"]}</p>
            <p>$ {order.due_amount}</p>
          </div>
        </div>

        <div className="actions my-6 flex gap-3 lg:gap-4 justify-between items-center">
          <Link
            href={"/flights-ticket-booking"}
            className="bg-green-500 p-3 w-full text-white rounded-lg text-center active:scale-95 space-x-2"
          >
            <span>Book Another Flight</span> <FaLocationArrow />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
