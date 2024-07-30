import React from "react";
import { Link } from "@/navigation";
import { HiArrowLongLeft } from "react-icons/hi2";
import { cn } from "@/utils";

export default function NestedPageTitle({
	title,
	href,
	children,
	buttonText,
	className,
}) {
	return (
		<div className="heading">
			<div
				className={cn(
					`flex items-center py-4 lg:pt-12 px-3 lg:px-10 gap-2 border-b border-slate-200 lg:border-none capitalize`,
					className
				)}
			>
				<Link href={href} className="lg:hidden">
					{children ? children : <HiArrowLongLeft size={24} />}
				</Link>
				<h2 className="text-slate-900 font-semibold lg:font-bold text-base/4 lg:text-2xl">
					{title}
				</h2>
			</div>
			{buttonText && (
				<div className="hidden lg:block px-10">
					<Link
						href={href}
						className="icon-btn py-3 hover:text-primary capitalize"
					>
						{children ? children : <HiArrowLongLeft size={24} />}
						{buttonText}
					</Link>
				</div>
			)}
		</div>
	);
}
