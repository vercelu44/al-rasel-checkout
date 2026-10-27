import React from "react";
import { twMerge } from "tailwind-merge";

interface ViewHTMLProps extends React.HTMLAttributes<HTMLDivElement> {
	/** HTML from the backend (rendered as-is) */
	htmlText?: string | null;
}

const ViewHTML = ({ htmlText, className, ...props }: ViewHTMLProps) => {
	return htmlText ? (
		<div
			className={twMerge("view-html prose max-w-none", className)}
			dangerouslySetInnerHTML={{ __html: htmlText }}
			{...props}
		/>
	) : null;
};

export default ViewHTML;
