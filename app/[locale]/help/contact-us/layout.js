export const metadata = {
	title: "Contact Us",
	description: "Contact Us page",
	openGraph: {
		title: "Contact Us",
		description: "Contact Us page",
		url: `/help/contact-us`,
	},
	alternates: {
		canonical: `/help/contact-us`,
	},
};

export default function HelpLayout({ children }) {
	return <div>{children}</div>;
}
