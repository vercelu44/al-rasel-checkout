import React from "react";
import Paginator from "./elements/Paginator";

import type { PaginationMeta } from "@/types";

interface PaginationWithSummeryProps {
  meta: Partial<PaginationMeta>;
  totalItemsShowing?: number;
  paginateItems?: number;
}

export default function PaginationWithSummery({
  meta,
  totalItemsShowing,
  paginateItems,
}: PaginationWithSummeryProps) {
  return (
    <div className="border-t  py-6 flex flex-col gap-4 justify-center items-center">
      <p>
        Showing results {totalItemsShowing || 0} out of {meta?.total}
      </p>
      <Paginator meta={meta} paginateItems={paginateItems} />
    </div>
  );
}
