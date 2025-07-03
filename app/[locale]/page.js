import Intro from "./_components/intro";
import FlashSale from "./_components/FlashSale";
import NewArrival from "./_components/NewArrival";
import VideoBanner from "./_components/VideoBanner";
import CategoryBanners from "./_components/CategoryBanners";
import HomeCategoryProducts from "./_components/HomeCategoryProducts";
import { fetchData } from "@/lib/fetch-data";
import { Link } from "@/navigation";
import Featured from "./_components/Featured";
import Popup from "./_components/Popup";
import BestSell from "./_components/best-sale";

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
        <section className="banner">
          <Intro settings={settings} />
        </section>
      ) : null}

      {settings?.category_section ? (
        <section className="banners pt-14">
          <div className="container">
            <CategoryBanners settings={settings} />
          </div>
        </section>
      ) : null}

      <section className="flash-sale mt-10">
        <div className="container">
          <FlashSale />
        </div>
      </section>

      {settings?.video_section ? (
        <section className="video-banner">
          <VideoBanner />
        </section>
      ) : null}

      {settings?.best_selling_section ? (
        <section className="new-products">
          <div className="container">
            <div className="py-10 text-center">
              <h2 className="sec-title pb-3">
                {translations["Best Selling"] || "Best Selling"}
              </h2>
               <Link href="/products?sort_type=best_selling" className="underline">
                {translations["The Most Popular Picks This Season"] ||
                  "The Most Popular Picks This Season"}
              </Link>
            </div>

            <div className="">
              <BestSell/>
            </div>
          </div>
        </section>
      ) : null}


      {settings?.shop_section ? (
        <section className="new-products">
          <div className="container">
            <div className="py-10 text-center">
              <h2 className="sec-title pb-3">
                {translations["new-arrival"] || "New Collection"}
              </h2>
              <Link href="/products?sort_type=new" className="underline">
                {translations["browse-our-new-collections"] ||
                  "Browse our new collections"}
              </Link>
            </div>

            <div className="">
              <NewArrival />
            </div>
          </div>
        </section>
      ) : null}

      {settings?.featured_products_section ? (
        <section className="new-products">
          <div className="container">
            <div className="py-10 text-center">
              <h2 className="sec-title pb-3">
                {translations["featured-products"] || "Featured Products"}
              </h2>
              <Link href="/featured-products?sort_type=new" className="underline">
                Browse our featured products
              </Link>
            </div>

            <div className="">
              <Featured />
            </div>
          </div>
        </section>
      ) : null}

      <section className="home-category-products mb-10">
        <HomeCategoryProducts />
      </section>

      <Popup popup={settings?.popup} />
    </>
  );
}
