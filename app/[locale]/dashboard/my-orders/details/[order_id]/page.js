"use client";
import { Link } from "@/navigation";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderTracking from "./_components/OrderTracking";
import SaleProductCard from "./_components/SaleProductCard";
import { useGetOrderByIdQuery } from "@/store/api/orderAPI";
import ItemsListLoader from "@/components/elements/loaders/ItemsListLoader";
import { getFormattedDate } from "@/utils/format-date";
import { setGlobalLoader } from "@/store/slices/commonSlice";
import handleSSLOrderPayLater from "@/lib/ssl-pay";

import { HiArrowLongLeft } from "react-icons/hi2";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { siteConfig } from "@/config/site";
import NestedPageTitle from "../../../_components/NestedPageTitle";

const OrderDetail = ({ params }) => {
	const { order_id, locale } = params;
	const { translations } = useSelector((state) => state.common);
	const { data: orderData, isLoading } = useGetOrderByIdQuery({
		order_id,
		locale,
	});
	const dispatch = useDispatch();
	const sale = orderData?.sale || {};
	const saleProducts = orderData?.saleProducts || [];

	return (
		<div className="mb-4 lg:mb-14">
			<NestedPageTitle
				title={translations["order-details"] || "Order Details"}
				href={"/dashboard/my-orders"}
				buttonText={translations["go-back"] || "Go Back"}
			/>
			<div className="content lg:mx-10 bg-slate-200 text-slate-700 mt-3 rounded-lg p-3 lg:p-5">
				<OrderTracking
					orderData={orderData}
					isLoading={isLoading}
					translations={translations}
				/>
				<div className="bg-white rounded-lg p-3 lg:p-4 mt-2 lg:mt-5">
					<h3 className="text-base/[22px] lg:text-lg/[26px] font-semibold font-title mb-4">
						{translations["products"] || "Products"}
					</h3>
					{isLoading ? (
						<ItemsListLoader numItems={2} viewBoxWidth={900} />
					) : (
						saleProducts.map((saleProduct, index) => (
							<SaleProductCard key={index} saleProduct={saleProduct} />
						))
					)}
				</div>
				<div className="bg-white rounded-lg p-3 lg:p-4 mt-2 lg:mt-5">
					<h3 className="text-base/[22px] lg:text-lg/[26px] font-semibold font-title mb-4">
						{translations["shipping-address"] || "Shipping Address"}
					</h3>
					{isLoading ? (
						<ItemsListLoader numItems={1} viewBoxWidth={900} />
					) : (
						<div className="flex gap-6">
							<div className="bg-slate-100 rounded-xl flex justify-center items-center p-5">
								<Image
									src={"/assets/icons/location/located-pin.svg"}
									height={36}
									width={36}
									className="h-9 w-9"
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
				<div className="p-4 bg-white rounded-lg mt-2 lg:mt-5">
					<h3 className="text-base/[22px] lg:text-lg/[26px] font-semibold font-title mb-4">
						{translations["payment-details"] || "Payment Details"}
					</h3>
					{isLoading ? (
						<ItemsListLoader numItems={2} noImage={true} viewBoxWidth={900} />
					) : (
						<>
							<div className="text-sm lg:text-base font-normal">
								<div className="flex-between my-2">
									<p>{translations["order-id"] || "Order ID"}</p>
									<p>{sale.invoice_no}</p>
								</div>
								<div className="flex-between my-2">
									<p>{translations["order-date"] || "Order Date"}</p>
									<p>{getFormattedDate(sale.sale_date)}</p>
								</div>

								<div className="flex-between my-2">
									<p>{translations["total"] || "Total"}</p>
									<p>
										{siteConfig.currency.sign}
										{sale.sub_total}
									</p>
								</div>
								<div className="flex-between my-2">
									<p>
										{translations["discount-amount"] || "Discount Amount"}
									</p>
									<p className="text-red-500">
										-{siteConfig.currency.sign}
										{sale.discount_amount}
									</p>
								</div>
								<div className="border-b border-slate-300 my-2"></div>
								<div className="flex-between my-2">
									<p>{translations["total-with-discount"] || "Total with discount"}</p>
									<p>
										{siteConfig.currency.sign}
										{sale.sub_total - sale.discount_amount}
									</p>
								</div>
								<div className="flex-between my-2">
									<p>{translations["delivery-charge"] || "Delivery Charge"}</p>
									<p>
										{siteConfig.currency.sign}
										{sale.shipping?.delivery_charge}
									</p>
								</div>
								<div className="border-b border-slate-900 my-2"></div>
								<div className="flex-between my-2 font-bold">
									<div className="flex gap-2">
										<span>{translations["total-payable"] || "Total Payable"}</span>
										<span
											className={`px-2 rounded-lg ${
												sale.due_amount > 0
													? "text-red-500 bg-red-100"
													: "text-green-500 bg-green-100"
											}`}
										>
											{sale.due_amount > 0
												? sale.payment_type !== "COD"
													? translations["payment-incomplete"] ||
													  "Payment Incomplete"
													: translations["due"] || "Due"
												: translations["paid"] || "Paid"}
										</span>
									</div>
									<p>
										{siteConfig.currency.sign}
										{sale.due_amount}
									</p>
								</div>
							</div>
							{sale.due_amount > 0 && sale.payment_type !== "COD" ? (
								<button
									onClick={() =>
										handleSSLOrderPayLater(sale.id, (loading) =>
											dispatch(setGlobalLoader(loading))
										)
									}
									className="w-full bg-primary py-2 px-4 mt-3 lg:mt-5 text-white rounded-lg text-center active:scale-95"
								>
									{translations["make-payment"] || "Make Payment"}
								</button>
							) : (
								<a
									target="_blank"
									href={`${process.env.serverBaseUrl}/in/${sale.customer.id}/${sale.id}/sale`}
									className="bg-slate-200 p-3 block text-center w-full  mt-3 lg:mt-5 rounded-lg"
								>
									<FaCloudDownloadAlt size={24} className="ltr:mr-2 rtl:ml-2" />
									{translations["download-invoice"] || "Download Invoice"}
								</a>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default OrderDetail;
