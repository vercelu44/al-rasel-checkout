"use client";
import React from "react";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/store/slices/authSlice";

//icons
import { FaClipboardList, FaUser } from "react-icons/fa";
import { HiHeart, HiReceiptPercent, HiTicket } from "react-icons/hi2";
import { IoLogOut } from "react-icons/io5";
import { MdRateReview } from "react-icons/md";
import { RiQuestionAnswerFill } from "react-icons/ri";

const navItems = [
	{ text: "আমার প্রফাইল", icon: <FaUser />, path: "/dashboard" },
	{
		text: "আমার অর্ডার",
		icon: <FaClipboardList />,
		path: "/dashboard/my-orders",
	},
	{ text: "আমার উইশ লিষ্ট", icon: <HiHeart />, path: "/dashboard/my-wishlist" },
	{
		text: "আমার রিভিউ",
		icon: <MdRateReview />,
		path: "/dashboard/my-reviews",
	},
	{
		text: "ভাউচার",
		icon: <HiReceiptPercent />,
		path: "/dashboard/my-voucher",
	},
	{
		text: "প্রশ্ন ও উত্তর",
		icon: <RiQuestionAnswerFill />,
		path: "/dashboard/qna",
	},
	{
		text: "সাপোর্ট টিকিট",
		icon: <HiTicket />,
		path: "/dashboard/support-ticket",
	},
	// Add more items as needed
];

export default function AuthUserMenus({ togglePopover }: { togglePopover: () => void }) {
	const dispatch = useAppDispatch();

	const handleLogout = () => {
		dispatch(logoutUser());
		togglePopover();
	};
	return (
		<div className="absolute right-0 top-0 z-10 mt-14">
			<div className="relative bg-white pl-2 py-6 w-52 border border-slate-300 rounded-lg">
				<div className="absolute top-0 right-0 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-4 h-4 bg-white border-l border-t border-slate-300"></div>
				<div className="content-area">
					<ul className="w-[15.25rem] text-slate-500">
						{navItems.map((item) => (
							<li
								key={item.path}
								className={`flex items-center py-3 px-4 rounded-lg w-full`}
							>
								<Link
									href={item.path}
									onClick={() => togglePopover()}
									className="flex items-center space-x-3 group"
								>
									<span
										className={`group-hover:font-bold text-xl text-amber-400 group-hover:text-secondary`}
									>
										{item.icon}
									</span>
									<span className="group-hover:text-secondary">
										{item.text}
									</span>
								</Link>
							</li>
						))}
						<li className={`flex items-center py-3 px-4 rounded-lg w-full`}>
							<button
								className="flex items-center space-x-3 group"
								onClick={handleLogout}
							>
								<span
									className={`hover:font-bold text-xl text-amber-400 group-hover:text-secondary`}
								>
									<IoLogOut />
								</span>
								<span className="group-hover:text-secondary hover:font-bold">
									লগ-আউট
								</span>
							</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
