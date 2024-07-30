import { cn } from "@/utils";
import * as React from "react";

const CartIcon = ({
	fillClass = "none",
	strokeClass = "stroke-slate-400",
	...props
}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		fill="none"
		{...props}
	>
		<path
			stroke="currentColor" // Use currentColor for stroke to inherit the color
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={1.5}
			className={cn(fillClass, strokeClass)} // Merge fillClass and strokeClass
			d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0a60.114 60.114 0 0 1 16.536 1.84 59.585 59.585 0 0 1-2.924 7.138H7.5M5.106 5.272 7.5 14.25m0 0a3 3 0 0 0-3 3h15.75M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
		/>
	</svg>
);
export default CartIcon;
