import { fetchData } from "@/lib/fetch-data";
import IntroSlider from "./IntroSlider";

const Intro = async ({ settings }) => {
	const { data: sliders = [] } = await fetchData({
		api: "sliders",
	});
	return <IntroSlider sliders={sliders} settings={settings} />;
};

export default Intro;
