import { fetchData } from "@/lib/fetch-data";
import ClientLoader from "./ClientLoader";
import FacebookPixel from "./FacebookPixel";
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

	return (
		<>
			{/* Loading setting for client uses */}
			<ClientLoader
				settings={settings}
				translations={translations}
				// locale={locale}
			/>
			{FB_PIXEL_ID && <FacebookPixel fbPixelId={FB_PIXEL_ID} />}
		</>
	);
};

export default ServerDataProvider;
