"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import SortIcon from "@/components/elements/svg/SortIcon";
import SortingBottomSheet from "./SortingBottomSheet";

export default function SortMenu() {
	const { translations } = useSelector((state) => state.common);
	const [isSort, setIsSort] = useState(false);

	return (
		<>
			<div
				className="flex items-center gap-3 w-full h-full bg-slate-200 lg:bg-slate-50 rounded-xl px-4 py-3 cursor-pointer"
				onClick={() => setIsSort((prevState) => !prevState)}
			>
				<SortIcon />
				<span className="text-base text-slate-900">
					{translations["sort"] || "Sort by"}
				</span>
			</div>
			{isSort && (
				<SortingBottomSheet showModal={isSort} setShowModal={setIsSort} />
			)}
		</>
	);
}
