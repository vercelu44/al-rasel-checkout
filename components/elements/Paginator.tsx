"use client";
import React, { useCallback } from "react";
import Link from "next/link";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import type { PaginationLink, PaginationMeta } from "@/types";

interface PaginatorProps {
  meta: Partial<PaginationMeta>;
  /** How many page numbers to show around the current page (default 3) */
  paginateItems?: number;
}

/**
 * The `Pagination` function is a React component that renders a pagination UI based on the provided
 * meta data from laravel api and allows users to navigate between pages.
 * @params paginationItems - sets the limit for paginate items to be shown
 */
export default function Paginator({ meta, paginateItems }: PaginatorProps) {
  const { locale } = useParams<{ locale: string }>();
  let pathname = usePathname();
  if (pathname === "/" || pathname === "/" + locale) pathname = "/products?sort_type=new"; //deactivate if you want pagination in home page
  const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string | number) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, String(value));

      return params.toString();
    },
    [searchParams]
  );

  let links: PaginationLink[] = [];
  if (Array.isArray(meta?.links)) {
    links = [...meta.links];
    // console.log(links);
    links.shift();
    links.pop();
  }

  const currentPage = meta.current_page;
  const lastPage = meta.last_page;
  const paginationItemsToShow = paginateItems || 3;
  const firstDotAfterPage = paginationItemsToShow + 1;

  return (
    <div className="flex gap-2 items-center">
      {/* Previous Page  */}
      {currentPage > 1 ? (
        <Link
          className={`p-2 border border-slate-200 text-slate-600 px-2 md:px-6`}
          href={pathname + "?" + createQueryString("page", currentPage - 1)}
        >
          <span className="hidden md:block">Previous</span>
          <AiOutlineLeft className="md:hidden" />
        </Link>
      ) : (
        <span
          className={`p-2 border border-slate-200 text-slate-300  px-2 md:px-6`}
        >
          <span className="hidden md:block">Previous</span>
          <AiOutlineLeft className="md:hidden" />
        </span>
      )}
      {/* Pages  */}
      {links.map((link, index) => {
        if (
          ((index === lastPage - 2 &&
            currentPage !== lastPage - 1 &&
            currentPage !== lastPage) || //showing three dots before last item
            (index === 1 && currentPage > firstDotAfterPage)) && // showing three dots after first item
          lastPage > paginationItemsToShow + 1
        ) {
          // Show "..." after page 1 when on the last page
          return (
            <span
              key={link.label}
              className="p-2 min-w-[36px] text-center border border-slate-200"
            >
              ...
            </span>
          );
        } else if (
          (currentPage < paginationItemsToShow + 1 &&
            index < paginationItemsToShow) || //initial pages
          (index < currentPage &&
            index >= currentPage - paginationItemsToShow) || //after page 3
          (currentPage > firstDotAfterPage && index === 0) || //showing first page
          (index === lastPage - 1 && index > paginationItemsToShow) //showing last page
        ) {
          return (
            <Link
              className={`p-2 min-w-[36px] text-center border ${
                link.active
                  ? "border-primary text-primary"
                  : "border-slate-200 text-slate-600"
              }`}
              key={link.label}
              href={pathname + "?" + createQueryString("page", link.label)}
            >
              {link.label}
            </Link>
          );
        } else {
          return null; // Hide other links
        }
      })}
      {/* Next Page  */}
      {currentPage < lastPage ? (
        <Link
          className={`p-2 border border-slate-200 text-slate-600 px-2 md:px-6`}
          href={pathname + "?" + createQueryString("page", currentPage + 1)}
        >
          <span className="hidden md:block">Next</span>
          <AiOutlineRight className="md:hidden" />
        </Link>
      ) : (
        <span
          className={`p-2 border border-slate-200 text-slate-300 px-2 md:px-6`}
        >
          <span className="hidden md:block">Next</span>
          <AiOutlineRight className="md:hidden" />
        </span>
      )}
    </div>
  );
}
