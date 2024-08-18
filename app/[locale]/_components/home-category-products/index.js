import ProductSlider from "@/components/ProductSlider";
import SectionTitle from "@/components/elements/SectionTitle";
import { SeeAll } from "@/components/elements/buttons";
import { fetchData } from "@/lib/fetch-data";
import HomeCategoryBannerSlider from "./HomeCategoryBannerSlider";

const HomeCategoryProducts = async () => {
  const [transRes] = await Promise.allSettled([
    fetchData({ api: "translations" }),
  ]);
  const translations =
    transRes.status === "fulfilled" ? transRes.value?.data || {} : {};
  const data = await fetchData({ api: "homepage-category?no_child=1" });
  const categoryWiseProducts = data?.data || [];

  return categoryWiseProducts.map(({ category, products, images }, index) => (
    <div key={index} className="container">
      <div className="pt-10">
        <HomeCategoryBannerSlider
          sliders={images}
          url={`/categories/${category?.slug}`}
        />
      </div>
      <div className="pb-10 flex items-center justify-between">
        <SectionTitle
          title={category?.category_name}
          href={`/categories/${category?.slug}`}
        />
      </div>
      <div className="">
        <ProductSlider products={products} sliderId={index} />
        <SeeAll
          href={`/categories/${category?.slug}`}
          buttonText={translations["see-all"]}
        />
      </div>
    </div>
  ));
};

export default HomeCategoryProducts;
