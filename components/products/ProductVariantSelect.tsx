"use client";
import Image from "next/image";
import React, { forwardRef, useEffect, useState } from "react";
import { groupByKey } from "@/utils/format-list";
import { toast } from "react-toastify";
import { useAppSelector } from "@/store/hooks";
import type { SwiperRef } from "swiper/react";
import type { ProductPhoto, ProductVariant, Translations } from "@/types";

interface ProductVariantSelectProps {
  productBarCodes?: ProductVariant[];
  photos?: ProductPhoto[];
  selectedVariant: ProductVariant | null;
  setSelectedVariant: (variant: ProductVariant | null) => void;
  translations: Translations;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

/** `ref` is the product image slider, used to jump to the first image. */
const ProductVariantSelect = forwardRef<SwiperRef, ProductVariantSelectProps>(
  (
    {
      productBarCodes,
      photos = [],
      selectedVariant,
      setSelectedVariant,
      translations,
      selectedColor,
      setSelectedColor,
    },
    ref
  ) => {
    const { settings } = useAppSelector((state) => state.common);
    /** Variants grouped by colour: { Red: [S, M, L], Blue: [...] } */
    const [colorsGroup, setColorsGroup] = useState<Record<string, ProductVariant[]>>({});
    const colors = Object.keys(colorsGroup);

    const handleVariantSelect = (variantProp: ProductVariant) => {
      if (
        variantProp.stock_qty <= 0 &&
        settings.allow_stock_out_product_add_to_cart === 0
      ) {
        setSelectedVariant(null);
        toast.error("Oops! this variant isn't available");
        return;
      }
      setSelectedVariant(variantProp);
    };

    const triggerColorImgToView = (colorName: string) => {
      if (ref && typeof ref !== "function") {
        let filteredSlides = photos.filter(
          (slide) => slide.color_name === colorName
        );
        !filteredSlides.length && (filteredSlides = photos);
        ref.current.swiper.slideTo(0);
      }
    };

    const handleColorSelect = (colorProp: string) => {
      setSelectedColor(colorProp);

      // auto select size if only one size available for the color
      if (colorsGroup[colorProp].length === 1) {
        let firstVariantOfColor = colorsGroup[colorProp][0];
        handleVariantSelect(firstVariantOfColor);
      }
      // auto select size if only one size available for the color
      else {
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
      const variants = productBarCodes || [];
      if (variants.length) {
        const colorVariantsGroup = groupByKey(variants, "color");
        setColorsGroup(colorVariantsGroup);

        const tempColors = Object.keys(colorVariantsGroup);
        if (tempColors.length === 1) {
          const firstColor = tempColors[0];
          setSelectedColor(firstColor);
        }
      }
    }, [productBarCodes, setSelectedColor, setSelectedVariant]);

    return (
      <>
        {!(colors.length === 1 && colors[0] === "") ? (
          <div className="product-color mt-4">
            <h4 className="text-slate-900 text-sm lg:text-base font-normal">
              {translations["select-color"] || "Select Color"}:
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
                        className="h-full w-12 lg:w-[52px] rounded-md object-contain"
                      />
                    ) : (
                      <span className="h-full w-full flex items-center justify-center text-sm lg:text-base text-slate-700">
                        {color}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* size section */}
        {colorsGroup[selectedColor]?.some((variant) => variant.size !== "") ? (
          <div className="product-size mt-4">
            <div className="font-normal">
              <h4 className="text-slate-900 text-sm lg:text-base">
                {translations["select-variant"] || "Select Variant"}:
              </h4>
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
                    variant.stock_qty <= 0 && settings.allow_stock_out_product_add_to_cart === 0
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
      </>
    );
  }
);

ProductVariantSelect.displayName = "ProductVariantSelect";

export default ProductVariantSelect;
