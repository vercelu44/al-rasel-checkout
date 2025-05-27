"use client";
import React from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import HorizontalScrollView from "@/components/elements/HorizontalScrollView";
import BestSellSlider from "./BestSellSlider";
import ProductCard from "@/components/cards/ProductCard";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import fire from "@/public/assets/lottie/fire.json";
import SectionTitle from "@/components/elements/SectionTitle";
import { SeeAll } from "@/components/elements/buttons";

export default function BestSellingViewSelector({
  bestProducts,
  translations,
}) {
  const isTablet = useMediaQuery("(max-width: 992px)");

  return (
    <>
      <div className="container">
        <SectionTitle
          title={translations["best-selling-product"]}
          href="/products?sort_type=best_selling"
          buttonText={translations["see-all"]}
        >
          <Lottie animationData={fire} loop={true} className="h-8 w-8" />
        </SectionTitle>
      </div>
      <div className="bestSell-slider lg:mt-6 relative md:container">
        {isTablet ? (
          <HorizontalScrollView className={"space-x-2 py-0 px-3"}>
            {bestProducts.map((product, index) => (
              <div key={index} className="md:w-[240px]">
                <ProductCard
                  key={index}
                  product={product}
                  isLarge
                  translations={translations}
                />
              </div>
            ))}
          </HorizontalScrollView>
        ) : (
          <BestSellSlider
            bestProducts={bestProducts}
            translations={translations}
          />
        )}
      </div>
      <div className="container">
        <SeeAll
          href="/products?sort_type=best_selling"
          buttonText={translations["see-all"]}
        />
      </div>
    </>
  );
}
