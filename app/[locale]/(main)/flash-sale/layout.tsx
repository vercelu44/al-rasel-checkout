import type * as React from "react";
export const metadata = {
	title: "Flash selling products",
	description: "All flash selling products",
	openGraph: {
		title: "Flash selling products",
		description: "Flash selling products",
		url: `/flash-sale`,
	},
	alternates: {
		canonical: `/flash-sale`,
	},
};
export default function FlashSellingProductsLayout({ children }: { children: React.ReactNode }) {
	return <div>{children}</div>;
}
