
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import "rc-slider/assets/index.css";

//** Swiper Slider
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

import { NextIntlClientProvider } from "next-intl";
import { preconnect } from "react-dom";
import ReduxProvider from "@/store/ReduxProvider";
import ServerDataProvider from "@/components/utility/ServerDataProvider";
import { fetchData } from "@/lib/fetch-data";
import { fontVariables } from "@/config/fonts";
import type { ApiResponse, LayoutProps, SiteSettings, Translations } from "@/types";

/** `https://cdn.example.com/a/b.png` -> `https://cdn.example.com` (null for relative/invalid URLs) */
const getOrigin = (url?: string): string | null => {
  try {
    return url ? new URL(url).origin : null;
  } catch {
    return null;
  }
};

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  // Same requests as ServerDataProvider (Next.js de-duplicates them), used to
  // preload Redux so server and client render the same settings/translations.
  const [settingsRes, translationRes] = await Promise.allSettled([
    fetchData<ApiResponse<SiteSettings>>({ api: `info/basic` }),
    fetchData<ApiResponse<Translations>>({ api: `translations` }),
  ]);
  const settings: SiteSettings =
    settingsRes.status === "fulfilled" ? settingsRes.value?.data || {} : {};
  const translations: Translations =
    translationRes.status === "fulfilled"
      ? translationRes.value?.data || {}
      : {};

  // Product/banner images are served from the backend's media host.
  // Open that connection early so the first images arrive sooner.
  const mediaOrigin = getOrigin(settings?.logo);
  if (mediaOrigin) preconnect(mediaOrigin);

  return (
    <html lang={locale} className={fontVariables}>
      <body suppressHydrationWarning>
        <NextIntlClientProvider>
          <ReduxProvider settings={settings} translations={translations}>
            {children}
            <ServerDataProvider />
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
