"use client";
import { useTrackOrderQuery } from "@/store/api/orderAPI";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { TbFileInvoice } from "react-icons/tb";
import { useSelector } from "react-redux";
import OnHold from "../dashboard/my-orders/details/[order_id]/_components/OnHold";
import Cancelled from "../dashboard/my-orders/details/[order_id]/_components/Cancelled";
import OrderTrackingStep from "../dashboard/my-orders/details/[order_id]/_components/OrderStatus";
import OrderTracking from "../dashboard/my-orders/details/[order_id]/_components/OrderTracking";

const TrackOrderPage = () => {
  const { settings, translations } = useSelector((state) => state.common);

  const [invoiceNo, setInvoiceNo] = useState("");
  const [searchInvoice, setSearchInvoice] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // inline re-search (jokhon result view a thakben)
  const [reSearchInvoice, setReSearchInvoice] = useState("");
  const [showReSearch, setShowReSearch] = useState(false);

  const { data, isFetching, isLoading, isError, error } = useTrackOrderQuery(
    searchInvoice,
    {
      skip: !searchInvoice,
    },
  );

  const order = data?.data || data;
  const orderData = data;
  const sale = order?.sale;
  const status = sale?.status || ''; 
  

  const handleTrack = () => {
    setErrorMsg("");

    if (!invoiceNo.trim()) {
      setErrorMsg("অনুগ্রহ করে ইনভয়েস আইডি লিখুন");
      return;
    }

    setSearchInvoice(invoiceNo.trim());
  };


  // result view er vetorei notun invoice diye search
  const handleReSearch = () => {
    if (!reSearchInvoice.trim()) return;

    setInvoiceNo(reSearchInvoice.trim());
    setSearchInvoice(reSearchInvoice.trim());
    setShowReSearch(false);
    setReSearchInvoice("");
  };

  return (
    <div className=" bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl my-10 bg-white rounded-2xl overflow-hidden">
        {!order ? (
          /* ================= DEFAULT DESIGN (Search Form) ================= */
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Side */}
            <div
              className="relative flex flex-col items-center justify-center px-8 py-12 overflow-hidden"
              // style={{
              //   backgroundColor: settings?.colors?.primary,
              //   color: settings?.colors?.primary_text,
              // }}
            >
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-pink-400/40 rounded-full"></div>

              <div className="relative z-10 text-center">
                <h2 className="text-3xl font-bold mb-3">Track Your Order</h2>
                <p className="text-sm leading-6  max-w-xs mx-auto mb-10">
                  যেকোনো সময় আপনার অর্ডার কোথায় আছে এবং কখন পৌঁছাবে তা সহজেই
                  জানতে পারবেন।
                </p>
                <div className="flex justify-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/9422/9422848.png"
                    alt="Order"
                    className="w-48 md:w-56 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="px-6 md:px-10 py-8 md:py-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                অর্ডার স্ট্যাটাস
              </h3>
              <p className="text-sm text-slate-500 leading-6 mb-8">
                ট্র্যাক করতে আপনার ইন্সভয়েস আইডি দিয়ে
                খুঁজে দেখুন।
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ইন্সভয়েস আইডি
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <TbFileInvoice />
                    </span>
                    <input
                      type="text"
                      value={invoiceNo}
                      onChange={(e) => setInvoiceNo(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                      placeholder="IN-10000000"
                      className="w-full h-12 rounded-lg border border-slate-200 pl-11 pr-4 outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                {(errorMsg || isError) && (
                  <p className="text-sm text-red-500 -mt-2">
                    {errorMsg ||
                      error?.data?.message ||
                      "এই ইনভয়েস আইডি দিয়ে কোনো অর্ডার পাওয়া যায়নি"}
                  </p>
                )}

                <button
                  onClick={handleTrack}
                  disabled={isFetching}
                  className="w-full h-12 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition  shadow-md disabled:opacity-60"
                >
                  {isFetching ? "খুঁজছি..." : "ট্র্যাক করুন"}
                  {!isFetching && <FiSearch className="ml-2" />}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ================= RESULT DESIGN (After Data Fetched) ================= */
          <div className="px-6 md:px-10 py-8 md:py-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-6 gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Order Invoice: {sale.invoice_no || order.id}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Current Status:{" "}
                  <span className="font-medium text-slate-800 bg-gray-100 px-3 py-0.5 rounded-full text-sm">{status}</span>
                </p>
              </div>

              <button
                onClick={() => setShowReSearch((prev) => !prev)}
                className="text-sm text-pink-600 font-medium hover:underline whitespace-nowrap"
              >
                {showReSearch ? "Stop Search" : "New Search"}
              </button>
            </div>

            {/* Inline Re-Search Box */}
            {showReSearch && (
              <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Search with a different invoice ID.
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <TbFileInvoice />
                    </span>
                    <input
                      type="text"
                      value={reSearchInvoice}
                      onChange={(e) => setReSearchInvoice(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleReSearch()}
                      placeholder="IN-10000000"
                      autoFocus
                      className="w-full h-11 rounded-lg border border-slate-200 pl-11 pr-4 outline-none focus:border-pink-500"
                    />
                  </div>
                  <button
                    onClick={handleReSearch}
                    disabled={isFetching}
                    className="h-11 px-5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition flex items-center gap-2 disabled:opacity-60"
                  >
                    <FiSearch />
                  </button>
                </div>
              </div>
            )}

            {(errorMsg || isError) && (
              <p className="text-sm text-red-500 text-center py-2 bg-red-50 rounded-md my-2">
                {error?.data?.message ||
                  "No order found with this invoice ID."}
              </p>
            )}

            <div className="content text-slate-700">
              {status === "On Hold" ? (
                <OnHold />
              ) : status === "Cancelled" ? (
                <Cancelled />
              ) : (
                <>
                  <OrderTrackingStep
                    translations={translations}
                    orderData={orderData}
                  />
                  <OrderTracking
                    orderData={orderData}
                    isLoading={isLoading}
                    translations={translations}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
