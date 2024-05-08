"use client";
import React from "react";
import { Link } from "@/navigation";
import { useDispatch, useSelector } from "react-redux";
import ArticleLoader from "@/components/elements/loaders/ArticleLoader";
import { ImWarning } from "react-icons/im";
import handleSSLOrderPayLater from "@/lib/ssl-pay";
import { setGlobalLoader } from "@/store/slices/commonSlice";
import { siteConfig } from "@/config/site";
import useOrderSummary from "@/hooks/useOrderSummary";

const PaymentFail = ({ params }) => {
	const { order_id } = params;
	const dispatch = useDispatch();
	const { translations, settings } = useSelector((state) => state.common);
	const { order, loading, error } = useOrderSummary(order_id);
	const isGuestCheckout = !!settings?.guest_checkout;

	return (
		<div className="container min-h-screen">
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

						<h1 className="text-red-500 text-2xl lg:text-3xl mt-4 lg:mt-8 font-bold">
							{translations["payment-incomplete"] || "পেমেন্ট অসম্পূর্ণ"}
						</h1>
						<h3 className="text-slate-600 mt-2 text-base lg:text-xl">
							{translations["payment-fail-msg"] ||
								"সততা স্টোর থেকে আপনার অর্ডার নিশ্চিত করা হয়েছে, কিন্তু কোন কারণে পেমেন্ট ব্যর্থ হয়েছে"}
						</h3>
					</div>
				)}

				{loading ? (
					<ArticleLoader />
				) : (
					<>
						<div className="order-info bg-slate-100 p-4 my-4 text-center text-slate-600">
							<p>
								{translations["your-order-id"] || "আপনার অর্ডার আইডি"}: #
								{order?.invoice_no}
							</p>
							<p>
								{translations["amount-payable"] || "প্রদেয় পরিমান"}:{" "}
								{siteConfig.currency.sign}
								{order?.due_amount}
							</p>
						</div>
						<div className="text-center text-slate-600 text-base lg:text-xl">
							<h3 className="md:w-3/4 mx-auto">
								{translations["payment-fail-info"] ||
									"পেমেন্ট সম্পূর্ণ করতে পেমেন্ট বাটনে ক্লিক করুন"}{" "}
								{!isGuestCheckout && (
									<>
										{" "}
										{translations["or"] || "অথবা"}
										<Link
											href={`/dashboard/my-orders/details/${order_id}`}
											className="text-secondary-700 active:scale-95 underline ml-1"
										>
											{translations["see-details"] || "বিস্তারিত দেখুন"}
										</Link>
									</>
								)}
							</h3>
						</div>
						<div className="order-info">
							<div className="action my-5 flex justify-center">
								<button
									onClick={() =>
										handleSSLOrderPayLater(order?.id, (loading) =>
											dispatch(setGlobalLoader(loading))
										)
									}
									className="bg-primary py-3 px-6 text-white rounded-lg text-center active:scale-95"
								>
									{translations["make-payment"] || "পেমেন্ট করুন"}
								</button>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default PaymentFail;
