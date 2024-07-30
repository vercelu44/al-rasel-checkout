import { cn } from "@/utils";
import React from "react";

const ViewHTML = ({ htmlText, className, ...props }) => {
	return htmlText ? (
		<div
			className={cn("view-html prose max-w-none", className)}
			dangerouslySetInnerHTML={{ __html: htmlText }}
			{...props}
		/>
	) : null;
};

export default ViewHTML;
