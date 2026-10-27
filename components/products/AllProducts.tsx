import { fetchData } from "@/lib/fetch-data";
import ProductCard from "../cards/ProductCard";
import PaginationWithSummery from "../PaginationWithSummery";
import { siteConfig } from "@/config/site";
import type { PaginatedResponse, PaginationMeta, Product } from "@/types";

interface AllProductsProps {
  /** Filters sent to `products?…`, e.g. `{ category_id: 5 }` */
  customSearchParams?: Record<string, string | number>;
  pagination?: boolean;
}

const AllProducts = async ({ customSearchParams = {}, pagination }: AllProductsProps) => {
  const params = new URLSearchParams(
    Object.entries(customSearchParams).map(([key, value]) => [key, String(value)]),
  );
  const data = await fetchData<PaginatedResponse<Product>>({ api: `products?${params.toString()}` });
  const products: Product[] = data?.data || [];
  const meta: Partial<PaginationMeta> = data?.meta || {};

  return (
    <>
      <div className="products-wpr grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 lg:gap-5 mb-12">
        {products?.map((product, i) => (
          <div className="col-span-1" key={i}>
            <ProductCard
              product={product}
              isSquareImage={siteConfig.isSquareImage}
            />
          </div>
        ))}
      </div>
      {pagination && (
        <PaginationWithSummery
          meta={meta}
          totalItemsShowing={products?.length}
        />
      )}
    </>
  );
};

export default AllProducts;
