"use client";
import { useSelector } from "react-redux";
import useSelectURLQuery from "@/hooks/useSelectURLQuery";
import DropdownSelect from "./DropdownSelect";

const SortSelect = () => {
	const { handleSelectChange } = useSelectURLQuery();
	const { translations } = useSelector((state) => state.common);

	const sortItems = [
		{ key: "default", value: translations["random"] || "Random" },
		{ key: "new", value: translations["new-product"] || "New Product" },
		{
			key: "best_selling",
			value: translations["best-selling-product"] || "Best Selling Product",
		},
		{
			key: "low_high",
			value: translations["price-(low-to-high)"] || "Price (Low to High)",
		},
		{
			key: "high_low",
			value: translations["price-(high-to-low)"] || "Price (High to Low)",
		},
		{
			key: "rating_low_high",
			value: translations["rating-(low-to-high)"] || "Rating (Low to High)",
		},
		{
			key: "rating_high_low",
			value: translations["rating-(high-to-low)"] || "Rating (High to Low)",
		},
	];

	return (
		<>
			<div className="sort-by-product-wrap flex items-center gap-x-4 gap-y-4">
				<div className="sort-by">
					<span className=" text-sm text-slate-600">
						{translations["sort"] || "Sort By"}:
					</span>
				</div>
				<div className="sort-by-dropdown-wrap">
					<DropdownSelect
						title={"Sort By"}
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
