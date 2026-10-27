import type * as React from "react";
export async function generateMetadata() {
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

export default function HelpLayout({ children }: { children: React.ReactNode }) {
	return <div>{children}</div>;
}
