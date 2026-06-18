export const metadata = {
	title: "Questions and Answers",
	description: "Questions and Answers",
	openGraph: {
		title: "Questions and Answers",
		description: "Questions and Answers",
		url: `/help/qna`,
	},
	alternates: {
		canonical: `/help/qna`,
	},
};

export default function HelpLayout({ children }) {
	return <div>{children}</div>;
}
