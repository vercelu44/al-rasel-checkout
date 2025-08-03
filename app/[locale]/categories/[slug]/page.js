import { Link } from "@/navigation";
import { fetchData } from "@/lib/fetch-data";
import ProductsWithFilter from "@/components/products/ProductsWithFilter";
import ResponsiveSlider from "./ResponsiveSlider";
import Image from "next/image";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params, searchParams }, parent) => {
  const parentMetaData = await parent;
  let category = {};
  const queryString = new URLSearchParams(searchParams).toString();
  const fullUrl = queryString
    ? `/categories/${params.slug}?${queryString}`
    : `/categories/${params.slug}`;
  console.log({ fullUrl }, "7834342874");
  try {
    const categoryRes = await fetchData({ api: `category/${params?.slug}` });
    category = categoryRes?.data;
    return {
      title: `${category?.category_name} || ${parentMetaData.applicationName}`,
      description: `${category?.category_name} a category of ${parentMetaData.applicationName}`,
      openGraph: {
        title: `${category?.category_name} || ${parentMetaData.applicationName}`,
        description: `All ${category?.category_name} products of ${parentMetaData.applicationName}`,
        url: fullUrl,
      },
      alternates: {
        canonical: fullUrl,
      },
    };
  } catch (error) {
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
                <h1 className="sr-only">Important SEO Heading</h1>
                <h1>{category?.category_name}</h1>
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
