import ProductList from "@/components/products/ProductList";
import { fetchData } from "@/lib/fetch-data";

const BestSell = async () => {
	const data = await fetchData({ api: "product-bestsale" });
	const bestProducts = data?.data || [];

	return <ProductList products={bestProducts?.slice(0,8)} fixedItems={7} className={'2xl:grid-cols-4'} />
};

export default BestSell;
