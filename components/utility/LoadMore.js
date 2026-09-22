"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Loader from "../elements/loaders/Loader";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useGetFilterProductsQuery } from "@/store/api/searchAPI";

function LoadMore({ meta, setProducts, apiUrl }) {
  const [pagesLoaded, setPagesLoaded] = useState(1);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const { ref, inView } = useInView();

  const nextPage = pagesLoaded + 1;
  const hasMore = nextPage <= meta?.last_page;

  const url = `${apiUrl}&page=${nextPage}`;

  const { data, isFetching } = useGetFilterProductsQuery(
    {
      params: url,
    },
    {
      skip: !inView || !hasMore,
    }
  );

  useEffect(() => {
    const newProducts = data?.data;

    if (!newProducts?.length) return;

    setProducts((prevProducts) => [
      ...prevProducts,
      ...newProducts,
    ]);

    setPagesLoaded(nextPage);
  }, [data]);

  if (!hasMore) {
    return null;
  }

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 gap-4 overflow-hidden md:grid-cols-3 lg:grid-cols-5"
    >
      {isFetching &&
        (isMobile ? (
          <div className="col-span-full">
            <Loader />
          </div>
        ) : (
          <>
            <Loader />
            <Loader />
            <Loader />
            <Loader />
            <Loader />
          </>
        ))}
    </div>
  );
}

export default LoadMore;