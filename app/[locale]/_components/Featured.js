import { fetchData } from "@/lib/fetch-data";
import ProductList from "@/components/products/ProductList";

const Featured = async () => {
 
  const data = await fetchData({ api: `featured-product?per_page=5` });
  const products = data?.data || [];

  return <ProductList products={products} fixedItems={3} />;
};

export default Featured;
