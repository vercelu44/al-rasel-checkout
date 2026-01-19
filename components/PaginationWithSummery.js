import React from "react";
import Paginator from "./elements/Paginator";

export default function PaginationWithSummery({
  meta,
  totalItemsShowing,
  paginateItems,
}) {
  return (
    <div className="border-t  py-6 flex flex-col gap-4 justify-center items-center">
      <p>
        Showing results {totalItemsShowing || 0} out of {meta?.total}
      </p>
      <Paginator meta={meta} paginateItems={paginateItems} />
    </div>
  );
}
