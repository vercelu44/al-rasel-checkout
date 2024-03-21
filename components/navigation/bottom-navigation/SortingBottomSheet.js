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
		{ value: "default", displayText: translations["random"] || "এলোমেলো" },
		{
			value: "new",
			displayText: translations["new-product"] || "নতুন প্রডাক্ট",
		},
		{
			value: "best_selling",
			displayText:
				translations["best-selling-product"] || "বেস্ট সেলিং প্রডাক্ট",
		},
		{
			value: "low_high",
			displayText: translations["price-(low-to-high)"] || "দাম (কম থেকে বেশি)",
		},
		{
			value: "high_low",
			displayText: translations["price-(high-to-low)"] || "দাম (বেশি থেকে কম)",
		},
		{
			value: "rating_low_high",
			displayText:
				translations["rating-(low-to-high)"] || "রেটিং (কম থেকে বেশি)",
		},
		{
			value: "rating_high_low",
			displayText:
				translations["rating-(high-to-low)"] || "রেটিং (বেশি থেকে কম)",
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
			title={translations["sort"] || "শর্টিং করুন"}
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
