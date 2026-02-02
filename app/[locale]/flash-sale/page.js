import ProductList from "@/components/products/ProductList";
import Timer from "@/components/elements/Timer";
import { fetchData } from "@/lib/fetch-data";
import { notFound } from "next/navigation";
import PaginationWithSummery from "@/components/PaginationWithSummery";
import Image from "next/image";
import ViewHTML from "@/components/elements/ViewHTML";

const FlashSellingProducts = async ({ searchParams }) => {
  const params = new URLSearchParams(searchParams);

  const flashSaleResponse = await fetchData({
    api: `product-flash-sale?per_page=30&${params.toString()}`,
  });

  const flashSaleInfo = flashSaleResponse?.flashSale || {};
  const products = flashSaleResponse?.data || [];
  const meta = flashSaleResponse?.meta || {};

  if (flashSaleResponse?.status === false) return notFound();

  return (
    <>
      {/* FLASH SALE BANNER */}
      <div className="bg-white overflow-hidden">
        {flashSaleInfo?.banner_image && (
          <div className="relative w-full h-[180px] sm:h-[240px] md:h-[320px] lg:h-[75vh] bg-gray-100">
            <Image
              src={flashSaleInfo.banner_image}
              alt="Flash Sale"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}

        {/* TITLE + TIMER */}
        <div className="container px-3 sm:px-4">
          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-4
              py-4 md:py-6
              border-b border-slate-200
              mb-6 md:mb-8
            "
          >
            <h2 className="sec-title text-lg sm:text-xl md:text-2xl">
              {flashSaleInfo?.title}
            </h2>

            <div className="shrink-0">
              <Timer targetDate={flashSaleInfo?.expire_time} />
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCT LIST */}
      <div className="container px-3 sm:px-4 mb-8 lg:mb-16">
        <ProductList products={products} isFlashSale />
        {/* PAGINATION */}
        {meta?.total > 30 ? (
          <div className="mt-8 md:mt-10">
            <PaginationWithSummery
              meta={meta}
              totalItemsShowing={products?.length}
            />
          </div>
        ) : null}
        <div className="container">
          <div className="mt-4 md:mt-8">
            <ViewHTML htmlText={flashSaleInfo?.flash_sale_note} />
          </div>
        </div>
      </div>
    </>
  );
};

export default FlashSellingProducts;
