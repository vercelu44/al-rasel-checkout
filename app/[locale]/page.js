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

export default async function Home() {
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
          <section className="banner">
            <div className="bg-white">
              <MiniBanner />
            </div>
          </section>

          <section className="banner">
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
        <section className="lg:pb-0 mt-6 lg:mt-0 relative">
          <div className="all-category py-0 ">
            <div className="container">
              {/* <SectionTitle
                  title={translations["popular-category"] || "Popular Category"}
                  href="/categories"
                  buttonText={translations["see-all"] || "See All"}
                /> */}

              <div className="mt-6 lg:mt-10 md:pb-12 lg:pb-0">
                <PopularCategories />
              </div>
              {/* <SeeAll
                  href="/categories"
                  buttonText={translations["see-all"] || "See All"}
                  invert={true}
                /> */}
            </div>
          </div>
        </section>
      ) : null}

      {settings?.best_selling_section ? (
        <section className="best-sell bg-primary/20 py-4 md:py-4 lg:pb-0">
          <BestSell translations={translations} />
        </section>
      ) : null}

      {settings?.featured_products_section ? (
        <section className="banners pt-6 lg:pt-1">
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
        <section className="new-products pt-6 lg:py-0 lg:-mb-6">
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

      <section className="home-category-products pb-3 lg:pb-0 bg-custom-bg">
        <HomeCategoryProducts className="py-1 " />
      </section>

      {settings?.video_section ? (
        <section className="mt-6 lg:mt-6">
          <VideoBanner translations={translations} />
        </section>
      ) : null}

      {settings?.brand_section ? (
        <section className="all-brands pt-6 pb-8 lg:py-0">
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
