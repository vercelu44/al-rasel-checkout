"use client";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useVerifyOtpMutation } from "@/store/api/authAPI";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import { setGlobalLoader } from "@/store/slices/commonSlice";
import { siteConfig } from "@/config/site";

const OtpForm = ({ phone, setShowModal, setOtpSent, translations }) => {
	const { settings } = useSelector((state) => state.common);
	const [otp, setOtp] = useState(Array(6).fill(""));
	const [verifyOTP, { isSuccess, isLoading, data: user, isError }] =
		useVerifyOtpMutation();
	const searchParams = useSearchParams();
	const [error, setError] = useState(false);
	const dispatch = useDispatch();
	const router = useRouter();

	//handling global loader
	useEffect(() => {
		if (isLoading) {
			dispatch(setGlobalLoader(true));
		} else {
			dispatch(setGlobalLoader(false));
		}
	}, [isLoading, dispatch]);

	useEffect(() => {
		if (isSuccess && user) {
			const redirect = searchParams.get("redirect");
			toast.success("Login successful");
			localStorage.setItem("token", user.token);
			dispatch(setUser(user.data));
			setShowModal(false);
			setOtpSent(false);
			// router.push(redirect || "/dashboard");
				if (redirect) {
				router.push(redirect);
			}
			// console.log(user, "user Data");
		} else if (isError) {
			toast.error("Oops! OTP not Matched");
		}
	}, [
		isSuccess,
		isError,
		user,
		dispatch,
		router,
		setShowModal,
		setOtpSent,
		searchParams,
	]);

	const handleOTPVerification = () => {
		const jointedOtp = otp.join("");
		if (jointedOtp.length < 6) {
			setError(true);
		} else {
			const optData = {
				phone_no: phone,
				country: siteConfig.phone.country,
				code: jointedOtp,
			};
			// console.log(optData, "Otp data");
			verifyOTP(optData);
		}
	};

	const handleChange = (e, index) => {
		setError(false);
		const { value } = e.target;
		setOtp((prevOtp) => {
			const newOtp = [...prevOtp];
			newOtp[index] = value;

			// Move focus to the next input box
			if (value && index < 5) {
				const nextInput = e.target.nextSibling.nextSibling;
				if (nextInput) {
					nextInput.focus();
				}
			}

			// Move focus to the previous input box when backspace is pressed and the current input is empty
			if (!value && index > 0) {
				const previousInput = e.target.previousSibling.previousSibling;
				if (previousInput) {
					previousInput.focus();
				}
			}

			return newOtp;
		});
	};

	return (
		<div className="otp">
			<div className=" mb-8">
				<div className="flex w-full items-center justify-between">
					{[...Array(6)].map((_, index) => (
						<React.Fragment key={index}>
							<input
								type="number"
								maxLength={1}
								value={otp[index]}
								onChange={(e) => handleChange(e, index)}
								className="w-10 md:w-12 h-10 md:h-12 px-0 text-2xl lg:text-3xl text-center border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
							/>
							{index !== 5 && (
								<span className="text-3xl text-slate-300">-</span>
							)}
						</React.Fragment>
					))}
				</div>
				{error && <p className="errorMsg">6 digit valid OTP required</p>}
			</div>
			<button
				type="submit"
				onClick={handleOTPVerification}
				className="primary-btn w-full"
				style={{
					backgroundColor: settings?.colors?.primary,
					color: settings?.colors?.primary_text,
					border: `1px solid ${settings?.colors?.primary_text}`,
				}}
			>
				{translations["confirm-code"] || "Confirm OTP"}
			</button>
		</div>
	);
};

export default OtpForm;
