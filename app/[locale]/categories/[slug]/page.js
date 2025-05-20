import { Link } from "@/navigation";
// import Image from "next/image";
import { fetchData } from "@/lib/fetch-data";
import ProductsWithFilter from "@/components/products/ProductsWithFilter";
// import BestProductsContainer from "../../_components/best-sale/BestProductsContainer";
import CategorySlider from "../../_components/popular-categories/CategorySlider";

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
      ) : (
        <div className="breadcrumb breadcrumb-2 py-5 border-b border-slate-200 hidden lg:block">
          <div className="container capitalize">
            <div>
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
            {/* <BestProductsContainer id={category.child_categories[0].parent_id} /> */}
            <CategorySlider categoryList={category?.child_categories} />
          </div>
        </div>
      ): null}

      <ProductsWithFilter
        customSearchParams={customSearchParams}
        category={category}
        translations={translations}
      />
    </>
  );
};

export default page;
