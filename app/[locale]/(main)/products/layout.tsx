import type * as React from "react";
export const metadata = {
	title: "All Products",
	description: "ALL Products",
	openGraph: {
		title: "All Products",
		description: "All Products",
		url: `/products`,
	},
	alternates: {
		canonical: `/products`,
	},
};
export default function FlashSaleLayout({ children }: { children: React.ReactNode }) {
	return <div>{children}</div>;
}
