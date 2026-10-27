"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import DrawerLeft from "../elements/DrawerLeft";
import { toggleFilterPanel } from "@/store/slices/commonSlice";
import Filter from "../filters/Filter";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { Category } from "@/types";

const FilterPanel = ({ category }: { category?: Category }) => {
	const isMobile = useMediaQuery("(max-width: 768px)"); // checking for mobile
	//Drawer logics
	const { isFilterPanelOpen, translations } = useAppSelector(
		(state) => state.common
	);
	const dispatch = useAppDispatch();
	const isMobileFilterPanelOpen = !isFilterPanelOpen; // reverse the state for mobile

	if (!isMobile) return null; // will work on mobile only

	return (
		<DrawerLeft
			title={translations["filter"] || "Filter"}
			show={isMobileFilterPanelOpen}
			setShow={() => dispatch(toggleFilterPanel())}
		>
			<div className="p-4 flex flex-col h-[77%]">
				{isMobileFilterPanelOpen && <Filter category={category} />}
			</div>
		</DrawerLeft>
	);
};

export default FilterPanel;
