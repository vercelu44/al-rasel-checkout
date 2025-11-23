import { fetchData } from "@/lib/fetch-data";

export const generateMetadata = async ({ params }, parent) => {
	const { category_slug } = params;

	const [categoryResponse] = await Promise.allSettled([
		fetchData({ api: `category/${category_slug}` }),
	]);

	const category =
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
			url: `/categories/${params.category_slug}`,
		},
		alternates: {
			canonical: `/categories/${params.category_slug}`,
		},
	};
};

export default function CategoryLayout({ children }) {
	return <div>{children}</div>;
}
