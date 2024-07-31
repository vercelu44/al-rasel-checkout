import useLockedBody from "@/hooks/useLockedBody";
import React from "react";
import { RiCloseCircleFill } from "react-icons/ri";

export default function Modal({
	showModal,
	setShowModal,
	title,
	children,
	bottomSheet = true,
	bodyOnly = false,
}) {
	useLockedBody(showModal, "root"); // to lock body scroll
	return (
		<>
			{showModal ? (
				<>
					{/* Backdrop */}
					<div
						onClick={() => bodyOnly && setShowModal(false)}
						className={`w-full h-full opacity-40 fixed z-40 inset-0 bg-black ${
							bodyOnly ? "cursor-pointer" : ""
						}`}
					></div>
					{/* Backdrop */}

					{/* Modal  */}
					<div
						className={`flex justify-center h-fit md:h-auto md:w-fit md:my-6 mx-auto max-w-7xl ${
							bottomSheet ? "mt-auto" : "my-auto md:my-0 px-3 md:px-0 "
						} md:items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-40 outline-none focus:outline-none`}
					>
						<div className="relative w-full h-fit">
							{/*content*/}
							<div
								className={`border-0 ${
									bottomSheet ? "rounded-t-2xl" : "rounded-2xl"
								} md:rounded-2xl shadow-md relative flex flex-col w-full bg-white outline-none focus:outline-none overflow-hidden`}
							>
								{/*header*/}
								{!bodyOnly && (
									<div className="flex items-center justify-between px-3 md:px-5 py-1">
										<h3 className="text-[18px]/[28px] md:text-2xl font-title font-semibold text-slate-900 line-clamp-1">
											{title ? title : null}
										</h3>
										<button
											className="icon-btn text-2xl md:text-4xl text-slate-500"
											onClick={() => setShowModal(false)}
										>
											<RiCloseCircleFill size={33.611} />
										</button>
									</div>
								)}
								{/*body*/}
								<div
									className={`relative px-3 md:px-6 ${
										bodyOnly ? "pt-3 md:py-6" : "md:pb-6"
									} overflow-y-auto max-h-[80vh] after:content-[attr(data-spacer)] after:block after:h-3 md:after:h-0`}
									data-spacer=""
								>
									{children ? (
										children
									) : (
										<p className="text-slate-500 text-lg leading-relaxed">
											This is a regular Modal, Pass Modal children to replace it
										</p>
									)}
								</div>
							</div>
						</div>
					</div>
				</>
			) : null}
		</>
	);
}