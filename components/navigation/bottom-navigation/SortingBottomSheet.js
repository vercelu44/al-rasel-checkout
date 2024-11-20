"use client";
import React from "react";
import { useSelector } from "react-redux";
import Modal from "@/components/elements/Modal";
import useSelectURLQuery from "@/hooks/useSelectURLQuery";
import { useSearchParams } from "next/navigation";

const SortingBottomSheet = ({ showModal, setShowModal }) => {
	const { handleSelectChange } = useSelectURLQuery();
	const { translations } = useSelector((state) => state.common);
	const searchParams = useSearchParams();
	const selected = new URLSearchParams(searchParams).get("sort_type");

	const sortOptions = [
		{ value: "default", displayText: translations["random"] || "Random" },
		{
			value: "new",
			displayText: translations["new-product"] || "New Product",
		},
		{
			value: "best_selling",
			displayText:
				translations["best-selling-product"] || "Best Selling Product",
		},
		{
			value: "low_high",
			displayText: translations["price-(low-to-high)"] || "Price (Low to High)",
		},
		{
			value: "high_low",
			displayText: translations["price-(high-to-low)"] || "Price (High to Low)",
		},
		{
			value: "rating_low_high",
			displayText:
				translations["rating-(low-to-high)"] || "Rating (Low to High)",
		},
		{
			value: "rating_high_low",
			displayText:
				translations["rating-(high-to-low)"] || "Rating (High to Low)",
		},
	];

	const handleSeclectChange = (value) => {
		handleSelectChange("sort_type", value);
		setShowModal(false);
	};

	return (
		<Modal
			showModal={showModal}
			setShowModal={setShowModal}
			title={translations["sort"] || "Sort by"}
		>
			<div className="w-full lg:min-w-[27rem] text-slate-600 px-4">
				<ul>
					{sortOptions.map((option, index) => (
						<li
							key={index}
							className={`py-3 ${
								option.value === selected ? "text-primary" : ""
							}`}
							onClick={() => handleSeclectChange(option.value)}
						>
							{option.displayText}
						</li>
					))}
				</ul>
			</div>
		</Modal>
	);
};

export default SortingBottomSheet;
