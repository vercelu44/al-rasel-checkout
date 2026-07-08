"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { FaCloudDownloadAlt } from "react-icons/fa";
import SaleProductCard from "./_components/SaleProductCard";
import { useGetOrderByIdQuery } from "@/store/api/orderAPI";
import ItemsListLoader from "@/components/elements/loaders/ItemsListLoader";
import { getFormattedDate } from "@/utils/format-date";

import locationImage from "@/public/assets/images/locationImage.png";
import { siteConfig } from "@/config/site";
import PaymentModal from "@/components/modals/PaymentModal";
import { HiArrowLongLeft } from "react-icons/hi2";
import OrderTracking from "./_components/OrderTracking";
import Cancelled from "./_components/Cancelled";
import OnHold from "./_components/OnHold";
import OrderTrackingStep from "./_components/OrderStatus";

const OrderDetail = ({ params }) => {
  const { order_id, locale } = params;
  const { settings } = useSelector((state) => state.common);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { translations } = useSelector((state) => state.common);
  const { data: orderData, isLoading } = useGetOrderByIdQuery({
    order_id,
    locale,
  });
  const sale = orderData?.sale || {};
  const saleProducts = orderData?.saleProducts || [];
  const status = sale.status;


  return (
    <>
      <div className="px-3 md:px-10 py-3 md:py-6">
        <div className="">
          <Link
            href={"/dashboard/my-orders"}
            className="icon-btn py-3 hover:text-primary capitalize text-lg md:text-2xl"
          >
            <HiArrowLongLeft className="mr-r" />
            Order View
          </Link>
        </div>
        <div className="content text-slate-700">
          {status === "On Hold" ? (
            <OnHold />
          ) : status === "Cancelled" ? (
            <Cancelled />
          ) : (
            <>
              <OrderTrackingStep translations={translations} orderData={orderData} />
              <OrderTracking
                orderData={orderData}
                isLoading={isLoading}
                translations={translations}
              />
            </>
          )}

          <div className="bg-white py-4 md:mt-5">
            <h3 className="text-xl font-bold font-title mb-4">Products</h3>
            {isLoading ? (
              <ItemsListLoader numItems={2} viewBoxWidth={900} />
            ) : (
              saleProducts.map((saleProduct, index) => (
                <SaleProductCard key={index} saleProduct={saleProduct} />
              ))
            )}
          </div>
          <div className="bg-white py-4 mt-5">
            <h3 className="text-xl font-bold font-title mb-4">
              Shipping Address
            </h3>
            {isLoading ? (
              <ItemsListLoader numItems={1} viewBoxWidth={900} />
            ) : (
              <div className="flex gap-6">
                <div className="bg-slate-100 flex justify-center items-center h-16 w-16 p-2">
                  <Image
                    src={locationImage}
                    height={64}
                    width={64}
                    className="h-14 w-14"
                    alt="location-icon"
                  />
                </div>
                <div>
                  <h4 className="font-bold">{sale?.shipping?.name}</h4>
                  <p>{sale?.shipping?.phone}</p>
                  <p>{sale?.shipping?.address}</p>
                </div>
              </div>
            )}
          </div>
          <div className="py-4 bg-white mt-5">
            <h3 className="text-xl font-bold font-title mb-4">
              Payment Information
            </h3>
            {isLoading ? (
              <ItemsListLoader numItems={2} noImage={true} viewBoxWidth={900} />
            ) : (
              <>
                <div className="flex-between my-2">
                  <p>Invoice No</p>
                  <p>{sale.invoice_no}</p>
                </div>
                <div className="flex-between my-2">
                  <p>Date</p>
                  <p>{getFormattedDate(sale.sale_date)}</p>
                </div>

                <div className="flex-between my-2">
                  <p>Total</p>
                  <p>
                    {siteConfig.currency.shortForm}
                    {sale.sub_total}
                  </p>
                </div>
                <div className="flex-between my-2">
                  <p>Discount Amount</p>
                  <p className="text-red-500">
                    -{siteConfig.currency.shortForm}
                    {sale.discount_amount}
                  </p>
                </div>
                <div className="border-b border-slate-300 my-2"></div>
                <div className="flex-between my-2">
                  <p>Total with Discount</p>
                  <p>
                    {siteConfig.currency.shortForm}
                    {sale.sub_total - sale.discount_amount}
                  </p>
                </div>
                <div className="flex-between my-2">
                  <p>
                    Delivery Charge{" "}
                    {sale.due_amount !== sale?.total_amount &&
                      sale.due_amount !== 0 && (
                        <span className={`px-2 text-green-500 bg-green-100`}>
                          Paid
                        </span>
                      )}
                  </p>
                  <p>
                    {siteConfig.currency.shortForm}
                    {sale.shipping?.delivery_charge}
                  </p>
                </div>
                <div className="flex-between my-2">
                  <p>Grand Total</p>
                  <p>
                    {siteConfig.currency.shortForm}
                    {sale.total_amount}
                  </p>
                </div>
                <div className="border-b border-slate-900 my-2"></div>
                <div className="flex-between my-2 font-bold">
                  <p>
                    {sale.due_amount > 0 ? "Amount Payable" : "Amount Paid"}{" "}
                    <span
                      className={`px-2 ${
                        sale.due_amount > 0
                          ? "text-red-500 bg-red-100"
                          : "text-green-500 bg-green-100"
                      }`}
                    >
                      {sale.due_amount > 0
                        ? sale.payment_type !== "COD"
                          ? "Due"
                          : "COD"
                        : "Paid"}
                    </span>
                  </p>
                  <p>
                    {siteConfig.currency.shortForm}
                    {sale.due_amount ? sale.due_amount : sale.paid_amount}
                  </p>
                </div>
                <div className="actions mt-5 md:mt-14 flex justify-center  items-center">
                  {sale.due_amount > 0 && sale.payment_type !== "COD" ? (
                    <button
                      onClick={() => setSelectedOrder(sale)}
                      className="bg-secondary text-white px-4 py-2 rounded-md active:scale-95"
                    >
                      Make Payment
                    </button>
                  ) : (
                    <a
                      target="_blank"
                      href={sale?.invoice_url || "#"}
                      className="p-3 block text-center mb-3 mt-5"
                      style={{
                        border: `1px solid ${settings?.colors?.default_text}`,
                        color: settings?.colors?.default_text,
                      }}
                    >
                      <FaCloudDownloadAlt size={24} className="mr-2" /> Download
                      Invoice
                    </a>
                  )}
                </div>
              </>
            )}
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
};

export default OrderDetail;
