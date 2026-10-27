"use client";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "react-toastify";

import Modal from "../elements/Modal";
import { useForm } from "react-hook-form";
import axiosInstance from "@/lib/axios-instance";
import { addDiscountInfo } from "@/store/slices/cartSlice";
import { setGlobalLoader } from "@/store/slices/commonSlice";
import type { BaseSyntheticEvent } from "react";
import type { ApiResponse, Coupon } from "@/types";

interface CouponModalProps {
	showModal: boolean;
	setShowModal: (show: boolean) => void;
}

interface CouponFormValues {
	coupon_code: string;
}

const CouponModal = ({ showModal, setShowModal }: CouponModalProps) => {
	const { translations } = useAppSelector((state) => state.common);
	const [error, setError] = useState("");
	const dispatch = useAppDispatch();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CouponFormValues>();

	const onSubmit = async (data: CouponFormValues, event?: BaseSyntheticEvent) => {
		event.preventDefault();
		setError("");
		dispatch(setGlobalLoader(true));
		try {
			const coupon = data.coupon_code;
			const response = await axiosInstance.get<ApiResponse<Coupon>>(`coupons/${coupon}`);
			dispatch(setGlobalLoader(false));
			if (response.status === 200) {
				dispatch(addDiscountInfo(response.data.data));
				toast.success(
					`Coupon added, Applicable for minimum order amount ${response.data.data.minimum_order}`
				);
				setShowModal(false); //closing coupon modal
			} else {
				setError("Invalid coupon code");
			}
		} catch (error) {
			setError(error?.response?.data?.message || "Invalid coupon code");
			dispatch(setGlobalLoader(false));
		}
	};
	return (
		<Modal
			showModal={showModal}
			setShowModal={setShowModal}
			title={translations["coupon"] || "Coupon"}
		>
			<div className="w-full lg:w-[27rem] text-slate-500">
				<form className="" onSubmit={handleSubmit(onSubmit)}>
					<div className="mt-6 mb-8 form-control">
						<input
							type="text"
							className="w-full"
							name="coupon_code"
							placeholder="Type coupon code here"
							{...register("coupon_code", {
								required: "Coupon code is required.",
							})}
						/>
						{errors.coupon_code && (
							<p className="errorMsg">{errors.coupon_code.message}</p>
						)}
						{error && (
							<p className="errorMsg">Invalid or Expired Coupon Code</p>
						)}
					</div>
					<div className="flex justify-center">
						<button type="submit" className="primary-btn px-16">
							Apply
						</button>
					</div>
				</form>
			</div>
		</Modal>
	);
};

export default CouponModal;
