import { fetchData } from "@/lib/fetch-data";
// import ProductSlider from "@/components/ProductSlider";
import ProductList from "@/components/products/ProductList";

const Featured = async () => {
  const forMaroon = process.env.NEXT_PUBLIC_DUAL_ROW_PRODUCT;
  const perPage = forMaroon === 'YES' ? '10' : '5'
  const data = await fetchData({ api: `featured-product?per_page=${perPage}` });
  const products = data?.data || [];
  const showProduct = forMaroon === "YES" ? 7  : 3

  return <ProductList products={products} fixedItems={showProduct} />;
};

export default Featured;
