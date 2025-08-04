import { Link } from "@/navigation";
import { fetchData } from "@/lib/fetch-data";
import ProductsWithFilter from "@/components/products/ProductsWithFilter";
import ResponsiveSlider from "./ResponsiveSlider";
import Image from "next/image";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params, searchParams }, parent) => {
  const parentMetaData = await parent;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.alrasel.net";

  try {
    const categoryRes = await fetchData({ api: `category/${params.slug}` });
    const category = categoryRes?.data || {};

    // Base path without domain or query params
    const basePath = `/categories/${params.slug}`;
    const queryString = new URLSearchParams(searchParams).toString();

    // Full URL with query params if they exist
    const fullUrl = queryString
      ? `${baseUrl}${basePath}?${queryString}`
      : `${baseUrl}${basePath}`;

    const categoryName = category.category_name || "Category";
    const appName = parentMetaData?.applicationName || "App";

    return {
      title: `${categoryName} | ${appName}`,
      description: `${categoryName} - a category of ${appName}`,
      metadataBase: new URL(baseUrl), // Required for proper URL resolution
      alternates: {
        canonical: fullUrl,
        languages: {
          en: `${baseUrl}${basePath}`, // Default language
          bn: `${baseUrl}/bn${basePath}`,
          ar: `${baseUrl}/ar${basePath}`,
          "x-default": `${baseUrl}${basePath}`,
        },
      },
      openGraph: {
        title: `${categoryName} | ${appName}`,
        description: `All ${categoryName} products of ${appName}`,
        url: fullUrl,
        images: [
          {
            url: category.image_url || "/default-og-image.jpg", // Add fallback image
            width: 1200,
            height: 630,
            alt: categoryName,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${categoryName} | ${appName}`,
        description: `Browse ${categoryName} products`,
      },
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error in generateMetadata:", error);
    }
    return notFound();
  }
};

const page = async ({ params, searchParams }) => {
  const { slug } = params;
  const [categoryResponse, tranRes] = await Promise.allSettled([
    fetchData({ api: `category/${slug}` }),
    fetchData({ api: `translations` }),
  ]);

  const category =
    categoryResponse.status === "fulfilled"
      ? categoryResponse.value?.data || {}
      : {};

  const translations =
    tranRes.status === "fulfilled" ? tranRes.value?.data || {} : {};

  //forming search params
  const customSearchParams = {
    category_id: category?.id,
    ...searchParams,
  };

  return (
    <>
      <h1 className="sr-only">Important Heading</h1>
      {/* breadcrumb */}
      {category?.image ? (
        <>
          <div
            className="hidden lg:block bg-no-repeat bg-cover w-full h-[240px] breadcrumb py-20"
            style={{
              backgroundImage: `url(${category?.image})`,
            }}
          >
            <div className="container">
              {/* <div className="text-center capitalize">
              <h3 className="text-2xl font-bold font-title text-white mb-4">
                {category?.category_name}
              </h3>
              <div>
                <Link
                  href={`/`}
                  className="text-base text-white hover:text-primary"
                >
                  {translations["home"] || "হোম"}
                </Link>
                <Link
                  href={`/categories`}
                  className="text-base text-white hover:text-primary"
                >
                  {translations["category"] || "ক্যাটাগরি"}
                </Link>
                <Link
                  href={`/categories/${category.slug}`}
                  aria-disabled="true"
                  className="text-base text-white pointer-events-none"
                >
                  {category?.category_name}
                </Link>
              </div>
            </div> */}
            </div>
          </div>
          <Image
            src={category?.image}
            alt={category?.category_name}
            width={1000}
            height={240}
            className="w-full h-full object-cover block lg:hidden"
          />
        </>
      ) : (
        <div className="breadcrumb breadcrumb-2 py-5 border-b border-slate-200 hidden lg:block">
          <div className="container capitalize">
            <div className="flex">
              <Link
                href={`/`}
                className="text-base text-slate-600 hover:text-primary"
              >
                {translations["home"] || "হোম"}
              </Link>
              <Link
                href={`/categories`}
                className="text-base text-slate-900 hover:text-primary"
              >
                {translations["category"] || "ক্যাটাগরি"}
              </Link>
              <Link
                href={`/categories/${category.slug}`}
                aria-disabled="true"
                className="text-base text-slate-900 pointer-events-none"
              >
                {category?.category_name}
              </Link>
            </div>
          </div>
        </div>
      )}

      {category?.child_categories?.length ? (
        <div className="border-b border-slate-200 pt-3 lg:py-8">
          <h6 className="container text-base font-semibold font-title text-slate-900 lg:mb-4">
            {translations["related-categories"] || "Related Categories"}
          </h6>
          <div className="lg:container">
            <ResponsiveSlider categories={category?.child_categories} />
          </div>
        </div>
      ) : null}

      <ProductsWithFilter
        customSearchParams={customSearchParams}
        category={category}
        translations={translations}
      />
    </>
  );
};

export default page;
