import React from "react";
import OrderStep from "./OrderStep";
import ItemsListLoader from "@/components/elements/loaders/ItemsListLoader";
import { getOrderTrackingData } from "./order-utils";

export default function OrderTracking({ orderData, isLoading, translations }) {

	const { steps } = getOrderTrackingData(orderData, translations);
 

  // console.log("saleStatus",saleStatus)
  return (
    <div className="bg-white lg:hidden rounded-lg min-h-[300px] p-5">
      <h3 className="text-base/[22px] lg:text-lg/[26px] font-semibold font-title capitalize">
        {translations["parcel-tracking"] || "পার্সেল ট্র্যাকিং"}
      </h3>
      <div className="pl-2  pt-4">
        {isLoading ? (
          <ItemsListLoader numItems={3} noImage={true} viewBoxWidth={900} />
        ) : (
          <ol
            className="
						relative
						before:absolute
						before:left-[15px]
						before:top-4
						before:bottom-4
						before:h-[calc(100%-104px)]
						before:w-[2px]
						before:bg-slate-300
					"
          >
            {steps.map((step, index) => (
              <OrderStep
                key={step.key}
                {...step}
                isLast={index === steps.length - 1}
              />
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
