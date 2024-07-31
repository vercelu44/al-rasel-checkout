"use client";

import { useSelector } from "react-redux";
// import useSelectURLQuery from "@/hooks/useSelectURLQuery";
import DropdownSelect from "@/components/elements/DropdownSelect";
import SortIcon from "@/components/elements/svg/SortIcon";

const ReviewSortSelect = ({ onSelectChange }) => {
	// const { handleSelectChange } = useSelectURLQuery();
	const { translations } = useSelector((state) => state.common);

	const sortItems = [
		{ key: "default", value: translations["random"] || "Random" },
		{ key: "new", value: translations["recent"] || "Recent" },
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
		<div className="sort-by-dropdown-wrap">
			<DropdownSelect
				className={"w-[154px] lg:w-[192px] max-w-[192px]"}
				options={sortItems}
				// onSelectChange={(item) => handleSelectChange("sort_type", item.key)}
				onSelectChange={onSelectChange}
			>
				<SortIcon />
			</DropdownSelect>
		</div>
	);
};

export default ReviewSortSelect;
