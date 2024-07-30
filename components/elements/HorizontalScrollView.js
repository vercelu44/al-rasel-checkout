import { cn } from "@/utils";
import React from "react";

const HorizontalScrollView = ({ children, className }) => {
	return (
		<div className="custom-horizontal-scroll scrollbar-hide">
			<div
				className={cn(
					"flex space-x-4 items-center w-fit p-4 md:px-0",
					className
				)}
			>
				{children}
			</div>
		</div>
	);
};

export default HorizontalScrollView;
