"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import Timer from "@/components/elements/Timer";
// import ProductSlider from "@/components/ProductSlider";
import { useGetProductFlashSaleQuery } from "@/store/api/productFlashSaleAPI";
import { useAppSelector } from "@/store/hooks";
import ProductList from "@/components/products/ProductList";
import Image from "next/image";
import useHover from "@/hooks/useHover";
import type { FlashSale } from "@/types";

const FlashSale = () => {
  const { locale } = useParams<{ locale: string }>();
  const { translations, settings } = useAppSelector((state) => state.common);
  const { isHovered: isHoveredElement1, bind: bindElement2 } = useHover();

  const { data: flashSaleData, isLoading } = useGetProductFlashSaleQuery({
    locale,
    searchQuery: `per_page=5`,
  });

  const flashSaleInfo: FlashSale = flashSaleData?.flashSale || {};
  const products = flashSaleData?.data || [];
  if (flashSaleData?.status === false || isLoading || !flashSaleData)
    return null;

  return (
    <div className="relative mt-16">
      <div className="flash-sale-banner flex flex-col lg:flex-row bg-white overflow-hidden rounded-xl">
        {/* LEFT CONTENT */}
        <div className="w-full lg:w-[25%] p-6 flex flex-col justify-center gap-2 z-10 order-1 bg-slate-50">
          <Timer targetDate={flashSaleInfo?.expire_time} />

          <h2 className="sec-title mt-3">{flashSaleInfo?.title}</h2>

          <Link
            href={`/flash-sale`}
            aria-label="View All Flash Sale Products"
            {...bindElement2}
            className="action-btn mt-4 inline-flex items-center justify-center px-10 py-1.5 text-sm lg:text-base rounded w-fit"
            style={{
              border: `1px solid ${
                isHoveredElement1
                  ? settings?.colors?.primary_text
                  : settings?.colors?.default_text
              }`,
              backgroundColor: isHoveredElement1
                ? settings?.colors?.primary
                : "transparent",
              color: isHoveredElement1
                ? settings?.colors?.primary_text
                : settings?.colors?.default_text,
            }}
          >
            {translations["view-campaign"] || "View Campaign"}
          </Link>
        </div>

        {/* RIGHT IMAGE */}
        {flashSaleInfo?.banner_image && (
          <div className="relative w-full lg:w-[75%] h-[240px] md:h-[320px] lg:h-[420px] order-2 overflow-hidden rounded-b-xl lg:rounded-b-none lg:rounded-r-xl bg-gray-100">
            <Image
              src={flashSaleInfo.banner_image}
              alt="Flash Sale"
              fill
              sizes="(max-width: 1024px) 100vw, 75vw"
              className="object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      <div className="flashSale-slider pt-6 md:pt-12 pb-4">
        <ProductList products={products} isFlashSale={true} fixedItems={3} />
      </div>
    </div>
  );
};

export default FlashSale;
