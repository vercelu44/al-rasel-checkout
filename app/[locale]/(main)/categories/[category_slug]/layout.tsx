import type * as React from "react";
import { fetchData } from "@/lib/fetch-data";
import type { ApiResponse, Category, MetadataProps } from "@/types";
import type { Metadata, ResolvingMetadata } from "next";

export const generateMetadata = async (
  { params }: MetadataProps<{ category_slug: string }>,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
	const { category_slug } = await params;

	const [categoryResponse] = await Promise.allSettled([
		fetchData<ApiResponse<Category>>({ api: `category/${category_slug}` }),
	]);

	const category: Category =
		categoryResponse.status === "fulfilled"
			? categoryResponse.value?.data || {}
			: {};

	const title =
		category.meta_title ? category.meta_title : category.category_name;

	const description =
		category.meta_description
			? category.meta_description
			: category.description;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			url: `/categories/${category_slug}`,
		},
		alternates: {
			canonical: `/categories/${category_slug}`,
		},
	};
};

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
	return <div>{children}</div>;
}
