import { Link } from "@/navigation";
import { fetchData } from "@/lib/fetch-data";
import dynamic from "next/dynamic";

// Components
import Intro from "./_components/intro";
import Brands from "./_components/brands";
import BestSell from "./_components/best-sale";
import NewArrival from "./_components/new-arrival";
import VideoBanner from "./_components/VideoBanner";
import FeaturedBanner from "./_components/FeaturedBanner";
import HomeAllProducts from "./_components/HomeAllProducts";
// import ServiceFeatures from "./_components/service-features";
import PopularCategories from "./_components/popular-categories";
import SectionTitle from "@/components/elements/SectionTitle";
const FlashSale = dynamic(() => import("./_components/flash-sale"), {
  ssr: false,
});

// ** Import Iocns
import { HiArrowLongRight } from "react-icons/hi2";
import { SeeAll } from "@/components/elements/buttons";
import MiniBanner from "./_components/mini-banner";

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
            <div className="bg-white pt-3">
              <MiniBanner />
            </div>
          </section>
          <section className="banner">
            <div className="bg-white pt-3 lg:pt-0">
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
        <section className="lg:pb-6 mt-6 lg:mt-6 relative">
          <div
            className="all-category py-4 lg:py-6"
            // style={{
            // 	backgroundImage: "linear-gradient(90deg, #603990 0%, #283990 100%)",
            // }}
          >
            <div className="container">
              <SectionTitle
                title={translations["popular-category"] || "Popular Category"}
                href="/categories"
                buttonText={translations["see-all"] || "See All"}
              />
              <div className="mt-6 lg:mt-10">
                <PopularCategories />
              </div>
              <SeeAll
                href="/products"
                buttonText={translations["see-all"] || "See All"}
                invert={true}
              />
            </div>
          </div>
        </section>
      ) : null}

      {settings?.best_selling_section ? (
        <section className="best-sell bg-slate-50 mt-8 lg:mt-0 py-4 md:py-14 lg:pb-14">
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

      {settings?.featured_products_section ? (
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
      ) : null}

      {settings?.shop_section ? (
        <section className="new-products pt-6 lg:pt-14">
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

      {settings?.video_section ? (
        <section className="mt-6 lg:mt-14">
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
