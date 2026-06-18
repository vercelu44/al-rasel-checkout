
import BestSellSlider from "./BestSellSlider";
import { fetchData } from "@/lib/fetch-data";

const BestSell = async () => {
	const data = await fetchData({ api: "product-bestsale" });
	const bestProducts = data?.data || [];

	return <BestSellSlider bestProducts={bestProducts} />;
};

export default BestSell;
