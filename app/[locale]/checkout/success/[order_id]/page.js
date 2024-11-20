"use client";
import { Link } from "@/navigation";
import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { FaCheck } from "react-icons/fa";
import ArticleLoader from "@/components/elements/loaders/ArticleLoader";
import { getFormattedDate } from "@/utils/format-date";
const Lottie = dynamic(() => import("lottie-react"));
import confetti from "@/public/assets/lottie/confetti.json";
import { siteConfig } from "@/config/site";
import useOrderSummary from "@/hooks/useOrderSummary";
import { useSelector } from "react-redux";
import * as pixel from "/lib/fpixel";
import { getPaymentLabel } from "@/lib/order";

const OrderSuccess = ({ params }) => {
	const { order_id } = params;
	const { translations, settings, isFbPixelInitialized } = useSelector(
		(state) => state.common
	);
	const { order, loading, error } = useOrderSummary(order_id);
	const isGuestCheckout = !!settings?.guest_checkout;

	// Meta Pixel Purchase Event Section
	const flag = useRef(true);
	useEffect(() => {
		// Check if product ID exists to avoid errors
		if (isFbPixelInitialized && flag.current && order?.id) {
			pixel.event(
				"Purchase",
				pixel.getPurchasedItemsPixelData(order.ordered_items, order.sub_total)
			);
			console.log("purchase complete");
			flag.current = false;
		}
	}, [order, isFbPixelInitialized]);

	return (
		<div className="container min-h-[600px]">
			<div className="w-full lg:w-[540px] mx-auto my-6 lg:my-12 py-6 lg:p-5 rounded-lg">
				{!loading && (
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
							{translations["order-success-msg"] || "Order Placed Successfully"}
						</h1>
						<h3 className="text-slate-800 text-base lg:text-2xl my-3">
							{translations["order-thank-msg"] || "Thank you for your order"}
						</h3>
					</div>
				)}
				{loading ? (
					<ArticleLoader />
				) : (
					<div className="order-info">
						<div className="order-info bg-slate-50 p-4 my-4 rounded-lg">
							<div className="flex-between my-2">
								<p>{translations["order-id"] || "Order ID"}</p>
								<p>#{order?.invoice_no}</p>
							</div>
							<div className="flex-between my-2">
								<p>{translations["order-date"] || "Order Date"}</p>
								<p>{getFormattedDate(order?.sale_date)}</p>
							</div>
							<div className="flex-between my-2">
								<p>{translations["total-amount"] || "Total Amount"}</p>
								<p>
									{siteConfig.currency.sign} {order?.total_amount}
								</p>
							</div>
							{/* <div className="border-b border-slate-700 my-2"></div> */}
							{/* <div className="flex-between my-2 font-bold">
								<p>
									{translations["amount-payable"] || "Amount Payable"}{" "}
									{getPaymentLabel(
										order.due_amount,
										order.total_amount,
										order.payment_type
									)}
								</p>
								<p>
									{siteConfig.currency.sign} {order?.due_amount}
								</p>
							</div> */}
						</div>
						<div className="actions my-6 flex gap-3 lg:gap-4 justify-between items-center">
							{isGuestCheckout ? (
								<Link
									target="_blank"
									// href={`${process.env.serverBaseUrl}/in/${order?.customer?.id}/${order?.id}/sale`}
									href={order?.invoice_url || "#"}
									className="border border-primary rounded-lg w-full p-[11px] text-center active:scale-95"
								>
									{translations["download-invoice"] || "Download Invoice"}
								</Link>
							) : (
								<Link
									href={`/dashboard/my-orders/details/${order_id}`}
									className="bg-secondary-700 p-3 w-full text-white rounded-lg text-center active:scale-95"
								>
									{translations["track-order"] || "Track Order"}
								</Link>
							)}
							<Link
								href={"/products"}
								className="bg-primary p-3 w-full text-white rounded-lg text-center active:scale-95"
							>
								{translations["shop-more"] || "Shop More"}
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default OrderSuccess;