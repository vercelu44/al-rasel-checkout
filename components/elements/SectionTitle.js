import React from "react";
import { Link } from "@/navigation";
// import Image from "next/image";
import { HiArrowLongRight } from "react-icons/hi2";
import { cn } from "@/utils";

export default function SectionTitle({
	title,
	href,
	buttonText = "See All",
	children,
	className,
}) {
	return (
		<div
			className={cn(
				`sec-heading w-full flex ${
					!href ? "justify-center lg:justify-start" : "justify-between"
				} items-center lg:border-b border-slate-200 pb-3`,
				className
			)}
		>
			<div className="flex gap-2 items-center">
				{children}
				<h2 className={`sec-title capitalize`}>{title}</h2>
			</div>
			{href && (
				<Link href={href} className="all-btn !hidden lg:!block capitalize">
					{buttonText} <HiArrowLongRight size={24} />{" "}
				</Link>
			)}
		</div>
	);
}
