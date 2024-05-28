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
export default function ProductsLayout({ children }) {
	return <div>{children}</div>;
}
