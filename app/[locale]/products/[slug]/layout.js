import { fetchData } from "@/lib/fetch-data";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }, parent) => {
	// console.log(window.location.origin);
	const parentMetaData = await parent;
	let product = {};
	product = await fetchData({ api: `products/${params.slug}` }); 
	// console.log(product)
	  // Only call notFound if API returns actual 404
	if (product?.status === 404) {
		return notFound();
	}

	return {
		title: `${product?.data?.meta_title || product?.data?.product_name}`,
		description:
			product?.data?.meta_description ||
			`${product?.data?.product_name} a product of ${parentMetaData.applicationName}`,
		openGraph: {
			title: product?.data?.meta_title || product?.data?.product_name,
			description:
				product?.data?.meta_description ||
				`${product?.data?.product_name} a product of ${parentMetaData.applicationName}`,
			url: `/products/${product?.data?.slug}`,
			siteName: parentMetaData.applicationName,
			images: [product?.data?.image],
			type: "website",
		},
		alternates: {
			canonical: `/products/${product?.data?.slug}`,
		},
	};
};

export default async function ProductDetailsLayout({ children }) {
	return <div>{children}</div>;
}
