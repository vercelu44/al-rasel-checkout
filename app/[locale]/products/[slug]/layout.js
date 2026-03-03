import { fetchData } from "@/lib/fetch-data";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }, parent) => {
  const parentMetaData = await parent;

  const productRes = await fetchData({ api: `products/${params.slug}` });
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

export default async function ProductDetailsLayout({ children }) {
  return <div>{children}</div>;
}