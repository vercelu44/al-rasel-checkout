import type * as React from "react";
import { fetchData } from "@/lib/fetch-data";
import { notFound } from "next/navigation";
import type { ApiResponse, MetadataProps, Product } from "@/types";
import type { Metadata, ResolvingMetadata } from "next";

export const generateMetadata = async (
  { params }: MetadataProps<{ slug: string }>,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  const parentMetaData = await parent;

  const { slug } = await params;
  const productRes = await fetchData<ApiResponse<Product>>({ api: `products/${slug}` });
  const product = productRes?.data;

  if (!product) {
    return notFound();
  }

  return {
    title: `${product?.meta_title || product?.product_name}`,
    description:
      product?.meta_description ||
      `${product?.product_name} a product of ${parentMetaData.applicationName}`,
    openGraph: {
      title: product?.meta_title || product?.product_name,
      description:
        product?.meta_description ||
        `${product?.product_name} a product of ${parentMetaData.applicationName}`,
      url: `/products/${product?.slug}`,
      siteName: parentMetaData.applicationName,
      images: [product?.image],
      type: "website",
    },
    alternates: {
      canonical: `/products/${product?.slug}`,
    },
  };
};

export default async function ProductDetailsLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
