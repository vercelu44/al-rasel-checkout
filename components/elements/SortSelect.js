"use client";
import { useSelector } from "react-redux";
import useSelectURLQuery from "@/hooks/useSelectURLQuery";
import DropdownSelect from "./DropdownSelect";

const SortSelect = () => {
	const { handleSelectChange } = useSelectURLQuery();
	const { translations } = useSelector((state) => state.common);

	const sortItems = [
		{ key: "default", value: translations["random"] || "এলোমেলো" },
		{ key: "new", value: translations["new-product"] || "নতুন প্রডাক্ট" },
		{
			key: "best_selling",
			value: translations["best-selling-product"] || "বেস্ট সেলিং প্রডাক্ট",
		},
		{
			key: "low_high",
			value: translations["price-(low-to-high)"] || "দাম (কম থেকে বেশি)",
		},
		{
			key: "high_low",
			value: translations["price-(high-to-low)"] || "দাম (বেশি থেকে কম)",
		},
		{
			key: "rating_low_high",
			value: translations["rating-(low-to-high)"] || "রেটিং (কম থেকে বেশি)",
		},
		{
			key: "rating_high_low",
			value: translations["rating-(high-to-low)"] || "রেটিং (বেশি থেকে কম)",
		},
	];

	return (
		<>
			<div className="sort-by-product-wrap flex items-center gap-x-4 gap-y-4">
				<div className="sort-by">
					<span className=" text-sm text-slate-600">
						{translations["sort"] || "শর্টিং করুন"}:
					</span>
				</div>
				<div className="sort-by-dropdown-wrap">
					<DropdownSelect
						title={"এলোমেলো"}
						className={"w-72"}
						options={sortItems}
						onSelectChange={(item) => handleSelectChange("sort_type", item.key)}
					/>
				</div>
			</div>
		</>
	);
};

export default SortSelect;
