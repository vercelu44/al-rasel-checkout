// import { fetchData } from "@/lib/fetch-data";
import MiniBannerSlider from "./MiniBannerSlider";


const MiniBanner = async () => {
	// const { data: sliders = [] } = await fetchData({
	// 	api: "sliders",
	// });
	return (
		<div className="container">
			<MiniBannerSlider 
			// sliders={sliders} 
			/>
		</div>
	);
};

export default MiniBanner;
