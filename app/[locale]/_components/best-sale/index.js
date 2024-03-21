import { fetchData } from "@/lib/fetch-data";
import BestSellingViewSelector from "./BestSellingViewSelector";

const BestSell = async ({ translations }) => {
	const data = await fetchData({ api: "products?sort_type=best_selling" });
	const bestProducts = data?.data || [];

	return (
		<>
			<BestSellingViewSelector
				bestProducts={bestProducts}
				translations={translations}
			/>
		</>
	);
};

export default BestSell;
