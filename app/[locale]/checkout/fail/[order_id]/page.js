"use client";
import React, { useState } from "react";
import { Link } from "@/navigation";
import { useSelector } from "react-redux";
import ArticleLoader from "@/components/elements/loaders/ArticleLoader";
import { ImWarning } from "react-icons/im";
import { siteConfig } from "@/config/site";
import useOrderSummary from "@/hooks/useOrderSummary";
import PaymentModal from "@/components/modals/PaymentModal";

const PaymentFail = ({ params }) => {
	const { order_id } = params;
	const [selectedOrder, setSelectedOrder] = useState(null);
	const { translations, settings } = useSelector((state) => state.common);
	const { order, loading, error } = useOrderSummary(order_id);
	const isGuestCheckout = !!settings?.guest_checkout;

	return (
		<>
			<div className="container min-h-[600px]">
				<div className="w-full lg:w-[540px] mx-auto my-12 py-6 lg:p-5 rounded-lg font-title">
					{!loading && (
						<div className="text-center">
							<div className="flex-center my-3">
								<div className="p-3 bg-red-100 rounded-[100%]">
									<div className="text-red-500 rounded-[100%] p-5 w-20">
										<ImWarning size={36} />
									</div>
								</div>
							</div>

							<h1 className="text-red-500 text-2xl lg:text-3xl mt-4 lg:mt-8 font-bold capitalize">
								{translations["payment-incomplete"] || "payment incomplete"}
							</h1>
							<h3 className="text-slate-600 mt-2 text-base lg:text-xl">
								{translations["payment-fail-msg"] ||
									"Your order has been confirmed. but somehow the payment has failed."}
							</h3>
						</div>
					)}

					{loading ? (
						<ArticleLoader />
					) : (
						<>
							<div className="order-info bg-slate-100 p-4 my-4 text-center text-slate-600">
								<p>
									{translations["your-order-id"] || "Your Order ID"}: #
									{order?.invoice_no}
								</p>
								<p className="my-2 text-lg">
									{translations["amount-payable"] || "Amount Payable"}:{" "}
									{siteConfig.currency.sign}
									{order?.due_amount}
								</p>
							</div>
							<div className="text-center text-slate-600 text-base lg:text-xl">
								<h3 className="md:w-3/4 mx-auto">
									{translations["payment-fail-info"] ||
										"Click the Payment button to complete the payment"}{" "}
									{!isGuestCheckout && (
										<>
											{" "}
											{translations["or"] || "or"}
											<Link
												href={`/dashboard/my-orders/details/${order_id}`}
												className="text-secondary-700 active:scale-95 underline ml-1"
											>
												{translations["see-details"] || "See Details"}
											</Link>
										</>
									)}
								</h3>
							</div>
							<div className="order-info">
								<div className="action my-5 flex justify-center">
									<button
										onClick={() => setSelectedOrder(order)}
										className="bg-primary py-3 px-6 text-white rounded-lg text-center active:scale-95"
									>
										{translations["make-payment"] || "Make Payment"}
									</button>
								</div>
							</div>
						</>
					)}
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

export default PaymentFail;