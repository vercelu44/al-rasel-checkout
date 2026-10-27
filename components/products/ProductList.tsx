import React from "react";
import ProductCard from "../cards/ProductCard";
import { cn } from "@/utils";
import { siteConfig } from "@/config/site";

import type { Product, ProductSearchParams, Translations } from "@/types";

interface ProductListProps {
  products: Product[];
  isFlashSale?: boolean;
  /** Used for the `col` (grid columns) value */
  customSearchParams?: ProductSearchParams;
  /** Show only this many items below the 2xl breakpoint */
  fixedItems?: number;
  className?: string;
  /** Not used here; kept so callers can pass it */
  translations?: Translations;
  isfeaturedProduct?: boolean;
}

export default function ProductList({ products, isFlashSale, customSearchParams, fixedItems,className }: ProductListProps) {


  const columns = Number(customSearchParams?.col) ;
  
  
  
  return (
    <>
    <h1 className="sr-only">Detail category</h1>
    
    {
      columns ? <div  className={cn(
        "products-wpr w-full grid gap-3 md:gap-5 mb-3 md:mb-12 h-fit",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-3",
        columns === 4 && "grid-cols-4",
        columns === 5 && "grid-cols-5"
      )} >
        {products?.map((product, i) => (
          <div
            className={cn(
              "col-span-1",
              fixedItems && i > fixedItems && "hidden 2xl:block"
            )}
            key={i}
          >
            <ProductCard
              product={product}
              isFlashSale={isFlashSale}
              isSquareImage={siteConfig.isSquareImage}
              
            />
          </div>
        ))}
      </div> : <div className={cn("products-wpr w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5  gap-3 md:gap-5 mb-3 md:mb-6 h-fit", className)}>
        {products?.map((product, i) => (
          <div
            className={cn(
              "col-span-1",
              fixedItems && i > fixedItems && "hidden 2xl:block"
            )}
            key={i}
          >
            <ProductCard
              product={product}
              isFlashSale={isFlashSale}
              isSquareImage={siteConfig.isSquareImage}
            />
          </div>
        ))}
      </div>
    }
    
    
    </>
  );
}
