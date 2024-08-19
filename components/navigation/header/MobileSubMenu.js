"use client";
import React from "react";
import { Link } from "@/navigation";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useParams, usePathname } from "next/navigation";

export default function MobileSubMenu({ settings }) {
	const { locale } = useParams();
	const pathname = usePathname();
	const { translations } = useSelector((state) => state.common);
	// const pathArray = usePathname().split("/");
	const isActiveForMobile = [
		`/${locale}`,
		"/",
		`/${locale}/categories`,
		"/categories",
	].includes(pathname);

	const isMobile = useMediaQuery("(max-width: 767px)");

	const headerPage = settings?.header_page || [];
	const className = "px-2 py-2 bg-white rounded-lg flex items-center";
	return (
		isMobile &&
		isActiveForMobile && (
			<div className="mobile-menu bg-slate-100 container py-3 flex items-center gap-2">
				<Link href={"/categories"} className={`${className}`}>
					{translations["category"]}
				</Link>
				{headerPage.map((page, index) => (
					<Link key={index} href={page?.path} className={`${className}`}>
						{page?.name}
					</Link>
				))}
			</div>
		)
	);
}
