import { Suspense } from "react";
import SortSelect from "@/components/elements/SortSelect";
import ProductList from "@/components/products/ProductList";
import { fetchData } from "@/lib/fetch-data";
import PaginationWithSummery from "@/components/PaginationWithSummery";
import { Link } from "@/navigation";
import { notFound } from "next/navigation";

// ** Search Fallback
function SearchBarFallback() {
  return <>placeholder</>;
}

const FeaturedProducts = async ({ searchParams }) => {
  const params = new URLSearchParams(searchParams);

  const [settingsRes, featuredProductRes] = await Promise.allSettled([
    fetchData({ api: `info/basic` }),
    fetchData({ api: `featured-product?${params.toString()}` }),
  ]);

  const settings =
    settingsRes.status === "fulfilled" ? settingsRes.value?.data || {} : {};
  const featuredProductResponse =
    featuredProductRes.status === "fulfilled"
      ? featuredProductRes.value || {}
      : {};

  if (!settings?.featured_products_section) return notFound();

  const featuredProductInfo = featuredProductResponse?.featuredProduct || {};
  const products = featuredProductResponse?.data || [];
  const meta = featuredProductResponse?.meta || {};

  return (
    <>
      <div
        className="bg-cover bg-top w-full h-[240px] breadcrumb py-6 flex flex-col items-center justify-center text-center"
        style={{
          backgroundImage: `url(${
            featuredProductInfo?.image || "/assets/images/banner/banner.png"
          })`,
        }}
      >
        <div className="container text-center">
          <h3 className="text-2xl font-nomal font-title text-slate-700 mb-3">
            All Featured Products
          </h3>
          <p className="text-xl text-slate-600 mb-3 font-extralight">
            {featuredProductInfo?.name}
          </p>
          <div className="breadcrumb hidden lg:block">
            <Link
              href="/"
              className="text-base text-slate-700 hover:text-primary mr-2"
            >
              Home
            </Link>
            <Link
              href="/featured-products?sort_type=new"
              className="text-base text-slate-700 hover:text-primary ml-2"
            >
              <h1>Featured Products</h1>
            </Link>
          </div>
        </div>
      </div>

      <div className="container lg:mb-20">
        <div className="toolbar flex justify-between items-center bg-slate-50 rounded-xl p-3 my-5">
          <p>Total {products?.length} products</p>
          <Suspense fallback={<SearchBarFallback />}>
            <SortSelect />
          </Suspense>
        </div>
        <ProductList products={products} isfeaturedProduct />
        <PaginationWithSummery
          meta={meta}
          totalItemsShowing={products?.length}
        />
      </div>
    </>
  );
};

export default FeaturedProducts;
