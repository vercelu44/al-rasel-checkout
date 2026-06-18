"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import RequireAuth from "@/components/hoks/RequireAuth";

//icons
import { FaClipboardList, FaUser } from "react-icons/fa";
import { HiHeart } from "react-icons/hi2";
import { useSelector } from "react-redux";

const DashboardLayout = ({ children, params }) => {
	const { translations } = useSelector((state) => state.common);
	const { settings } = useSelector((state) => state.common);
	const activeSegment = useSelectedLayoutSegment();

	const navItems = [
		{
			text: `${translations["my-details"] || "My Details"}`,
			icon: <FaUser />,
			path: "/",
		},
		{
			text: `${translations["order-history"] || "Order History"}`,
			icon: <FaClipboardList />,
			path: "my-orders",
		},
		{
			text: `${translations["my-wish-list"] || "My Wishlist"}`,
			icon: <HiHeart />,
			path: "my-wishlist",
		},
	];

	return (
		<div className="bg-slate-100">
			<div className="container">
				{/* <h3 className="text-center text-5xl my-28">Welcome to Dashboard</h3> */}
				<div className="bg-white border-b border-slate-200">
					<div className="grid grid-cols-2 md:grid-cols-3">
						<div className="hidden md:block"></div>
						<div className="text col-span-1 px-3 py-3 md:py-0">
							<h3 className="md:text-center text-2xl lg:text-3xl md:pt-8">
								{translations["my-profile"] || "My Profile"}
							</h3>
							<div className="text-sm text-slate-600">
								<p className="md:text-center">
									{translations["welcome-to-your-account"] ||
										"Welcome to your account"}
								</p>
							</div>
						</div>

						<div className="justify-self-end flex items-center mr-3">
							<Link
								href={"/products?sort_type=new"}
								className="px-2 py-3 bg text-center rounded shadow-around"
								style={{
									// border: `1px solid ${settings?.colors?.primary_text}`,
									color: settings?.colors?.primary_text,
									backgroundColor: settings?.colors?.primary,
								}}
							>
								{translations["go-to-shopping"] || "Go to shopping"}
							</Link>
						</div>
					</div>

					<div className="md:flex  min-h-[700px]">
						<nav className=" shadow-md m-2 p-2 rounded">
							<ul className="md:w-[200px] flex md:flex-col justify-evenly md:justify-around">
								{navItems.map((item, index) => (
									<li
										key={item.path}
										className={`px-3 rounded md:mb-3 py-3 cursor-pointer hover:bg ${
											activeSegment === item.path ||
											(!activeSegment && index === 0)
												? "shadow-around"
												: ""
										} `}
										style={{
											backgroundColor:
												activeSegment === item.path ||
												(!activeSegment && index === 0)
													? settings?.colors?.primary
													: "transparent",
											color:
												activeSegment === item.path ||
												(!activeSegment && index === 0)
													? settings?.colors?.primary_text
													: "black",

											// border: `1px solid ${
											// 	activeSegment === item.path ||
											// 	(!activeSegment && index === 0)
											// 		? settings?.colors?.primary_text
											// 		: "transparent"
											// }`,
										}}
									>
										<Link href={`/dashboard/${item.path}`}>
											<span>{item.text}</span>
										</Link>
									</li>
								))}
							</ul>
						</nav>
						<div className="w-full shadow-md m-2 overflow-auto scrollbar-hide rounded max-h-[700px]">
							{children}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RequireAuth(DashboardLayout);
