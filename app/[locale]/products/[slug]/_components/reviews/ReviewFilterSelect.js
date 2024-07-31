"use client";
import { useSelector } from "react-redux";
// import useSelectURLQuery from "@/hooks/useSelectURLQuery";
import DropdownSelect from "@/components/elements/DropdownSelect";
import { HiOutlineFilter } from "react-icons/hi";

const ReviewFilterSelect = ({ onSelectChange }) => {
	// const { handleSelectChange } = useSelectURLQuery();
	const { translations } = useSelector((state) => state.common);

	const sortItems = [
		{ key: "all-star", value: translations["all-stars"] || "All Stars" },
		{ key: "5", value: translations["5-star"] || "5 Star" },
		{ key: "4", value: translations["4-star"] || "4 Star" },
		{ key: "3", value: translations["3-star"] || "3 Star" },
		{ key: "2", value: translations["2-star"] || "2 Star" },
		{ key: "1", value: translations["1-star"] || "1 Star" },
	];
	return (
		<div className="rating-filter-dropdown-wrap">
			<DropdownSelect
				className={"w-[154px] lg:w-[192px] max-w-[192px]"}
				options={sortItems}
				// onSelectChange={(item) => handleSelectChange("rating", item.key)}
				onSelectChange={onSelectChange}
			>
				<HiOutlineFilter size={20} className="text-slate-900" />
			</DropdownSelect>
		</div>
	);
};

export default ReviewFilterSelect;
