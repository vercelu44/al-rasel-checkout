"use client";
import React, { useState, useEffect } from "react";
import { BiArrowToTop } from "react-icons/bi";
import type { SiteSettings } from "@/types";

const ScrollToTopButton = ({ settings }: { settings?: SiteSettings }) => {
	const [isVisible, setIsVisible] = useState(false);

	const handleScroll = () => {
		const scrollY = window.scrollY;
		setIsVisible(scrollY > 100);
	};

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<>
			{isVisible && (
				<div
					className="scroll-to-top-button z-50 fixed right-5 bottom-5 rounded-full shadow-lg h-[43px] w-[43px] inline-flex justify-center items-center cursor-pointer"
					onClick={scrollToTop}
					style={{
						backgroundColor: settings?.colors?.primary,
						color: settings?.colors?.primary_text,
					}}
				>
					<BiArrowToTop size={20} />
				</div>
			)}
		</>
	);
};

export default ScrollToTopButton;
