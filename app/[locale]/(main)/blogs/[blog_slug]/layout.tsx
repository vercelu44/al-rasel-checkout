import type * as React from "react";
import { fetchData } from "@/lib/fetch-data";
import { notFound } from "next/navigation";
import type { ApiResponse, CmsPage, MetadataProps } from "@/types";
import type { Metadata, ResolvingMetadata } from "next";

export const generateMetadata = async (
  { params }: MetadataProps<{ blog_slug: string }>,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  const { blog_slug } = await params;
  try {
    const res = await fetchData<ApiResponse<CmsPage[]>>({ api: `pages?type=blog&slug=${blog_slug}` });
    const blog = res?.data?.[0]; // assuming API returns an array
    if (!blog) return notFound();

    return {
      title: `${blog.title || blog.name}`,
      openGraph: {
        title: `${blog.title || blog.name}`,
        url: `/blogs/${blog.slug}`,
        
      },
      alternates: {
        canonical: `/blogs/${blog.slug}`,
      },
    };
  } catch (error) {
    return notFound();
  }
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <div className="p-6">{children}</div>;
}
