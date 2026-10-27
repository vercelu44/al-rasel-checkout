import type * as React from "react";
import { fetchData } from "@/lib/fetch-data";
import { notFound } from "next/navigation";
import type { ApiResponse, MetadataProps, Product } from "@/types";
import type { Metadata, ResolvingMetadata } from "next";

export const generateMetadata = async (
  { params }: MetadataProps<{ slug: string }>,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
	// console.log(window.location.origin);
	const parentMetaData = await parent;
	const { slug } = await params;
	let product: Product = {};
	try {
		const productRes = await fetchData<ApiResponse<Product>>({ api: `products/${slug}` });
		product = productRes?.data;

		return {
			title: `${product?.product_name} || ${parentMetaData.applicationName}`,
			description:
				product?.meta_description ||
				`${product?.product_name} a product of ${parentMetaData.applicationName}`,
			openGraph: {
				title: product?.product_name,
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
	} catch (error) {
		return notFound();
	}
};

export default async function ProductTemplateLayout({ children }: { children: React.ReactNode }) {
	return <div>{children}</div>;
}