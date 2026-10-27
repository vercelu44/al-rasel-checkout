import type * as React from "react";

import { fetchData } from "@/lib/fetch-data";
import { notFound } from "next/navigation";
import type { ApiResponse, CmsPage, MetadataProps } from "@/types";
import type { Metadata, ResolvingMetadata } from "next";

export const generateMetadata = async (
  { params }: MetadataProps<{ page_slug: string }>,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  // const parentMetaData = await parent;
  const { page_slug } = await params;
  let page: CmsPage = {};
  try {
    const pageRes = await fetchData<ApiResponse<CmsPage>>({ api: `pages/${page_slug}` });
    page = pageRes?.data;
    // console.log(`/pages/${page?.slug}`);
    return {
      title: `${page?.title}`,
      // description: `${page?.title} a category of ${parentMetaData.applicationName}`,
      openGraph: {
        title: `${page?.title}`,
        url: `/pages/${page?.slug}`,
      },
      alternates: {
        canonical: `/pages/${page?.slug}`,
      },
    };
  } catch (error) {
    return notFound();
  }
};
export default function DynamicPageLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
