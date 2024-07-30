import Image from "next/image";
import { Link } from "@/navigation";
import React from "react";
import { cn } from "@/utils";

export default function SocialIcon({
	href,
	icon,
	name,
	linkClass,
	iconClass,
	...props
}) {
	return (
		<Link
			target="_blank"
			href={href || "/"}
			className={cn("inline", linkClass)}
			{...props}
		>
			<Image
				src={icon}
				alt={name || "social-icon"}
				width="24"
				height="24"
				className={cn("w-6 h-6", iconClass)}
			/>
		</Link>
	);
}
