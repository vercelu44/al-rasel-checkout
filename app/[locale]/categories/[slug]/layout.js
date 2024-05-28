import { fetchData } from "@/lib/fetch-data";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }, parent) => {
	const parentMetaData = await parent;
	let category = {};
	try {
		const categoryRes = await fetchData({ api: `category/${params?.slug}` });
		category = categoryRes?.data;
		return {
			title: `${category?.category_name} || ${parentMetaData.applicationName}`,
			description: `${category?.category_name} a category of ${parentMetaData.applicationName}`,
			openGraph: {
				title: `${category?.category_name} || ${parentMetaData.applicationName}`,
				description: `All ${category?.category_name} products of ${parentMetaData.applicationName}`,
				url: `/categories/${params.slug}`,
			},
			alternates: {
				canonical: `/categories/${params.slug}`,
			},
		};
	} catch (error) {
		return notFound();
	}
};

export default function CategoryLayout({ children }) {
	return <div>{children}</div>;
}
