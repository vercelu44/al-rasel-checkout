import React from "react";
import OrderStep from "./OrderStep";
import ItemsListLoader from "@/components/elements/loaders/ItemsListLoader";

export default function OrderTracking({ orderData, isLoading, translations }) {

	const { saleStatus } = orderData || {};
		console.log("saleStatus",saleStatus)
	return (
		<div className="bg-white rounded-lg min-h-[300px] p-5">
			<h3 className="text-base/[22px] lg:text-lg/[26px] font-semibold font-title capitalize">
				{translations["parcel-tracking"] || "পার্সেল ট্র্যাকিং"}
			</h3>
			<div className="pl-2 pt-4">
				{isLoading ? (
					<ItemsListLoader numItems={3} noImage={true} viewBoxWidth={900} />
				) : (
					<ol class="relative text-slate-600 capitalize">
						<OrderStep
							date={saleStatus?.Complete?.created_at}
							title={translations["done"] || "done"}
							message={
								translations["received-product"] ||
								"You have received your product"
							}
							isComplete={saleStatus?.Complete}
						/>
						<OrderStep
							date={saleStatus?.Delivery?.created_at}
							title={translations["on-delivery"] || "on-delivery"}
							message={
								translations["product-for-delivery"] ||
								"product-for-delivery"
							}
							isComplete={saleStatus?.Delivery}
						/>
						<OrderStep
							date={saleStatus?.PackingCompleat?.created_at}
							title={translations["packing-done"] || "packing-done"}
							message={
								translations["packing-done"] ||
								"packing-done"
							}
							isComplete={saleStatus?.PackingCompleat}
						/>
						<OrderStep
							date={saleStatus?.Packing?.created_at}
							title={translations["packing"] || "packing"}
							message={
								translations["product-packing"] ||
								"product-packing"
							}
							isComplete={saleStatus?.Packing}
						/>
						<OrderStep
							date={saleStatus?.Confirm?.created_at}
							title={translations["confirmed"] || "confirmed"}
							message={
								translations["order-confirmed"] ||
								"order-confirmed"
							}
							isComplete={saleStatus?.Confirm}
						/>
						<OrderStep
							date={saleStatus?.Processing?.created_at}
							title={translations["processing"] || "processing"}
							message={
								translations["order-received"] ||
								"order-received"
							}
							isComplete={saleStatus?.Processing}
						/>
						<OrderStep
							date={saleStatus?.Pending?.created_at}
							title={translations["order-placed"] || "order-placed"}
							message={`${
								translations["order-successfully-placed"] ||
								"order-successfully-placed"
							} #${orderData?.sale?.invoice_no}`}
							isComplete={saleStatus?.Pending}
						/>
					</ol>
				)}
			</div>
		</div>
	);
}
