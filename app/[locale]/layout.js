import "rc-slider/assets/index.css";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { notFound } from "next/navigation";

// ** Import Components
import Footer from "@/components/footer";
import CheckConnection from "@/components/CheckConnection";
import Header from "@/components/navigation/header";
import CartTray from "@/components/elements/CartTray";
import ReduxProvider from "@/store/ReduxProvider";

//** Swiper Slider
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

import Cart from "@/components/side-drawers/Cart";
import ProductSelect from "@/components/side-drawers/ProductSelect";
import PersistUser from "@/components/utility/PersistUser";
import GlobalLoader from "@/components/utility/GlobalLoader";
import ServerDataProvider from "@/components/utility/ServerDataProvider";
import { fetchData } from "@/lib/fetch-data";
import VideoPlayerModal from "@/components/modals/VideoPlayerModal";
import SizeChangeModal from "@/components/modals/SizeChangeModal";

export const generateMetadata = async ({ params }) => {
  let settings = {};
  let appName = "";
  let favicon = "/favicon.ico";

  try {
    const settingsRes = await fetchData({
      api: `info/basic`,
      locale: params?.locale,
    });

    settings = settingsRes?.data || {};
    appName = settings?.name?.trim();
    favicon = settings?.favicon;
  } catch (error) {
    console.log(error);
  }

  const fallbackSuffix = "Your Trusted Online Store for Best Deals & More";
  const finalBaseName =
    appName && appName.length > 0 ? appName : fallbackSuffix;

  const finalTitle = settings?.seo?.meta_title
    ? `${finalBaseName} - ${settings.seo.meta_title}`
    : `${finalBaseName} - ${fallbackSuffix}`;

  const fallbackDescription =
    `Shop quality products at great prices at ${finalBaseName}. ` +
    `Discover trending items, fast delivery, secure checkout and an unmatched online shopping experience.`;

  const finalDescription =
    settings?.seo?.meta_description?.trim()?.length > 0
      ? settings.seo.meta_description
      : fallbackDescription;
  return {
    title: {
      default: finalTitle,
      template: `%s || ${finalTitle}`,
    },

    description: finalDescription,

    applicationName: finalBaseName,

    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: `/`,
      siteName: finalBaseName,
      type: "website",
    },

    icons: {
      icon: [
        {
          type: "image/x-icon",
          sizes: "64x73",
          url: favicon || `/favicon.ico`,
        },
      ],
    },

    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL),

    alternates: {
      canonical: `/`,
    },

    verification: {
      google: settings.google_site_verification,
      other: {
        "facebook-domain-verification": settings.fb_domain_verification,
        "google-adsense-account": settings.google_adsense_verification,
      },
    },
  };
};

const locales = ["en", "bn"];

export default async function RootLayout({ children, params }) {
  const isValidLocale = locales.some((cur) => cur === params.locale);
  if (!isValidLocale) notFound();

  const settingsRes = await fetchData({
    api: `info/basic`,
    locale: params?.locale,
  });
  const settings = settingsRes?.data || {};

  return (
    <html lang={params.locale}>
      <body>
        <ReduxProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main
              className={`flex-grow ${
                settings?.offer_massage
                  ? "pt-[89px] md:pt-[157px]"
                  : "pt-[57px] md:pt-[113px]"
              } `}
            >
              <CheckConnection>{children}</CheckConnection>
            </main>
            <Footer />
          </div>

          <CartTray />
          <Cart />
          <ProductSelect />
          <SizeChangeModal />
          <VideoPlayerModal />
          <PersistUser />
          <GlobalLoader />
          <ServerDataProvider />
        </ReduxProvider>
      </body>
    </html>
  );
}
