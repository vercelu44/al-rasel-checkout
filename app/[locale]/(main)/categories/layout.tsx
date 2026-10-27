import type * as React from "react";
export const metadata = {
	title: "All Categories",
	description: "All Categories",
	openGraph: {
		title: "All Categories",
		description: "All Categories",
		url: `/categories`,
	},
	alternates: {
		canonical: `/categories`,
	},
};
export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
	return <div>{children}</div>;
}
