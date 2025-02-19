import { Link } from "@/navigation";
import ProductsWithFilter from "@/components/products/ProductsWithFilter";
import { fetchData } from "@/lib/fetch-data";

const page = async ({ params, searchParams }) => {
  const [settingsRes, tranRes] = await Promise.allSettled([
    fetchData({ api: `info/basic` }),
    fetchData({ api: `translations` }),
  ]);

  const settings =
    settingsRes.status === "fulfilled" ? settingsRes.value?.data || {} : {};
  const translations =
    tranRes.status === "fulfilled" ? tranRes.value?.data || {} : {};

  const getPathBasedOnSortType = (sortType) => {
    switch (sortType) {
      case "new":
        return {
          path: `/products?sort_type=new`,
          title: translations["new-product"] || "নতুন প্রডাক্ট",
        };
      case "best_selling":
        return {
          path: `/products?sort_type=best_selling`,
          title: translations["best-selling-product"] || "বেস্ট সেলিং প্রডাক্ট",
        };
      default:
        return {
          path: `/products`,
          title: translations["all-products"] || "সকল প্রডাক্ট",
        };
    }
  };

  return (
    <>
      {settings?.all_product_banner ? (
        <div
          className="hidden lg:block bg-no-repeat bg-cover w-full h-[240px] breadcrumb py-20"
          style={{
            backgroundImage: `url(${settings?.all_product_banner})`,
          }}
        >
          <div className="container">
            <div className="text-center">
              <h3 className="text-2xl font-bold font-title text-white mb-4">
                {getPathBasedOnSortType(searchParams?.sort_type).title}
              </h3>
              <div>
                <Link
                  href={`/`}
                  className="text-base text-white hover:text-primary"
                >
                  {translations["home"] || "হোম"}
                </Link>
                <Link
                  href={getPathBasedOnSortType(searchParams?.sort_type).path}
                  className="text-base text-white hover:text-primary"
                >
                  {getPathBasedOnSortType(searchParams?.sort_type).title}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="breadcrumb breadcrumb-2 py-5 mb-3 lg:mb-5 border-b border-slate-200 hidden lg:block">
          <div className="container capitalize">
            <div>
              <Link
                href={`/`}
                className="text-base text-slate-600 hover:text-primary"
              >
                {translations["home"] || "Home"}
              </Link>

              <Link
                href={`/products`}
                aria-disabled="true"
                className="text-base text-slate-900 pointer-events-none"
              >
                {translations["products"] || "Products"}
              </Link>
            </div>
          </div>
        </div>
      )}

      <ProductsWithFilter
        customSearchParams={searchParams}
        translations={translations}
      />
    </>
  );
};

export default page;
