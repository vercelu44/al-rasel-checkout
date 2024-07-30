import { cn } from "@/utils";
import * as React from "react";
const SortIcon = ({ fillClass, strokeClass, ...props }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		fill="none"
		className={cn(`fill-slate-900`, fillClass)}
		{...props}
	>
		<path
			className={cn(`stroke-slate-900`, strokeClass)}
			strokeLinecap="round"
			strokeWidth={1.5}
			d="M3 7h18M6 12h12M10 17h4"
		/>
	</svg>
);
export default SortIcon;
