"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import OtpForm from "./OtpForm";
import Modal from "@/components/elements/Modal";

//Hooks
import { useOtpLoginMutation } from "@/store/api/authAPI";
import { useDispatch, useSelector } from "react-redux";
import { setGlobalLoader } from "@/store/slices/commonSlice";
import { siteConfig } from "@/config/site";

const LoginModal = ({ showModal, setShowModal, title }) => {
	const { settings, translations } = useSelector((state) => state.common);
	const [otpSent, setOtpSent] = useState(false);
	const [phone, setPhone] = useState("");
	const dispatch = useDispatch();

	const [sendOTP, { isSuccess, isLoading, data: otpResponse, isError }] =
		useOtpLoginMutation();

	//handling global loader
	useEffect(() => {
		if (isLoading) {
			dispatch(setGlobalLoader(true));
		} else {
			dispatch(setGlobalLoader(false));
		}
	}, [isLoading, dispatch]);

	useEffect(() => {
		if (isSuccess && otpResponse) {
			toast.success("OTP has been sent to your mobile");
			// toast(otpResponse?.otp_message);
			// console.log(otpResponse, "OTP Response");
			setOtpSent(true);
		} else if (isError) {
			console.error("Failed to send OTP");
		}
	}, [isSuccess, isError, otpResponse]);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();

	const onSubmit = async (data) => {
		const phone = data?.phone;
		const loginData = {
			phone_no: phone,
			country: siteConfig.phone.country,
		};
		setPhone(phone);
		sendOTP(loginData);
	};

	return (
		<Modal showModal={showModal} setShowModal={setShowModal} title={title}>
			<div className="w-full lg:w-[27rem] text-slate-500">
				<div>
					
					{settings?.footer_logo ? (
					<Image
						src={settings?.footer_logo}
						alt={"Logo"}
						width={200}
						height={48}
						className="max-h-12 object-contain object-left"
					/>
					) : (
						<span className="text-3xl font-bold inline-block">
							{settings?.name}
						</span>
					)}

				</div>
				<p className="py-6 ">
					{otpSent
						? `${
								translations["otp-sent-message"] ||
								"We have just sent a 6 digit OTP code to your mobile number"
						  } (${siteConfig.phone.countryCode + phone})`
						: translations["verify-mobile-message"] ||
						  "Become an ideal member by just verifying your mobile number"}
				</p>
				{!otpSent ? (
					<form className="" onSubmit={handleSubmit(onSubmit)}>
						<div className="mb-8">
							<label className="block text-base mb-2">Phone</label>
							<div className="flex items-center group">
								<div className="h-12 py-2.5 min-w-fit text-base font-title font-normal px-2 border bg-slate-100 border-gray-300 group-focus-within:border-primary group-focus-within:border-r-gray-300">
									<p>{siteConfig.phone.prefix}</p>
								</div>
								<input
									type="tel"
									className="w-full !pl-2 rounded-s-none border border-l-0 border-gray-300 focus:outline-none group-focus-within:border-primary"
									name="phone"
									placeholder="Your mobile number"
									{...register("phone", {
										required: "Phone number is required.",
										pattern: {
											value: siteConfig.phone.pattern,
											message: "Please enter a valid phone number",
										},
									})}
								/>
							</div>
							{errors.phone && (
								<p className="errorMsg">{errors.phone.message}</p>
							)}
						</div>

						<div className="form-control">
							<label></label>
							<button
								type="submit"
								className="primary-btn w-full"
								style={{
									backgroundColor: settings?.colors?.primary,
									color: settings?.colors?.primary_text,
									border: `1px solid ${settings?.colors?.primary_text}`,
								}}
							>
								Send OTP
							</button>
						</div>
					</form>
				) : (
					<OtpForm
						phone={phone}
						setShowModal={setShowModal}
						setOtpSent={setOtpSent}
						translations={translations}
					/>
				)}
				{/* <SocialLogin /> */}
			</div>
		</Modal>
	);
};

export default LoginModal;
