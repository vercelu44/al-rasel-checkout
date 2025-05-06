import { fetchData } from "@/lib/fetch-data";
import dynamic from "next/dynamic";

// Components
import Intro from "./_components/intro";
import Brands from "./_components/brands";
import BestSell from "./_components/best-sale";
import NewArrival from "./_components/new-arrival";
import VideoBanner from "./_components/VideoBanner";
import FeaturedBanner from "./_components/FeaturedBanner";
// import HomeAllProducts from "./_components/HomeAllProducts";
// import ServiceFeatures from "./_components/service-features";
import PopularCategories from "./_components/popular-categories";
import SectionTitle from "@/components/elements/SectionTitle";
const FlashSale = dynamic(() => import("./_components/flash-sale"), {
  ssr: false,
});

// ** Import Iocns
import { SeeAll } from "@/components/elements/buttons";
import MiniBanner from "./_components/mini-banner";
import HomeCategoryProducts from "./_components/home-category-products";

export default async function Home1() {
  const [settingsRes, transRes] = await Promise.allSettled([
    fetchData({ api: `info/basic` }),
    fetchData({ api: "translations" }),
  ]);

  const settings =
    settingsRes.status === "fulfilled" ? settingsRes.value?.data || {} : {};
  const translations =
    transRes.status === "fulfilled" ? transRes.value?.data || {} : {};
  return (
    <>
      {settings?.slider_section ? (
        <>
          {/* <section className="banner hidden md:block">
              <div className="bg-white">
                <MiniBanner />
              </div>
            </section> */}

          <section className="banner pt-6">
            <div className="bg-white">
              <Intro />
            </div>
          </section>
        </>
      ) : null}

      {/* <section className="service-features mt-3 lg:mt-5">
                <ServiceFeatures />
            </section> */}

      <FlashSale translations={translations} />
      {settings?.category_section ? (
        <section className="lg:pb-0 mt-6 lg:mt-10 relative">
          <div className="all-category py-4 md:py-0 lg:py-0 bg-gradient-custom from-amber-400 to-primary md:bg-none">
            <div className="container">
             
                <SectionTitle
                  title={translations["popular-category"] || "Popular Category"}
                  href="/categories"
                  buttonText={translations["see-all"] || "See All"}
                />

              <div className="mt-6 lg:mt-10 md:pb-12 lg:pb-0">
                <PopularCategories />
              </div>
                <SeeAll
                  href="/categories"
                  buttonText={translations["see-all"] || "See All"}
                  invert={true}
                />
            </div>
          </div>
        </section>
      ) : null}

      {settings?.best_selling_section ? (
        <section className="best-sell bg-primary/20 mt-8 md:mt-10 py-4 md:py-10 lg:pb-14">
          <BestSell translations={translations} />
        </section>
      ) : null}

      {settings?.featured_products_section ? (
        <section className="banners pt-6 lg:pt-14">
          <div className="container">
            <FeaturedBanner />
          </div>
        </section>
      ) : null}

      {/* {settings?.featured_products_section ? (
        <section className="all-products mt-6 lg:mt-14">
          <div className="container">
            <SectionTitle
              title={translations["all-products"]}
              href="/products"
              buttonText={translations["see-all"]}
            />
            <HomeAllProducts translations={translations} />
            <SeeAll href="/products" buttonText={translations["see-all"]} />
          </div>
        </section>
      ) : null} */}

      {settings?.shop_section ? (
        <section className="new-products py-6 lg:py-12">
          <div className="container">
            <SectionTitle
              title={translations["new-in-shop"]}
              href="/products?sort_type=new"
              buttonText={translations["see-all"]}
            />
          </div>
          <NewArrival />
          <div className="container">
            <SeeAll
              href="/products?sort_type=new"
              buttonText={translations["see-all"]}
            />
          </div>
        </section>
      ) : null}

      <section className="home-category-products pb-3 lg:pb-14 bg-custom-bg">
        <HomeCategoryProducts />
      </section>

      {settings?.video_section ? (
        <section className="mt-6 lg:mt-6">
          <VideoBanner translations={translations} />
        </section>
      ) : null}

      {settings?.brand_section ? (
        <section className="all-brands pt-6 pb-8 lg:py-14">
          <div className="lg:container">
            <SectionTitle title={translations["our-brands"]} />
            <div className="brands-slider mt-1 lg:mt-6  relative">
              <Brands />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
