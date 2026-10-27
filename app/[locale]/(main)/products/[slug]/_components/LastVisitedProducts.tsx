"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { useParams } from "next/navigation";
import {
  useAddToVisitedMutation,
  useGetVisitedProductsQuery,
} from "@/store/api/visitedProductsAPI";
import ProductCard from "@/components/cards/ProductCard";
import { siteConfig } from "@/config/site";

const LastVisitedProducts = ({ visitedProductId }: { visitedProductId?: number }) => {
  const { translations } = useAppSelector((state) => state.common);

  const { locale } = useParams<{ locale: string }>();
  const { user } = useAppSelector((state) => state.auth);
  const [addToVisited] = useAddToVisitedMutation();
  const { data, isLoading } = useGetVisitedProductsQuery({ locale });
  const visitedProducts = data?.data || [];
  // console.log(visitedProducts);

  // Adding product to visited list
  useEffect(() => {
    if (visitedProductId && user) {
      addToVisited({ product_id: visitedProductId, date: new Date() });
      // .unwrap()
      // .then((response) => {
      //   // Handle the successful response if necessary
      //   console.log(response);
      // })
      // .catch((error) => {
      //   // Handle the error if necessary
      //   console.log(error);
      // });
    }
  }, [visitedProductId, user, addToVisited]);

  if (!user) return null;

  return (
    <section id="visit-history">
      <div className="container py-8 lg:py-14">
        <h2 className="sec-title text-center mb-8">
          {translations["recently-viewed"] || "Recently Viewed"}
        </h2>
        <div className="category-products"></div>
        <div className="products-wpr grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 lg:gap-5">
          {visitedProducts?.map((product, i) => (
            <div key={i}>
              <ProductCard
                product={product}
                isSquareImage={siteConfig.isSquareImage}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LastVisitedProducts;
