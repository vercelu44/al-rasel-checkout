export const metadata = {
	title: "Checkout",
	description: "Checkout",
	openGraph: {
		title: "Checkout",
		description: "Checkout",
		url: `/checkout`,
	},
	alternates: {
		canonical: `/checkout`,
	},
};

export default function CheckoutLayout({ children }) {
	return <div>{children}</div>;
}
