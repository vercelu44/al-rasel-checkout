import { cn } from "@/utils";
import * as React from "react";
const HomeIcon = ({ fillClass, strokeClass, ...props }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={25}
		height={24}
		fill="currentColor"
		className={cn(`fill-slate-400`, fillClass)}
		{...props}
	>
		<path
			className={cn(`stroke-slate-400`, strokeClass)}
			d="M12.8 18.25a.256.256 0 0 1-.25-.25v-3c0-.134.116-.25.25-.25s.25.116.25.25v3c0 .134-.116.25-.25.25Z"
		/>
		<path d="M18.4 22.56H7.2c-1.82 0-3.48-1.4-3.78-3.19L2.09 11.4c-.22-1.24.39-2.83 1.38-3.62l6.93-5.55c1.34-1.08 3.45-1.07 4.8.01l6.93 5.54c.98.79 1.58 2.38 1.38 3.62l-1.33 7.96c-.3 1.77-2 3.2-3.78 3.2ZM12.79 2.93c-.53 0-1.06.16-1.45.47L4.41 8.96c-.56.45-.96 1.49-.84 2.2l1.33 7.96c.18 1.05 1.23 1.94 2.3 1.94h11.2c1.07 0 2.12-.89 2.3-1.95l1.33-7.96c.11-.7-.29-1.76-.84-2.2l-6.93-5.54c-.4-.32-.94-.48-1.47-.48Z" />
	</svg>
);
export default HomeIcon;
