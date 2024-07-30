"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../elements/Modal";
import { logoutUser } from "@/store/slices/authSlice";
import LogoutIcon from "../elements/svg/LogoutIcon";
import { signOut } from "next-auth/react";

const LogoutModal = ({ showModal, setShowModal }) => {
	const { translations } = useSelector((state) => state.common);

	const dispatch = useDispatch();
	const handleLogout = () => {
		dispatch(logoutUser());
		signOut({ redirect: false });
		logoutUser();
		setShowModal(false);
	};

	return (
		<Modal
			showModal={showModal}
			setShowModal={setShowModal}
			bodyOnly={true}
			bottomSheet={false}
		>
			<div className="md:w-[27rem] pt-6 md:pt-12">
				<div className="text-center">
					<div className="w-[64px] md:w-[96px] h-[64px] md:h-[96px] rounded-full bg-red-200 mx-auto flex justify-center items-center">
						<div className="w-[36px] md:w-[48px] h-[36px] md:h-[48px]">
							<LogoutIcon height={"100%"} width={"100%"} />
						</div>
					</div>
				</div>
				<div className="text text-center">
					<h4 className="mt-3 md:mt-5 text-2xl md:text-3xl/[38px] font-extrabold text-red-500">
						{translations["log-out"] || "Logout"}
					</h4>
					<p className="mx-auto text-base md:text-[18px]/[24px] mt-4 md:mt-5 text-slate-800 max-w-[350px]">
						{" "}
						{translations["are-you-sure"] ||
							"Are you sure you want to log out?"}
					</p>
				</div>
				<div className="flex justify-center items-center gap-4 lg:gap-6 mt-4 md:mt-12 font-semibold text-[18px]/[26px] md:mb-2">
					<button
						onClick={() => setShowModal(false)}
						className="w-full py-3.5 rounded-lg bg-slate-200"
					>
						{translations["no"] || "No"}
					</button>
					<button
						onClick={handleLogout}
						className="w-full py-3.5 rounded-lg bg-primary text-white"
					>
						{translations["yes"] || "Yes"}
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default LogoutModal;
