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
import SubscriptionForm from "@/components/footer/SubscriptionForm";

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
        <section className="new-products bg-gray-50 py-14">
          <div className="container">
            <div className="text-center mb-10">
              {/* <h2 className="text-4xl md:text-5xl font-bold  mb-4 font-poppins"
              >
                {translations["Best Selling"] || "Best Selling"}
              </h2> */}
                <Link href="/products?sort_type=best_selling">
              <h2 className="text-4xl md:text-5xl font-normal mb-4">
                <span className="inline-block font-poppins" style={{color: settings?.colors?.primary}}>{translations["Best"] || "Best"}</span>
                <span className="inline-block ml-2  px-2 font-poppins" >{translations["Selling"] || "Selling"}</span>
              </h2>
              </Link>
              {/* <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto italic">
                <Link
                  href="/products?sort_type=best_selling"
                  className=" transition-colors underline hover:no-underline"
                >
                  {translations["The Most Popular Picks This Season"] ||
                    "The Most Popular Picks This Season"}
                </Link>
              </p> */}
            </div>

            <div className="shadow-lg bg-white rounded-xl p-6">
              <BestSell />
            </div>
          </div>
        </section>
      ) : null}


      {settings?.shop_section ? (
        <section className="new-products">
          <div className="container">
            <div className="py-10 text-center">
              <Link href="/products?sort_type=new">
              <h2 className=" pb-3 font-poppins text-4xl md:text-5xl font-normal">
                 <span className="inline-block font-poppins" style={{color: settings?.colors?.primary}}>{translations["New"] || "New"}</span>
                <span className="inline-block ml-2  px-2 font-poppins" >{translations["Collection"] || "Collection"}</span>
              </h2>
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
                 <Link
                href="/featured-products?sort_type=new">
              <h2 className=" pb-3 font-poppins text-4xl md:text-5xl font-normal">
                 <span className="inline-block font-poppins" style={{color: settings?.colors?.primary}}>{translations["Featured"] || "Featured"}</span>
                <span className="inline-block ml-2  px-2 font-poppins" >{translations["Products"] || "Products"}</span>
              </h2>
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

      {settings?.newsletter_section? (
      <section
        className=" mt-4 pr-4 h-[120px] lg:h-[400px] bg-cover bg-center border border-blue-500"
        style={{
          backgroundImage: "url('/assets/images/banner/newsletter-banner-img.png')"
        }}
      >
        <div className="flex h-full w-full justify-end items-center lg:pr-16">
          <SubscriptionForm settings={settings} />
        </div>
      </section>):null}

      <Popup popup={settings?.popup} />
    </>
  );
}
