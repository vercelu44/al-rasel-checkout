import { cn } from "@/utils";
import * as React from "react";
const CallFillIcon = ({ fillClass, strokeClass, ...props }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		fill="none"
		{...props}
	>
		<path
			className={cn(
				`fill-slate-400 stroke-slate-400`,
				fillClass,
				strokeClass
			)}
			strokeLinejoin="round"
			d="M8.498 3.843a1 1 0 0 1 .874.515l1.224 2.203a1 1 0 0 1 .02.933L9.437 9.85s.342 1.756 1.771 3.185c1.43 1.43 3.179 1.765 3.179 1.765l2.357-1.178a1 1 0 0 1 .933.02l2.21 1.229a1 1 0 0 1 .513.874v2.537c0 1.291-1.2 2.224-2.424 1.811-2.514-.848-6.416-2.463-8.89-4.936-2.473-2.474-4.088-6.376-4.936-8.89-.413-1.224.52-2.424 1.812-2.424h2.536Z"
		/>
	</svg>
);
export default CallFillIcon;
