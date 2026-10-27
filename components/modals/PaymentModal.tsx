"use client";
import Image from "next/image";
import Modal from "../elements/Modal";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import CustomRadio from "../elements/CustomRadio";
import ItemsListLoader from "../elements/loaders/ItemsListLoader";
import { useGetPaymentMethodsQuery } from "@/store/api/paymentMethodsAPI";
import { setGlobalLoader } from "@/store/slices/commonSlice";
import { handleOrderPayLater } from "@/lib/order-pay";
import { siteConfig } from "@/config/site";
import type { PayableOrder, PaymentMethod, PaymentMethodMap } from "@/types";

interface PaymentModalProps {
	/** Order to pay for; the modal is open while this is set */
	selectedOrder: PayableOrder | null;
	setSelectedOrder: (order: PayableOrder | null) => void;
}

const PaymentModal = ({ selectedOrder, setSelectedOrder }: PaymentModalProps) => {
	const { translations, settings } = useAppSelector((state) => state.common);
	const [selectedPayMethod, setSelectedPayMethod] = useState<PaymentMethod | null>(null);
	const { data: paymentMethodsData, isLoading } = useGetPaymentMethodsQuery();
	const paymentMethods: PaymentMethodMap = paymentMethodsData?.data || {};
	const dispatch = useAppDispatch();
	const isPaymentOptions =
		selectedOrder?.due_amount !== 0 &&
		selectedOrder?.due_amount === selectedOrder?.total_amount;

	const paymentOptions = [
		{
			key: "delivery_charge_payment",
			title: `Pay delivery charge only`,
			value: selectedOrder?.shipping?.delivery_charge,
		},
		{
			key: "total_payment",
			title: `Pay total amount`,
			value: selectedOrder?.due_amount,
		},
	];
	const [selectedPaymentOption, setSelectedPaymentOption] = useState(
		isPaymentOptions ? paymentOptions[0] : null
	);

	return (
		<Modal
			showModal={!!selectedOrder}
			setShowModal={() => setSelectedOrder(null)}
			title={translations["sdsd"] || "Online Payment"}
		>
			<div className="md:w-[500px]">
				<div className="order-info bg-slate-50 px-3 py-2 border-y border-slate-200">
					<div className="flex-between my-2">
						<p>Invoice No:</p>
						<p>{selectedOrder?.invoice_no}</p>
					</div>
					<div className="flex-between my-2">
						<p>Paying Amount:</p>
						<p>
							{siteConfig.currency.shortForm}
							{isPaymentOptions
								? selectedPaymentOption?.value
								: selectedOrder?.due_amount}
						</p>
					</div>
				</div>
				{isPaymentOptions ? (
					<div className="form-control">
						<h4 className="text-slate-700 font-semibold pt-3">
							{translations["payment-options"] || "Payment Options"}
						</h4>
						<div className="flex flex-col gap-3 pt-2">
							{paymentOptions.map((payOption) => (
								<button
									key={payOption.key}
									type="button"
									className="flex gap-2 items-center border border-slate-200 p-3"
									onClick={() => setSelectedPaymentOption(payOption)}
								>
									<CustomRadio
										isChecked={selectedPaymentOption.key === payOption.key}
										label={payOption.title}
										// onClick={() => setDeliveryMethod(pt)}
									/>
									<p>
										{siteConfig.currency.sign}
										{payOption.value}
									</p>
								</button>
							))}
						</div>
					</div>
				) : null}
				{isLoading ? (
					<ItemsListLoader noImage={true} numItems={2} />
				) : (
					<>
						<h4 className="text-slate-700 font-semibold mt-3">
							{translations["payment-method"] || "Payment Method"}
						</h4>
						<div className="flex flex-col gap-3 mt-2">
							{Object.keys(paymentMethods).map((method, index) =>
								paymentMethods[method].status === 1 &&
								paymentMethods[method].key !== "COD" ? (
									<div
										key={index}
										onClick={() => setSelectedPayMethod(paymentMethods[method])}
										className="flex items-center justify-between border border-slate-200 p-3"
									>
										<CustomRadio
											isChecked={
												paymentMethods[method].title ===
												selectedPayMethod?.title
											}
											label={paymentMethods[method].title}
										/>
										<div className="">
											<Image
												src={paymentMethods[method].icon}
												height={32}
												width={150}
												alt="icon"
												className="h-8 w-fit max-w-[150px]"
											/>
										</div>
									</div>
								) : null
							)}
						</div>
					</>
				)}
				<div className="order-actions mt-6 flex flex-col md:flex-row gap-4 justify-between items-center">
					<button
						className="border border-primary py-3 w-full px-6 text-center active:scale-95"
						onClick={() => setSelectedOrder(null)}
					>
						Cancel
					</button>
					<button
						onClick={() =>
							handleOrderPayLater(
								selectedOrder?.id,
								selectedPaymentOption,
								selectedPayMethod,
								(loading) => dispatch(setGlobalLoader(loading))
							)
						}
						disabled={!selectedPayMethod}
						className={`bg-primary py-3 w-full px-6 text-white text-center active:scale-95 ${
							!selectedPayMethod ? "opacity-30 cursor-not-allowed" : ""
						}`}
					>
						Confirm
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default PaymentModal;
