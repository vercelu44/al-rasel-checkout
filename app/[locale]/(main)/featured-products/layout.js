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
export default function FeaturedProductsLayout({ children }) {
	return <div>{children}</div>;
}
