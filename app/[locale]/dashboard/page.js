"use client";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import profileAvatar from "@/public/assets/images/profile_avatar.png";
import { Link, useRouter } from "@/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";

//icons
import { FaClipboardList, FaUser } from "react-icons/fa";
import { HiHeart, HiReceiptPercent, HiTicket } from "react-icons/hi2";
import { MdRateReview } from "react-icons/md";
import { RiQuestionAnswerFill } from "react-icons/ri";
import { MdArrowForwardIos } from "react-icons/md";
import { BsInfoCircleFill } from "react-icons/bs";
import { SiSpringsecurity } from "react-icons/si";
import { IoIosWarning } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { MdLibraryBooks } from "react-icons/md";
import MenuCard from "@/components/cards/MenuCard";

export default function MobileDashboardLayout({ params }) {
	const { user } = useSelector((state) => state.auth);
	const { translations } = useSelector((state) => state.common);
	const isMobile = useMediaQuery("(max-width: 768px)");
	const router = useRouter();

	if (!isMobile) router.push("/dashboard/profile"); //redirecting user to profile for desktop

	const navItems = [
		{ text: translations["my-profile"] || "My Profile", icon: <FaUser />, path: "/dashboard/profile" },
		{
			text: translations["my-order"] || "My Orders",
			icon: <FaClipboardList />,
			path: "/dashboard/my-orders",
		},
		{
			text: translations["wishlist"] || "Wishlist",
			icon: <HiHeart />,
			path: "/dashboard/my-wishlist",
		},
		{
			text: translations["my-review"] || "My Reviews",
			icon: <MdRateReview />,
			path: "/dashboard/my-reviews",
		},
		{
			text: translations["voucher"] || "Voucher",
			icon: <HiReceiptPercent />,
			path: "/dashboard/my-voucher",
		},
		{
			text: translations["q&a"] || "Q&A",
			icon: <RiQuestionAnswerFill />,
			path: "/dashboard/qna",
		},
		{
			text: translations["support-ticket"] || "Support Ticket",
			icon: <HiTicket />,
			path: "/dashboard/support-ticket",
		},
	];

	const companyLinks = [
		{
			text: translations["about-us"] || "About Us",
			icon: <BsInfoCircleFill />,
			path: "/pages/about-us",
		},
		{
			text: translations["booking-policy"] || "Booking Policy",
			icon: <MdLibraryBooks />,
			path: "/pages/booking-policy",
		},
		{
			text: translations["trams-and-conditions"] || "Terms & Conditions",
			icon: <IoIosWarning />,
			path: "/pages/terms-and-conditions",
		},
		{
			text: translations["privacy-policy"] || "Privacy Policy",
			icon: <SiSpringsecurity />,
			path: "/pages/privacy-policy",
		},
		{
			text: translations["log-out"] || "Log Out",
			icon: <IoLogOut />,
			path: "logout",
		},
	];

	return (
		<section id="mobile-dashboard-layout">
			<div
				id="user-quick-menu"
				className="bg-gradient-to-r from-red-500 to-primary p-3"
			>
				<Link
					href={navItems[0].path}
					className="profile flex gap-3 items-center bg-white rounded-xl p-4"
				>
					<div className="w-[4rem] h-[4rem] rounded-full bg-gray-200">
						<Image
							src={user?.image || profileAvatar}
							alt="Profile"
							height={64}
							width={64}
							className="w-full h-full rounded-full"
						/>
					</div>
					<div>
						<h3 className="text-slate-800 font-semibold">
							{user?.name || <span className="text-slate-300">No Name</span>}
						</h3>
						<p className="text-slate-500 text-sm">
							{user?.phone && user?.country_code + user.phone}
						</p>
					</div>
					<div className="ml-auto">
						<MdArrowForwardIos className="text-slate-300" />
					</div>
				</Link>
				<div className="quick-links flex gap-2 mt-2">
					{navItems.slice(1, 4).map((item, index) => (
						<Link
							key={index}
							href={item.path}
							className="bg-white p-3 rounded-lg w-full flex flex-col items-center justify-center gap-2"
						>
							<span className="text-primary text-[28px]">{item.icon}</span>
							<span className="text-sm font-normal text-slate-500">
								{item.text}
							</span>
						</Link>
					))}
				</div>
			</div>
			<div id="user-additional-menu" className="my-4 p-3">
				<MenuCard
					title={translations["offer"] || "Offer"}
					menuItems={navItems.slice(4, 5)}
				/>
				<MenuCard
					title={translations["help"] || "Help"}
					menuItems={navItems.slice(5, 7)}
				/>
				<MenuCard
					title={translations["company"] || "Company"}
					menuItems={companyLinks}
				/>
			</div>
		</section>
	);
}
