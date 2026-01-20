import ProductList from "@/components/products/ProductList";
import BestSellSlider from "./BestSellSlider";
import { fetchData } from "@/lib/fetch-data";

const BestSell = async () => {
	const isSlider = process.env.NEXT_PUBLIC_DUAL_ROW_PRODUCT === 'YES' ? true : false;

	const data = await fetchData({ api: "product-bestsale" });
	const bestProducts = data?.data || [];

	const showProduct = process.env.NEXT_PUBLIC_DUAL_ROW_PRODUCT === "YES" ? 7  : 3

	return (
		<>
		
		{
			isSlider ? 
			<ProductList products={bestProducts?.slice(0,8)} fixedItems={showProduct} className={'2xl:grid-cols-4'} />  : 
			<BestSellSlider bestProducts={bestProducts} /> 
			
		}
		</>
	);
};

export default BestSell;
