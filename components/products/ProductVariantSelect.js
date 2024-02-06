"use client";
import Image from "next/image";
import React, { forwardRef, useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import SizeChartModal from "../modals/SizeChartModal";
import { groupByKey } from "@/utils/format-list";
import { toast } from "react-toastify";

const ProductVariantSelect = forwardRef(
	(
		{
			productBarCodes,
			photos = [],
			selectedVariant,
			setSelectedVariant,
			sizeChart,
			translations,
			selectedColor,
			setSelectedColor,
		},
		ref
	) => {
		const [colorsGroup, setColorsGroup] = useState({});
		const [showSizeChart, setShowSizeChart] = useState(false);
		const colors = Object.keys(colorsGroup);

		const handleVariantSelect = (variantProp) => {
			if (variantProp.stock_qty <= 0) {
				setSelectedVariant(null); // clear selected variant when out of stock
				toast.error("Oops! this variant isn't available");
				return;
			}
			setSelectedVariant(variantProp);
		};

		/**
		 * The function `triggerColorImgToView` filters an array of photos based on a given color name and
		 * selects the first image as the active slide in a slider.
		 * @param colorName - The color name parameter is a string that represents the name of a color.
		 */
		const triggerColorImgToView = (colorName) => {
			if (ref) {
				//added for color wise image filtering and selecting first image as active slide in slider
				let filteredSlides = photos.filter(
					(slide) => slide.color_name === colorName
				);
				!filteredSlides.length && (filteredSlides = photos);
				ref.current.swiper.slideTo(0);
				// ref.current.swiper.autoplay.stop();

				//selecting first image as active slide in slider
				// filteredSlides.some((photo, index) => {
				// 	if (photo.color_name === colorName) {
				// 		ref.current.swiper.slideTo(index);
				// 		ref.current.swiper.autoplay.stop();
				// 		return true;
				// 	}
				// 	return false;
				// });
			}
		};

		const handleColorSelect = (colorProp) => {
			setSelectedColor(colorProp);
			// Only if one size available for a color following block of code
			// will try to add/remove this variant when color gets selected
			if (colorsGroup[colorProp].length === 1) {
				let firstVariantOfColor = colorsGroup[colorProp][0];
				handleVariantSelect(firstVariantOfColor);
			} else {
				// if size available for new selected color it keeps the current size otherwise clear the selected variant
				const isSizeAvailable = colorsGroup[colorProp].find(
					(variant) =>
						variant.size === selectedVariant?.size && variant.stock_qty > 0
				);

				isSizeAvailable
					? setSelectedVariant(isSizeAvailable)
					: setSelectedVariant(null);
			}
			triggerColorImgToView(colorProp);
		};

		useEffect(() => {
			// console.log(photos);
			const variants = productBarCodes || [];
			if (variants.length) {
				const colorVariantsGroup = groupByKey(variants, "color"); // Group the data based on color
				setColorsGroup(colorVariantsGroup);

				// Activate this block to auto variant select onload
				// const firstColor = Object.keys(colorVariantsGroup)[0];
				// setSelectedColor(firstColor);
				// setSelectedVariant([colorVariantsGroup[firstColor][0]]);
			}
		}, [productBarCodes]);

		return (
			<>
				{!(colors.length === 1 && colors[0] === "") ? (
					<div className="product-color mt-4">
						<h4 className="text-slate-900 text-sm lg:text-base font-normal">
							{translations["select-color"] || "কালার নির্বাচন করুন"}:
						</h4>
						<div className="flex gap-[10px] lg:gap-3 flex-wrap mt-2 lg:mt-3">
							{colors.map((color) => {
								let colorImgInfo = photos.find(
									(photo) => photo.color_name === color
								);

								return (
									<div
										key={color}
										className={`md:p-1.5 h-[48px] lg:h-[52px] min-w-[48px] lg:min-w-[52px] w-fit box-content rounded-md border ${
											selectedColor === color
												? "border-2 border-primary"
												: "border-slate-300"
										} cursor-pointer`}
										onClick={() => handleColorSelect(color)}
									>
										{colorImgInfo ? (
											<Image
												src={colorImgInfo?.image}
												alt="product"
												height={52}
												width={52}
												title={color}
												className={`h-full w-12 lg:w-[52px] rounded-md object-contain`}
											/>
										) : (
											<span
												className={`h-full w-full flex items-center justify-center text-sm lg:text-base text-slate-700`}
												// style={{ backgroundColor: colorImgInfo?.color_code }}
											>
												{color}
											</span>
										)}
									</div>
								);
							})}
						</div>
					</div>
				) : null}

				{colorsGroup[selectedColor]?.length > 1 ? (
					<div className="product-size mt-4">
						<div className="flex justify-between font-normal items-center">
							<h4 className="text-slate-900 text-sm lg:text-base">
								{translations["select-variant"] || "নির্বাচন করুন"}:
							</h4>
							{sizeChart && (
								<button
									className="text-secondary-700 flex items-center gap-x-1 text-sm lg:text-base"
									onClick={() => setShowSizeChart((show) => !show)}
								>
									<span>
										{translations["see-size-chart"] || "সাইজ চার্ট দেখুন"}
									</span>
									<MdArrowForwardIos />
								</button>
							)}
						</div>
						<div className="flex gap-2 lg:gap-3 flex-wrap mt-2 lg:mt-3">
							{colorsGroup[selectedColor]?.map((variant) => (
								<div
									key={variant.id}
									className={`py-2 lg:py-3 px-4 rounded-lg border text-sm lg:text-base ${
										selectedVariant?.id === variant.id
											? "border-2 border-primary"
											: "border-slate-300"
									} cursor-pointer  ${
										variant.stock_qty <= 0
											? "bg-slate-300 text-slate-400 cursor-not-allowed"
											: "text-slate-700"
									}`}
									onClick={() => handleVariantSelect(variant)}
								>
									{variant.size}
								</div>
							))}
						</div>
					</div>
				) : null}
				{sizeChart && showSizeChart && (
					<SizeChartModal
						showModal={showSizeChart}
						setShowModal={setShowSizeChart}
						sizeChart={sizeChart}
					/>
				)}
			</>
		);
	}
);

ProductVariantSelect.displayName = "ProductVariantSelect";

export default ProductVariantSelect;
