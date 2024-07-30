import { cn } from "@/utils";
import * as React from "react";
const CallIcon = ({ fillClass, strokeClass, ...props }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		fill="none"
		{...props}
	>
		<path
			className={cn(
				`stroke-slate-400`,

				strokeClass
			)}
			strokeLinejoin="round"
			strokeWidth={1.5}
			d="M8.698 3.843a1 1 0 0 1 .874.514l1.224 2.204a1 1 0 0 1 .02.932L9.637 9.85s.342 1.756 1.771 3.185c1.43 1.43 3.179 1.765 3.179 1.765l2.357-1.178a1 1 0 0 1 .933.02l2.21 1.229a1 1 0 0 1 .513.874v2.536c0 1.292-1.2 2.225-2.424 1.812-2.514-.848-6.416-2.463-8.89-4.937-2.473-2.473-4.088-6.375-4.936-8.89-.413-1.223.52-2.423 1.812-2.423h2.536Z"
		/>
	</svg>
);
export default CallIcon;
