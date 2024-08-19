"use client";
import React from "react";
import BrandCard from "./BrandCard";
import BrandsSlider from "./BrandsSlider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import HorizontalScrollView from "@/components/elements/HorizontalScrollView";

export default function BrandsViewSelector({ brands }) {
	const isMobile = useMediaQuery("(max-width: 768px)");

	return (
		<>
			{isMobile ? (
				<HorizontalScrollView className={"md:ml-4 space-x-2 px-3 py-0"}>
					{brands.map((brand, index) => (
						<BrandCard key={index} brand={brand} />
					))}
				</HorizontalScrollView>
			) : (
				<BrandsSlider brands={brands} />
			)}
		</>
	);
}
