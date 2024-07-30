import { Link } from "@/navigation";
import { cn } from "@/utils";
import React from "react";
import { HiArrowLongRight } from "react-icons/hi2";

export default function SeeAll({ href = "/", buttonText, className, invert }) {
	return (
		<Link
			href={href}
			className={cn(
				"inline-flex justify-center items-center w-full gap-2 py-[10px] px-3 font-semibold rounded-lg border lg:hidden capitalize mt-4",
				invert
					? "text-white border-white bg-transparent"
					: "bg-white border-secondary-700 text-secondary-700",
				className
			)}
		>
			{buttonText} <HiArrowLongRight size={24} />{" "}
		</Link>
	);
}
