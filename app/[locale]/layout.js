import "rc-slider/assets/index.css";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
// ** int18n
// import { useLocale } from "next-intl";
import { notFound } from "next/navigation";

// ** Import Components
// import Footer from "@/components/footer/Footer";
import CheckConnection from "@/components/CheckConnection";
import CartTray from "@/components/elements/CartTray";
import ReduxProvider from "@/store/ReduxProvider";

//** Swiper Slider
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/grid";
import "swiper/css/free-mode";

import Cart from "@/components/side-drawers/Cart";
import ProductSelect from "@/components/side-drawers/ProductSelect";
import SizeChangeModal from "@/components/modals/SizeChangeModal";
import PersistUser from "@/components/utility/PersistUser";
import GlobalLoader from "@/components/utility/GlobalLoader";
import ServerDataProvider from "@/components/utility/ServerDataProvider";
import BottomNavigation from "@/components/navigation/bottom-navigation";
import Header from "@/components/navigation/header";
import Footer from "@/components/footer";
import VideoPlayerModal from "@/components/modals/VideoPlayerModal";
import AuthProvider from "@/provider/AuthProvider";
import { fetchData } from "@/lib/fetch-data";
import { locales } from "@/navigation";
import GeoLocation from "@/components/utility/GeoLocation";
import Script from "next/script";

export const generateMetadata = async ({ params }) => {
  let settings = {};
  let appName = "E-commerce app";
  let favicon = "/favicon.ico";
  try {
    const settingsRes = await fetchData({
      api: `info/basic`,
      locale: params?.locale,
    });
    settings = settingsRes?.data || {};
    appName = settings?.name;
    favicon = settings?.favicon;
    // console.log(settings);
  } catch (error) {
    console.log(error);
    return {
      title: appName,
      applicationName: appName,
    };
  }

  return {
    title: {
      default: `${appName}`,
      template: `%s || ${appName}`,
    },
    description:
      settings?.seo?.meta_description ||
      `Discover Elegance, Shop with Confidence at ${appName}`,
    applicationName: appName,
    openGraph: {
      title: `${appName}`,
      description:
        settings?.seo?.meta_description ||
        `Discover Elegance, Shop with Confidence at ${appName}`,
      url: `/`,
      siteName: appName,
      // images: [product?.data?.image],
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
      // apple: [],
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL),
    alternates: {
      canonical: `/`,
    },
    verification: {
      google: "25eRS-pi2hGtpOj2mrII9fv9Gbo2N5DkfZQmhG8Aie4",
      other: {
        // me: ["my-email", "my-link"],
        "facebook-domain-verification": settings.fb_domain_verification,
      },
    },
    // other: {
    // 	"custom_meta_name": "meta_content",
    // },
  };
};

// export function generateStaticParams() {
// 	return locales.map((locale) => ({ locale }));
// }

export default function RootLayout({ children, params }) {
  // const locale = useLocale();
  // // Show a 404 error if the user requests an unknown locale
  // if (params.locale !== locale) {
  // 	notFound();
  // }

  const isValidLocale = locales.some((cur) => cur === params.locale);
  if (!isValidLocale) notFound();

  // unstable_setRequestLocale(params.locale);

  return (
    <html lang={params.locale} dir={params.locale === "ar" ? "rtl" : "ltr"}>
      <head>
        {/* Google Analytics Tag */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-2SHK5NBJ7L"
        ></Script>
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2SHK5NBJ7L');
          `}
        </Script>
      </head>

      <body>
        <AuthProvider>
          <ReduxProvider>
            <Header />
            <CheckConnection>
              <main>{children}</main>
            </CheckConnection>
            <Footer />
            <BottomNavigation />
            <CartTray />
            <Cart />
            <ProductSelect />
            <SizeChangeModal />
            <VideoPlayerModal />
            <PersistUser />
            <GlobalLoader />
            <ServerDataProvider />
            <GeoLocation />
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
