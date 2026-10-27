
import BestSellSlider from "./BestSellSlider";
import { fetchData } from "@/lib/fetch-data";
import type { ApiResponse, Product } from "@/types";

const BestSell = async () => {
	const data = await fetchData<ApiResponse<Product[]>>({ api: "product-bestsale" });
	const bestProducts = data?.data || [];

	return <BestSellSlider bestProducts={bestProducts} />;
};

export default BestSell;
