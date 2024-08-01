"use client";
import Image from "next/image";
import { Link } from "@/navigation";
import React, { useEffect, useRef, useState } from "react";
import { BsArrowRight, BsChevronDown, BsChevronUp } from "react-icons/bs";
import noImage from "@/public/assets/images/no-image.png";
import menuOffer from "@/public/assets/images/banner/category-menu-offer.png";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { useGetPopularCategoriesQuery } from "@/store/api/categoriesAPI";

export default function MegaMenu({ settings }) {
	const { locale } = useParams();
	const { data: categoriesData } = useGetPopularCategoriesQuery({ locale });
	const popularCategories = categoriesData?.data || [];

	const [menuOpen, setMenuOpen] = useState(false);
	const headerPage = settings?.header_page || [];
	const { translations } = useSelector((state) => state.common);
	const megaMenuRef = useRef(null);

	const closeMenu = () => {
		setMenuOpen(false);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
				closeMenu();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const className = "px-2 py-3 rounded-sm flex items-center gap-1";

	return (
		<>
			<div className="nav-menu container flex items-center gap-2">
				{!menuOpen ? (
					<button
						onClick={() => setMenuOpen(!menuOpen)}
						className={`menuBtn ${className}`}
					>
						{translations["category"]} <BsChevronDown />
					</button>
				) : (
					<span className={`menuBtn ${className} cursor-pointer`}>
						{translations["category"]} <BsChevronUp />
					</span>
				)}
				{headerPage.map((page, index) => (
					<Link key={index} href={page?.path} className={`${className}`}>
						{page?.name}
					</Link>
				))}
			</div>

			{menuOpen && (
				<div
					ref={megaMenuRef}
					className="absolute z-30 left-0 top-full bg-white shadow-lg w-full border border-slate-300 border-t-0"
				>
					<div className="container flex gap-6 py-8 pl-8">
						<div className="">
							<div className="grid grid-cols-4 gap-4">
								{popularCategories?.slice(0, 8)?.map((category, i) => (
									<Link
										key={i}
										href={`/categories/${category.slug}`}
										onClick={closeMenu}
										className="flex gap-2 items-center py-2 hover:text-primary"
									>
										<div className="category-img flex justify-center items-center w-[58px] h-[38px]">
											<Image
												src={category?.icon || noImage}
												alt={category.category_name}
												priority
												width={58}
												height={38}
												className="w-[58px] h-[38px] object-contain"
											/>
										</div>
										{category.category_name}
									</Link>
								))}
							</div>
							<div className="mt-6">
								<Link
									href={"/categories"}
									onClick={closeMenu}
									className="border border-primary rounded-lg py-2 px-3 text-primary active:scale-95"
								>
									{translations["all-categories"] || "All Categories"} <BsArrowRight className="rtl:rotate-180" />
								</Link>
							</div>
						</div>
						<div className="category-img flex justify-center items-center w-[356px] h-[200px]">
							<Image
								src={menuOffer}
								alt={"offer"}
								width={356}
								height={200}
								className="w-[356px] h-[200px] object-contain"
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
