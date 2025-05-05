import { Link } from "@/navigation";
import Image from "next/image";
import { fetchData } from "@/lib/fetch-data";
import ProductsWithFilter from "@/components/products/ProductsWithFilter";

// ** Imoprt icons
import noImage from "@/public/assets/images/no-image.png";
import HorizontalScrollView from "@/components/elements/HorizontalScrollView";

const page = async ({ params, searchParams }) => {
  const { slug } = params;
  const [categoryResponse, dataResponse, tranRes] = await Promise.allSettled([
    fetchData({ api: `category/${slug}` }),
    fetchData({ api: "popular-categories" }),
    fetchData({ api: `translations` }),
  ]);

  const category =
    categoryResponse.status === "fulfilled"
      ? categoryResponse.value?.data || {}
      : {};
  const popularCategories =
    dataResponse.status === "fulfilled" ? dataResponse.value?.data || [] : [];

  const translations =
    tranRes.status === "fulfilled" ? tranRes.value?.data || {} : {};

  //forming search params
  const customSearchParams = {
    category_id: category?.id,
    ...searchParams,
  };

  // console.log(category);

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
            <div className="text-center capitalize">
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
            </div>
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

      <div className="border-b border-slate-200 pt-3 lg:py-8">
        <h6 className="container text-base font-semibold font-title text-slate-900 lg:mb-4">
          {translations["top-5-categories"] || "সেরা ৫টি ক্যাটাগরি"}
        </h6>
        <div className="lg:container">
          <HorizontalScrollView
            className={"space-x-2 lg:space-x-4 py-3 lg:px-0"}
          >
            {popularCategories?.slice(0, 5)?.map((cat, i) => (

              <div
                key={i}
                className="flex flex-col items-center justify-center"
                title={cat.category_name}
              >
                <Link href={`/categories/${cat.slug}`} className="flex flex-col items-center group gap-2">
                  <div
                    className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 border-2 bg-slate-200`}
                  >
                    <Image
              				src={cat?.icon || noImage}
              				alt={cat.category_name}
              				width={48}
              				height={31}
              				className=" object-contain"
              			/>
                  </div>
                  <span className="text-base text-slate-900 line-clamp-1 text-ellipsis">
                  {cat.category_name}
                  </span>
                </Link>
              </div>
            ))}
          </HorizontalScrollView>
        </div>
      </div>

      <ProductsWithFilter
        customSearchParams={customSearchParams}
        category={category}
        translations={translations}
      />
    </>
  );
};

export default page;
