export async function generateMetadata({ params }) {
	return {
		title: "Contact Us",
		description: "Contact Us",
		openGraph: {
			title: "Contact Us",
			description: "Contact Us",
			url: `/help/contact-us`,
		},
		alternates: {
			canonical: `/help/contact-us`,
		},
	};
}

export default function HelpLayout({ children }) {
	return <div>{children}</div>;
}
