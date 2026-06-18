"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import NoItems from "../_components/NoItems";
import { getFormattedDate } from "@/utils/format-date";
import PaymentModal from "@/components/modals/PaymentModal";
import { useGetOrdersQuery } from "@/store/api/orderAPI";
import ItemsListLoader from "@/components/elements/loaders/ItemsListLoader";
import { MdOutlinePageview } from "react-icons/md";
import { siteConfig } from "@/config/site";

const MyOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { data: ordersData, isLoading } = useGetOrdersQuery();
  const { settings, translations } = useSelector((state) => state.common);
  const myOrders = ordersData?.data || [];
  // console.log(myOrders);
  return (
    <>
      <div className="py-6 md:px-10 px-3">
        <h2 className="text-slate-600 text-2xl text-center md:text-start">
          {translations["recent-order-history"] || "Recent Order History"}
        </h2>

        {isLoading ? (
          <div className="py-4">
            <ItemsListLoader
              itemHeight={110}
              numItems={2}
              noImage={true}
              viewBoxWidth={900}
            />
          </div>
        ) : myOrders.length ? (
          <div className="py-3">
            <div class="flex flex-col">
              <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div class="overflow-hidden">
                    <table class="min-w-full border text-center text-sm font-light">
                      <thead
                        class="border-b font-medium"
                        style={{
                          backgroundColor: settings?.colors?.primary,
                          color: settings?.colors?.primary_text,
                        }}
                      >
                        <tr>
                          <th scope="col" class="border-r px-6 py-3">
                            {translations["sl"] || "SL"}
                          </th>
                          <th scope="col" class="border-r px-6 py-3">
                            {translations["invoice_no"] || "Invoice_No"}
                          </th>
                          <th scope="col" class="border-r px-6 py-3">
                            {translations["date"] || "Date"}
                          </th>
                          <th scope="col" class="border-r px-6 py-3">
                            {translations["status"] || "Status"}
                          </th>
                          <th
                            scope="col"
                            class="border-r px-6 py-3 hidden 2xl:block"
                          >
                            {translations["total"] || "Total Amount"}
                          </th>
                          <th scope="col" class="border-r px-6 py-3">
                            {translations["payment-type"] || "Payment Type"}
                          </th>
                          <th scope="col" class="border-r px-6 py-3">
                            {translations["actions"] || "Actions"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {myOrders.map((order, index) => (
                          <tr key={index} class="border-b">
                            <td class="whitespace-nowrap border-r px-6 py-4 font-medium">
                              {index + 1}
                            </td>
                            <td class="whitespace-nowrap border-r px-6 py-4">
                              <Link
                                href={`/dashboard/my-orders/details/${order.id}`}
                                className="text-secondary"
                              >
                                <MdOutlinePageview size={20} /> #
                                {order.invoice_no}
                              </Link>
                            </td>
                            <td class="whitespace-nowrap border-r px-6 py-4">
                              {getFormattedDate(order.sale_date)}
                            </td>
                            <td class="whitespace-nowrap border-r px-6 py-4">
                              {order.status === "Delivery"
                                ? "Product on the way to shipment"
                                : order.status}
                            </td>
                            <td class="whitespace-nowrap border-r px-6 py-4 hidden 2xl:block">
								{siteConfig.currency.shortForm}
                              {order.total_amount}
                            </td>
                            <td className="whitespace-nowrap border-r px-6 py-4">
                              {order.payment_type === "COD" &&
                                "Cash on Delivery"}
                              {order.payment_type !== "COD" && (
                                <>
                                  {order.due_amount !== order.total_amount &&
                                    order.due_amount > 0 && (
                                      <p>
                                        Online{" "}
                                        <span className="text-yellow-500 text-xs">
                                          (Deliver Charge Paid)
                                        </span>
                                      </p>
                                    )}
                                  {order.due_amount === order.total_amount && (
                                    <p>
                                      Online{" "}
                                      <span className="text-red-500 text-xs">
                                        (Payment Incomplete)
                                      </span>
                                    </p>
                                  )}
                                  {!order.due_amount && (
                                    <p>
                                      Online{" "}
                                      <span className="text-green-500 text-xs">
                                        (Paid)
                                      </span>
                                    </p>
                                  )}
                                </>
                              )}
                            </td>
                            <td>
                              <button
                                disabled={
                                  order.payment_type === "COD" ||
                                  !order.due_amount
                                }
                                onClick={() => setSelectedOrder(order)}
                                className="disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed bg-secondary text-white px-4 py-2 rounded-md"
                              >
                                Pay Now
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <NoItems title={"No Orders"} />
        )}
      </div>
      {selectedOrder && (
        <PaymentModal
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
      )}
    </>
  );
};

export default MyOrders;
