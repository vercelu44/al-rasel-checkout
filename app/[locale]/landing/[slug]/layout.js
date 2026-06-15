import { fetchData } from "@/lib/fetch-data";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }, parent) => {
	// console.log(window.location.origin);
	const parentMetaData = await parent;
	let product = {};
	try {
		const productRes = await fetchData({ api: `products/${params.slug}` });
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

export default async function ProductTemplateLayout({ children }) {
	return <div>{children}</div>;
}