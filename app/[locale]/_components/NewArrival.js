import { fetchData } from "@/lib/fetch-data";
import ProductList from "@/components/products/ProductList";

const NewArrival = async () => {
	const data = await fetchData({ api: `product-latest?per_page=10` });
	const products = data?.data || [];
	return (
		<>
			<ProductList products={products} fixedItems={7} />
		</>
	);
};

export default NewArrival;
