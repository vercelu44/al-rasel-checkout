import useLockedBody from "@/hooks/useLockedBody";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

export interface DrawerProps {
	title?: React.ReactNode;
	children?: React.ReactNode;
	show: boolean;
	setShow: (show: boolean) => void;
}

const DrawerRight = ({ title, children, show, setShow }: DrawerProps) => {
	useLockedBody(show); // Lock the body when the drawer is open
	return (
		<>
			{/* Backdrop */}
			{show && (
				<div
					className="fixed top-0 left-0 z-30 w-full h-full bg-black opacity-30"
					onClick={() => setShow(false)}
				/>
			)}

			{/* Drawer */}
			<div
				className={`fixed top-0 right-0 z-50 w-[90vw] lg:w-[31rem] h-[100dvh] overflow-y-auto transition-transform ease-in-out duration-300 transform ${
					show ? "translate-x-0" : "translate-x-full"
				} bg-white`}
				tabIndex={-1}
			>
				<div className="relative h-full">
					{/*header*/}
					<div className="flex items-center justify-between px-5 py-2 text-slate-900 border-b-[1px] border-slate-300">
						<h3 className="text-2xl font-title font-semibold">
							{title ? title : null}
						</h3>
						<button
							aria-label="Close"
							className="icon-btn text-2xl"
							onClick={() => setShow(false)}
						>
							<AiOutlineClose />
						</button>
					</div>
					{/*body*/}
					{children && show ? (
						children
					) : (
						<p className="text-slate-500 text-lg leading-relaxed">
							This is a regular side drawer
						</p>
					)}
				</div>
			</div>
		</>
	);
};

export default DrawerRight;
