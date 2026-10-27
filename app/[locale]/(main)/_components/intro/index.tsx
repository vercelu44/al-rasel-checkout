import { fetchData } from "@/lib/fetch-data";
import IntroSlider from "./IntroSlider";
import type { ApiResponse, Banner, SiteSettings } from "@/types";

const Intro = async ({ settings }: { settings: SiteSettings }) => {
	const { data: sliders = [] } = await fetchData<ApiResponse<Banner[]>>({
		api: "sliders",
	});
	return <IntroSlider sliders={sliders} settings={settings} />;
};

export default Intro;
