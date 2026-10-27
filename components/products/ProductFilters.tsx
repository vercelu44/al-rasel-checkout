"use client";
import React from "react";
import { useAppSelector } from "@/store/hooks";
import Filter from "../filters/Filter";

import type { Category } from "@/types";

export default function ProductFilters({ category }: { category?: Category }) {
	const { isFilterPanelOpen } = useAppSelector((state) => state.common);
	if (!isFilterPanelOpen) return null;
	return <Filter category={category} />;
}
