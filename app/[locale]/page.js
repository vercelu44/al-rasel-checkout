// import Intro from "./_components/intro";
// import FlashSale from "./_components/FlashSale";
// import NewArrival from "./_components/NewArrival";
// import VideoBanner from "./_components/VideoBanner";
// import CategoryBanners from "./_components/CategoryBanners";
// import HomeCategoryProducts from "./_components/HomeCategoryProducts";
// import { fetchData } from "@/lib/fetch-data";
// import { Link } from "@/navigation";
// import Featured from "./_components/Featured";
// import Popup from "./_components/Popup";
// import BestSell from "./_components/best-sale";
// import SubscriptionForm from "@/components/footer/SubscriptionForm";

// export default async function Home() {
//   const [settingsRes, transRes] = await Promise.allSettled([
//     fetchData({ api: `info/basic` }),
//     fetchData({ api: "translations" }),
//   ]);

//   const settings =
//     settingsRes.status === "fulfilled" ? settingsRes.value?.data || {} : {};
//   const translations =
//     transRes.status === "fulfilled" ? transRes.value?.data || {} : {};
//   const headerColor =
//     process.env.NEXT_PUBLIC_HEADER_COLOR ||
//     settings?.colors?.primary ||
//     "#000000";
//   return (
//     <>
//       {settings?.slider_section ? (
//         <section className="banner">
//           <Intro settings={settings} />
//         </section>
//       ) : null}

//       {settings?.category_section ? (
//         <section className="banners pt-14">
//           <div className="container">
//             <CategoryBanners settings={settings} />
//           </div>
//         </section>
//       ) : null}

//       <section className="flash-sale mt-10">
//         <div className="container">
//           <FlashSale />
//         </div>
//       </section>

//       {settings?.video_section ? (
//         <section className="video-banner">
//           <VideoBanner />
//         </section>
//       ) : null}

//       {settings?.best_selling_section ? (
//         <section className="new-products bg-gray-50 py-14">
//           <div className="container">
//             <div className="text-center mb-10">
//               {/* <h2 className="text-4xl md:text-5xl font-bold  mb-4 font-poppins"
//               >
//                 {translations["Best Selling"] || "Best Selling"}
//               </h2> */}
//               <Link href="/products?sort_type=best_selling">
//                 <h2 className="text-4xl md:text-5xl font-normal mb-4">
//                   <span
//                     className="inline-block font-poppins"
//                     style={{ color: headerColor }}
//                   >
//                     {translations["Best"] || "Best"}
//                   </span>
//                   <span className="inline-block ml-2  px-2 font-poppins">
//                     {translations["Selling"] || "Selling"}
//                   </span>
//                 </h2>
//                 <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto capitalize italic">
//                   {translations["see-all-products"] || "See All Products"}
//                 </p>
//               </Link>
//             </div>

//             <div className="shadow-lg bg-white rounded-xl p-6">
//               <BestSell />
//             </div>
//           </div>
//         </section>
//       ) : null}

//       {settings?.shop_section ? (
//         <section className="new-products">
//           <div className="container">
//             <div className="py-10 text-center">
//               <Link href="/products?sort_type=new">
//                 <h2 className=" pb-3 font-poppins text-4xl md:text-5xl font-normal">
//                   <span
//                     className="inline-block font-poppins"
//                     style={{ color: headerColor }}
//                   >
//                     {translations["New"] || "New"}
//                   </span>
//                   <span className="inline-block ml-2  px-2 font-poppins">
//                     {translations["Collection"] || "Collection"}
//                   </span>
//                 </h2>
//                 <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto capitalize italic">
//                   {translations["see-all-products"] || "See All Products"}
//                 </p>
//               </Link>
//             </div>

//             <div className="">
//               <NewArrival />
//             </div>
//           </div>
//         </section>
//       ) : null}

//       {settings?.featured_products_section ? (
//         <section className="new-products">
//           <div className="container">
//             <div className="py-10 text-center">
//               <Link href="/featured-products?sort_type=new">
//                 <h2 className=" pb-3 font-poppins text-4xl md:text-5xl font-normal">
//                   <span
//                     className="inline-block font-poppins"
//                     style={{ color: headerColor }}
//                   >
//                     {translations["Featured"] || "Featured"}
//                   </span>
//                   <span className="inline-block ml-2  px-2 font-poppins">
//                     {translations["Products"] || "Products"}
//                   </span>
//                 </h2>
//                  <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto capitalize italic">
//                   {translations["see-all-products"] || "See All Products"}
//                 </p>
//               </Link>
//             </div>

//             <div className="">
//               <Featured />
//             </div>
//           </div>
//         </section>
//       ) : null}

//       <section className="home-category-products mb-10">
//         <HomeCategoryProducts />
//       </section>

//       {settings?.newsletter_section ? (
//         <section
//           className=" mt-4 pr-4 h-[120px] lg:h-[400px] bg-cover bg-center border border-blue-500"
//           style={{
//             backgroundImage:
//               "url('/assets/images/banner/newsletter-banner-img.png')",
//           }}
//         >
//           <div className="flex h-full w-full justify-end items-center lg:pr-16">
//             <SubscriptionForm settings={settings} />
//           </div>
//         </section>
//       ) : null}

//       <Popup popup={settings?.popup} />
//     </>
//   );
// }



import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { fetchData } from "@/lib/fetch-data";
import { Link } from "@/navigation";
import SubscriptionForm from "@/components/footer/SubscriptionForm";

// Lazy load components that aren't immediately visible
const Intro = dynamic(() => import("./_components/intro"), {
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse" />
});

const FlashSale = dynamic(() => import("./_components/FlashSale"));
const NewArrival = dynamic(() => import("./_components/NewArrival"));
const VideoBanner = dynamic(() => import("./_components/VideoBanner"));
const CategoryBanners = dynamic(() => import("./_components/CategoryBanners"));
const HomeCategoryProducts = dynamic(() => import("./_components/HomeCategoryProducts"));
const Featured = dynamic(() => import("./_components/Featured"));
const BestSell = dynamic(() => import("./_components/best-sale"));
const Popup = dynamic(() => import("./_components/Popup"), { ssr: false });

export default async function Home() {
  const [settingsRes, transRes] = await Promise.allSettled([
    fetchData({ api: `info/basic` }),
    fetchData({ api: "translations" }),
  ]);

  const settings =
    settingsRes.status === "fulfilled" ? settingsRes.value?.data || {} : {};
  const translations =
    transRes.status === "fulfilled" ? transRes.value?.data || {} : {};
  const headerColor =
    process.env.NEXT_PUBLIC_HEADER_COLOR ||
    settings?.colors?.primary ||
    "#000000";

  return (
    <>
      {/* Priority: Load slider immediately but optimize images inside */}
      {settings?.slider_section ? (
        <section className="banner">
          <Suspense fallback={<div className="h-[400px] bg-gray-100" />}>
            <Intro settings={settings} />
          </Suspense>
        </section>
      ) : null}

      {/* Lazy load category banners */}
      {settings?.category_section ? (
        <section className="banners pt-14">
          <div className="container">
            <Suspense fallback={<div className="h-[200px] bg-gray-50 animate-pulse" />}>
              <CategoryBanners settings={settings} />
            </Suspense>
          </div>
        </section>
      ) : null}

      <section className="flash-sale mt-10">
        <div className="container">
          <Suspense fallback={<div className="h-[300px] bg-gray-50" />}>
            <FlashSale />
          </Suspense>
        </div>
      </section>

      {settings?.video_section ? (
        <section className="video-banner">
          <Suspense fallback={<div className="h-[400px] bg-black" />}>
            <VideoBanner />
          </Suspense>
        </section>
      ) : null}

      {settings?.best_selling_section ? (
        <section className="new-products bg-gray-50 py-14">
          <div className="container">
            <div className="text-center mb-10">
              <Link href="/products?sort_type=best_selling">
                <h2 className="text-4xl md:text-5xl font-normal mb-4">
                  <span
                    className="inline-block font-poppins"
                    style={{ color: headerColor }}
                  >
                    {translations["Best"] || "Best"}
                  </span>
                  <span className="inline-block ml-2 px-2 font-poppins">
                    {translations["Selling"] || "Selling"}
                  </span>
                </h2>
                <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto capitalize italic">
                  {translations["see-all-products"] || "See All Products"}
                </p>
              </Link>
            </div>

            <div className="shadow-lg bg-white rounded-xl p-6">
              <Suspense fallback={<div className="h-[400px] bg-white animate-pulse" />}>
                <BestSell />
              </Suspense>
            </div>
          </div>
        </section>
      ) : null}

      {settings?.shop_section ? (
        <section className="new-products">
          <div className="container">
            <div className="py-10 text-center">
              <Link href="/products?sort_type=new">
                <h2 className="pb-3 font-poppins text-4xl md:text-5xl font-normal">
                  <span
                    className="inline-block font-poppins"
                    style={{ color: headerColor }}
                  >
                    {translations["New"] || "New"}
                  </span>
                  <span className="inline-block ml-2 px-2 font-poppins">
                    {translations["Collection"] || "Collection"}
                  </span>
                </h2>
                <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto capitalize italic">
                  {translations["see-all-products"] || "See All Products"}
                </p>
              </Link>
            </div>

            <div>
              <Suspense fallback={<div className="h-[400px] bg-gray-50" />}>
                <NewArrival />
              </Suspense>
            </div>
          </div>
        </section>
      ) : null}

      {settings?.featured_products_section ? (
        <section className="new-products">
          <div className="container">
            <div className="py-10 text-center">
              <Link href="/featured-products?sort_type=new">
                <h2 className="pb-3 font-poppins text-4xl md:text-5xl font-normal">
                  <span
                    className="inline-block font-poppins"
                    style={{ color: headerColor }}
                  >
                    {translations["Featured"] || "Featured"}
                  </span>
                  <span className="inline-block ml-2 px-2 font-poppins">
                    {translations["Products"] || "Products"}
                  </span>
                </h2>
                <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto capitalize italic">
                  {translations["see-all-products"] || "See All Products"}
                </p>
              </Link>
            </div>

            <div>
              <Suspense fallback={<div className="h-[400px] bg-gray-50" />}>
                <Featured />
              </Suspense>
            </div>
          </div>
        </section>
      ) : null}

      <section className="home-category-products mb-10">
        <Suspense fallback={<div className="h-[300px] bg-gray-50" />}>
          <HomeCategoryProducts />
        </Suspense>
      </section>

      {settings?.newsletter_section ? (
        <section
          className="mt-4 pr-4 h-[120px] lg:h-[400px] bg-cover bg-center border border-blue-500"
          style={{
            backgroundImage:
              "url('/assets/images/banner/newsletter-banner-img.png')",
          }}
        >
          <div className="flex h-full w-full justify-end items-center lg:pr-16">
            <SubscriptionForm settings={settings} />
          </div>
        </section>
      ) : null}

      <Popup popup={settings?.popup} />
    </>
  );
}
