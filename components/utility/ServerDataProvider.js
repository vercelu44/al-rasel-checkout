import { fetchData } from "@/lib/fetch-data";
import ClientLoader from "./ClientLoader";
import FacebookPixel from "./FacebookPixel";
import GoogleAdsense from "./GoogleAdsense";
import { GTM } from "@/utils/GTM";
import ScriptLoader from "../elements/ScriptLoader";
import ViewHTML from "../elements/ViewHTML";
import ExternalScript from "../elements/ExternalScript";
// import { useLocale } from "next-intl";

const ServerDataProvider = async () => {
  // const locale = useLocale(); //Getting locale for client data fetch

  const [settingsRes, translationRes] = await Promise.allSettled([
    fetchData({ api: `info/basic` }),
    fetchData({ api: `translations` }),
  ]);

  const settings =
    settingsRes.status === "fulfilled" ? settingsRes.value?.data || {} : {};
  const translations =
    translationRes.status === "fulfilled"
      ? translationRes.value?.data || {}
      : {};
  // console.log(translations);

  const FB_PIXEL_ID =
    settings?.fb_pixel_id || process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  // console.log(FB_PIXEL_ID);
  // console.log(settings?.fb_pixel_id);

  const GOOGLE_ADSENSE_VERIFICATION_ID = settings?.google_adsense_verification;
  // console.log(GOOGLE_ADSENSE_VERIFICATION_ID);

  // -------------------  GTM ENABLED CHECK -------------------
  const GTM_ID = settings?.gtm_id;
  const isGTMEnabled =
    process.env.NEXT_PUBLIC_GTM_ENABLED === "YES" && GTM_ID ? true : false;

  const headerScript = settings?.custom_script?.header_custom_script || null;
  const footerScript = settings?.custom_script?.footer_custom_script || null;

  const SELFEB_SCRIPT_URL =
    settings?.selfeb_script_url || process.env.NEXT_PUBLIC_SELFEB_SCRIPT_URL;

  // console.log(isGTMEnabled);
  return (
    <>
      {/* Loading setting for client uses */}
      <ClientLoader
        settings={settings}
        translations={translations}
        // locale={locale}
      />
      {FB_PIXEL_ID && <FacebookPixel fbPixelId={FB_PIXEL_ID} />}
      {GOOGLE_ADSENSE_VERIFICATION_ID && (
        <GoogleAdsense verificationId={GOOGLE_ADSENSE_VERIFICATION_ID} />
      )}
      {isGTMEnabled && <GTM gtmId={GTM_ID} />}

      <ScriptLoader scriptId={"header-script"} scriptBody={headerScript} />
      <ViewHTML htmlText={footerScript} />

      {SELFEB_SCRIPT_URL && (
        <ExternalScript id="selfeb-sdk" src={SELFEB_SCRIPT_URL} />
      )}
    </>
  );
};

export default ServerDataProvider;
