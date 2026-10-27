import type * as React from "react";
export const metadata = {
	title: "Featured products",
	description: "All Featured products",
	openGraph: {
		title: "Featured products",
		description: "Featured products",
		url: `/featured-products`,
	},
	alternates: {
		canonical: `/featured-products`,
	},
};
export default function FeaturedProductsLayout({ children }: { children: React.ReactNode }) {
	return <div>{children}</div>;
}
