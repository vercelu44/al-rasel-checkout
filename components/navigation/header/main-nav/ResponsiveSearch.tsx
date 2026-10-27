"use client";
import React, { useEffect, useRef, useState } from "react";
import Search from "../../../elements/Search";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { AiOutlineClose } from "react-icons/ai";
import type { SiteSettings } from "@/types";

export default function ResponsiveSearch({ settings }: { settings: SiteSettings }) {
	const [searchOpen, setSearchOpen] = useState(false);
	const searchMenuRef = useRef<HTMLDivElement>(null);

	const closeMenu = () => {
		setSearchOpen(false);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchMenuRef.current &&
				!searchMenuRef.current.contains(event.target as Node)
			) {
				closeMenu();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div style={{ color: settings?.colors?.primary_text }}>
			{!searchOpen ? (
				<button
					aria-label="Search"
					onClick={() => setSearchOpen(!searchOpen)}
					className="lg:hidden"
				>
					<HiMagnifyingGlass size={24} />
				</button>
			) : (
				<span className="lg:hidden">
					<AiOutlineClose size={24} />
				</span>
			)}

			{searchOpen && (
				<div
					ref={searchMenuRef}
					className="absolute z-30 left-0 top-full shadow-lg w-full lg:hidden"
					style={{ backgroundColor: settings?.colors?.primary }}
				>
					<div className="container flex justify-center py-8 pl-8">
						<Search />
					</div>
				</div>
			)}
		</div>
	);
}
