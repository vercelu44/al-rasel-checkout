import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchData } from "@/lib/fetch-data";
import { getSlicedText } from "@/utils/format-text";
import AllProducts from "@/components/products/AllProducts";
import ProductDetails from "./_components/ProductDetails";
import LastVisitedProducts from "./_components/LastVisitedProducts";
import ProductMicroData from "@/components/products/ProductMicroData";
import FallbackUI from "@/components/elements/fallback-ui";
import type { ApiResponse, PageProps, Product, SiteSettings, Translations } from "@/types";

const ProductView = async ({ params }: PageProps<{ slug: string }>) => {
  const { slug } = await params;

  if (!slug || slug === "null") return notFound();

  // ⚡ All APIs ekshathe fetch with Promise.allSettled
  const [settingsRes, productRes, transRes] = await Promise.allSettled([
    fetchData<ApiResponse<SiteSettings>>({ api: `info/basic` }),
    fetchData<ApiResponse<Product>>({ api: `products/${slug}` }),
    fetchData<ApiResponse<Translations>>({ api: "translations" }),
  ]);

  // --- Settings ---
  const settings: SiteSettings =
    settingsRes.status === "fulfilled" ? settingsRes.value?.data || {} : null; // null means API fail

  // --- Product ---
  const productRaw =
    productRes.status === "fulfilled" ? productRes.value : null;

  // --- Translations ---
  const translations: Translations =
    transRes.status === "fulfilled" ? transRes.value?.data || {} : null;

  // console.log(productRes)

  // If fetchData returned 404 → actual not found
  //   if (	productRaw?.status === 404) return notFound();

  const product = productRaw?.data;

  // ⚡ If any **required API** fail, show FallbackUI
  if (!settings || !translations || !product) {
    return (
      <FallbackUI message="Failed to load some data. Please try again later." />
    );
  }

  // Category Filter
  const customSearchParams = {
    category_id: product?.category?.id,
  };

  return (
    <>
      <ProductMicroData product={product} />
      <div className="container">
        <div className="breadcrumb breadcrumb-2 py-5">
          <div>
            <Link
              href={`/`}
              className="text-base text-slate-600 hover:text-secondary"
            >
              {translations["home"] || "Home"}
            </Link>
            <Link
              href={`/products`}
              className="text-base text-slate-600 hover:text-secondary"
            >
              {translations["products"] || "Products"}
            </Link>
            <Link
              href={`/products/${slug}`}
              className={`text-base text-slate-900 hover:text-secondary`}
            >
              {getSlicedText(slug, 50)}
            </Link>
          </div>
        </div>
      </div>
      <div className="container">
        <ProductDetails
          translations={translations}
          product={product}
          settings={settings}
        ></ProductDetails>
      </div>
      <section id="same-category-products">
        <div className="container lg:pt-14">
          <h2 className="sec-title text-center mb-8">
            {translations["similar-products"] || "Similar Products"}
          </h2>
          <div className="category-products">
            <AllProducts customSearchParams={customSearchParams} />
          </div>
        </div>
      </section>

      <LastVisitedProducts visitedProductId={product?.id} />
    </>
  );
};

export default ProductView;
