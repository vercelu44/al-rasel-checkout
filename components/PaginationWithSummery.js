"use client";
import React from "react";
import Paginator from "./elements/Paginator";
import { useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";

export default function PaginationWithSummery({
	meta,
	totalItemsShowing,
	paginateItems,
	className,
}) {
	const { translations } = useSelector((state) => state.common);
	// console.log(translations);
	return (
		<div
			className={twMerge(
				"border-t border-slate-200 py-3 lg:p-4 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3 lg:gap-4",
				className
			)}
		>
			<p>
				{translations["showing"] || "Showing"} {totalItemsShowing || 0}{" "}
				{translations["out-of"] || "out of"} {meta?.total} {translations["total-products"] || "total products"}{" "}
			</p>
			<Paginator meta={meta} paginateItems={paginateItems} />
		</div>
	);
}
