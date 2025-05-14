
import BestProductSlider from "./BestProductSlider";
import { fetchData } from "@/lib/fetch-data";

const BestProductsContainer = async ({ id }) => {
  const data = await fetchData({ api: `products?sort_type=best_selling&category_id=${id}` });
  const bestProducts = data?.data || [];
  return (
    <div className="container">
      <div className="bestSell-slider relative">
        <BestProductSlider categoryList={bestProducts} />
      </div>
    </div>
  );
};

export default BestProductsContainer;
