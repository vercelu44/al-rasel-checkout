import { fetchData } from "@/lib/fetch-data";
import ProductList from "@/components/products/ProductList";
import type { ApiResponse, Product } from "@/types";

const NewArrival = async () => {
	const data = await fetchData<ApiResponse<Product[]>>({ api: `product-latest?per_page=5` });
	const products = data?.data || [];
	
	return <ProductList products={products} fixedItems={3} />;
};

export default NewArrival;
