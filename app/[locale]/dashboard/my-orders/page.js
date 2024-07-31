"use client";
import CountButton from "@/components/elements/CountButton";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import OrderCard from "./_components/OrderCard";
import NoItems from "../_components/NoItems";
import { useGetOrdersQuery } from "@/store/api/orderAPI";
import { getCountByKeyValue } from "@/utils/items-count";
import orderFilterKeys from "./_components/OrderFilterKeys";
import ItemsListLoader from "@/components/elements/loaders/ItemsListLoader";
import HorizontalScrollView from "@/components/elements/HorizontalScrollView";
import NestedPageTitle from "../_components/NestedPageTitle";

const MyOrders = () => {
	const { data: ordersData, isLoading } = useGetOrdersQuery();
	const { translations } = useSelector((state) => state.common);
	const myOrders = ordersData?.data || [];

	const orderFilters = [
		{
			key: "all-orders",
			title: translations["all-orders"] || "All Orders",
			count: myOrders.length,
		},
		{
			key: orderFilterKeys.pending,
			title: translations["pending"] || "Pending",
			count: getCountByKeyValue(myOrders, "status", orderFilterKeys.pending),
		},
		{
			key: orderFilterKeys.confirmed,
			title: translations["confirmed"] || "Confirmed",
			count: getCountByKeyValue(myOrders, "status", orderFilterKeys.confirmed),
		},
		{
			key: orderFilterKeys.inDeliver,
			title: translations["on-delivery"] || "On Delivery",
			count: getCountByKeyValue(myOrders, "status", orderFilterKeys.inDeliver),
		},
		{
			key: orderFilterKeys.complete,
			title: translations["complete"] || "Complete",
			count: getCountByKeyValue(myOrders, "status", orderFilterKeys.complete),
		},
		{
			key: orderFilterKeys.cancelled,
			title: translations["cancel-my-order"] || "Cancelled",
			count: getCountByKeyValue(myOrders, "status", orderFilterKeys.cancelled),
		},
	];

	const [selectedFilter, setSelectedFilter] = useState(orderFilters[0]);
	let filteredOrders = myOrders;
	if (selectedFilter.key !== "all-orders") {
		filteredOrders = myOrders.filter(
			(order) => order?.status === selectedFilter.key
		);
	}
	return (
		<div className="mb-4 lg:mb-14">
			<NestedPageTitle
				title={translations["my-order"] || "My Orders"}
				href={"/dashboard"}
			/>
			<div className="lg:px-10">
				<HorizontalScrollView className={"gap-x-3 lg:p-0"}>
					{orderFilters.map((filter) => (
						<CountButton
							key={filter.key}
							isActive={selectedFilter.key === filter.key}
							label={filter.title}
							count={filter.count}
							onClick={() => setSelectedFilter(filter)}
						/>
					))}
				</HorizontalScrollView>
			</div>
			<div className="px-3 lg:px-10">
				{isLoading ? (
					<div className="py-4 ">
						<ItemsListLoader
							itemHeight={110}
							noImage={true}
							viewBoxWidth={900}
						/>
					</div>
				) : filteredOrders.length ? (
					<div className="py-2 md:py-8">
						{filteredOrders.map((order) => (
							<OrderCard
								key={order.id}
								order={order}
								translations={translations}
							/>
						))}
					</div>
				) : (
					<NoItems title={translations["no-order"] || "No Order"} />
				)}
			</div>
		</div>
	);
};

export default MyOrders;
