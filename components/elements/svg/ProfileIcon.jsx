import { cn } from "@/utils";
import * as React from "react";
const ProfileIcon = ({ fillClass, strokeClass, ...props }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		fill="none"
		className={cn(`fill-slate-400`, fillClass)}
		{...props}
	>
		<path
			className={cn(`stroke-slate-400`, strokeClass)}
			d="M12 12.25A5.257 5.257 0 0 1 6.75 7 5.257 5.257 0 0 1 12 1.75 5.257 5.257 0 0 1 17.25 7 5.257 5.257 0 0 1 12 12.25Zm0-10A4.76 4.76 0 0 0 7.25 7 4.76 4.76 0 0 0 12 11.75 4.76 4.76 0 0 0 16.75 7 4.76 4.76 0 0 0 12 2.25Z"
		/>
		<path d="M20.59 22.75c-.41 0-.75-.34-.75-.75 0-3.45-3.52-6.25-7.84-6.25S4.16 18.55 4.16 22c0 .41-.34.75-.75.75s-.75-.34-.75-.75c0-4.27 4.19-7.75 9.34-7.75 5.15 0 9.34 3.48 9.34 7.75 0 .41-.34.75-.75.75Z" />
	</svg>
);
export default ProfileIcon;
