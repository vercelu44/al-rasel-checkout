"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { siteConfig } from "@/config/site";
import { getFormattedDate } from "@/utils/format-date";
import { logoutUser } from "@/store/slices/authSlice";
import useProfileUpdate from "@/hooks/useProfileUpdate";
import ProfileImageUpload from "./_components/ProfileImageUpload";

import { IoLogOut } from "react-icons/io5";

const MyProfile = () => {
	const { user } = useSelector((state) => state.auth);
	const { translations } = useSelector((state) => state.common);
	const [profileImageFile, setProfileImageFile] = useState(null);
	const { settings } = useSelector((state) => state.common);
	const { handleUserUpdate } = useProfileUpdate();
	const [editMode, setEditMode] = useState(false);
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const updateUser = async (data) => {
		const updatedProfileData = {
			...data,
			profileImageFile,
		};
		const isSuccess = await handleUserUpdate(updatedProfileData);
		if (isSuccess) {
			setEditMode(false);
		}
	};

	// if (isLoading) return <p className="text-2xl text-red-500">Loading.....</p>;

	return (
		<div className="md:px-10 px-3 pt-6 pb-8">
			<form className="basis-3/5" onSubmit={handleSubmit(updateUser)}>
				<ProfileImageUpload
					profileImageFile={profileImageFile}
					setProfileImageFile={setProfileImageFile}
					editMode={editMode}
					user={user}
				/>
				<div className="grid lg:grid-cols-3 gap-8">
					<div className="form-control border border-gray-100 rounded p-2">
						<label className="block text-base text-slate-500 mb-2">
							{translations["name"] || "Name"}
						</label>
						{!editMode ? (
							<p className="text-slate-800">
								{user?.name || (
									<span className="text-slate-300">
										{translations["your-name"] || "Your Name"}
									</span>
								)}
							</p>
						) : (
							<>
								<input
									type="text"
									name="name"
									defaultValue={user?.name}
									placeholder={
										translations["type-your-name"] || "Type your name"
									}
									{...register("name", {
										required: "Name is required.",
										maxLength: {
											value: 25,
											message: "Name is too large",
										},
									})}
								/>
								{errors.name && (
									<p className="errorMsg">{errors.name.message}</p>
								)}
							</>
						)}
					</div>
					<div className="form-control border border-gray-100 rounded p-2">
						<label className="block text-base text-slate-500 mb-2">
							{translations["date-of-birth"] || "Date of Birth"}
						</label>
						{!editMode ? (
							<p>
								{user?.birth_date && user?.birth_date !== "0000-00-00" ? (
									getFormattedDate(user?.birth_date)
								) : (
									<span className="text-slate-300">
										{translations["day-month-year"] || "Day/Month/Year"}
									</span>
								)}
							</p>
						) : (
							<>
								<input
									type="date"
									name="birth_date"
									defaultValue={user?.birth_date}
									{...register("birth_date")}
								/>
								{errors.birth_date && (
									<p className="errorMsg">{errors.birth_date.message}</p>
								)}
							</>
						)}
					</div>
					<div className="form-control border border-gray-100 rounded p-2">
						<label className="block text-base text-slate-500 mb-2">
							{translations["gender"] || "Gender"}
						</label>
						{!editMode ? (
							<p className="text-slate-800">
								{user?.gender && user?.gender !== "Unknown" ? (
									user?.gender
								) : (
									<span className="text-slate-300">
										{translations["your-gender"] || "Your Gender"}
									</span>
								)}
							</p>
						) : (
							<>
								<select
									className="select w-full h-12 text-base font-title font-normal px-2 border border-gray-300 focus:outline-none focus:border-primary"
									{...register("gender", { required: "Gender is Required" })}
									defaultValue={user?.gender}
								>
									<option disabled>
										{translations["select-your-gender"] || "Select Your Gender"}
									</option>
									<option key="Male" value="Male">
										{translations["male"] || "Male"}
									</option>
									<option key="Female" value="Female">
										{translations["female"] || "Female"}
									</option>
									<option key="Others" value="Other">
										{translations["others"] || "Others"}
									</option>
								</select>
								{errors.gender && (
									<p className="errorMsg">{errors.gender.message}</p>
								)}
							</>
						)}
					</div>
					<div className="form-control border border-gray-100 rounded p-2">
						<label className="block text-base text-slate-500 mb-2">
							{translations["email"] || "Email"}
						</label>
						{!editMode ? (
							<p className="text-slate-800">
								{user?.email || (
									<span className="text-slate-300">
										{translations["your-email-(if-any)"] || "Your Email"}
									</span>
								)}
							</p>
						) : (
							<>
								<input
									type="email"
									name="email"
									defaultValue={user?.email}
									placeholder={
										translations["type-your-email"] || "Type your email"
									}
									{...register("email", {
										pattern: {
											value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
											message: "Email is not valid.",
										},
									})}
								/>
								{errors.email && (
									<p className="errorMsg">{errors.email.message}</p>
								)}
							</>
						)}
					</div>
					<div className="border border-gray-100 rounded p-2">
						<label className="block text-slate-500 mb-2">
							{translations["phone-number"] || "Phone Number"}
						</label>
						{!editMode ? (
							<p className="text-slate-800">
								{(user?.phone && siteConfig.phone.countryCode + user.phone) || (
									<span className="text-slate-300">
										{translations["your-phone"] || "Your Phone"}
									</span>
								)}
							</p>
						) : (
							<>
								<input
									type="text"
									className="w-full border bg-slate-100 border-gray-300 focus:outline-none cursor-not-allowed"
									name="phone"
									disabled={true}
									defaultValue={siteConfig.phone.countryCode + user?.phone}
								/>
								{/* </div> */}
								{errors.phone && (
									<p className="errorMsg">{errors.phone.message}</p>
								)}
							</>
						)}
					</div>
					<div className="border border-gray-100 rounded p-2">
						<label className="block text-slate-500 mb-2">
							{translations["alternate-phone-number"] ||
								"Alternate Phone Number"}
						</label>
						{!editMode ? (
							<p className="text-slate-800">
								{(user?.alt_phone_no &&
									siteConfig.phone.countryCode + user.alt_phone_no) || (
									<span className="text-slate-300">
										{translations["your-alternate-phone-number"] ||
											"Your Alternate Phone Number"}
									</span>
								)}
							</p>
						) : (
							<>
								<div className="flex items-center group">
									<div className="h-12 py-2.5 min-w-fit text-base font-title font-normal px-2 border bg-slate-100 border-gray-300 group-focus-within:border-primary group-focus-within:border-r-gray-300">
										<p>{siteConfig.phone.prefix}</p>
									</div>
									<input
										type="tel"
										className="w-full border !pl-2 border-l-0 border-gray-300 focus:outline-none focus:border-primary"
										name="alt_phone_no"
										placeholder={
											translations["type-your-alternative-phone"] ||
											"Type your alternate phone "
										}
										defaultValue={user?.alt_phone_no}
										{...register("alt_phone_no", {
											pattern: {
												value: siteConfig.phone.pattern,
												message: "Invalid phone number",
											},
										})}
									/>
								</div>
								{errors.alt_phone_no && (
									<p className="errorMsg">{errors.alt_phone_no.message}</p>
								)}
							</>
						)}
					</div>
					{/* Address  */}
					<div className="form-control border border-gray-100 rounded p-2">
						<label className="block text-base text-slate-500 mb-2">
							{translations["address"] || "Address"}
						</label>
						{!editMode ? (
							<p className="text-slate-800">
								{user?.address || (
									<span className="text-slate-300">
										{translations["your-address"] || "Your Address"}
									</span>
								)}
							</p>
						) : (
							<>
								<input
									type="text"
									name="address"
									defaultValue={user?.address}
									placeholder={
										translations["type-your-address"] || "Type your address"
									}
									{...register("address", {
										// required: "Address line required",
									})}
								/>
								{errors.address && (
									<p className="errorMsg">{errors.address.message}</p>
								)}
							</>
						)}
					</div>
					<div className="form-control border border-gray-100 rounded p-2">
						<label className="block text-base text-slate-500 mb-2">
							{translations["city"] || "City"}
						</label>
						{!editMode ? (
							<p className="text-slate-800">
								{user?.city || (
									<span className="text-slate-300">
										{translations["your-city"] || "Your City"}
									</span>
								)}
							</p>
						) : (
							<>
								<input
									type="text"
									name="city"
									defaultValue={user?.city}
									placeholder={
										translations["type-your-city"] || "Type your city"
									}
									{...register("city", {
										// required: "City required",
									})}
								/>
								{errors.city && (
									<p className="errorMsg">{errors.city.message}</p>
								)}
							</>
						)}
					</div>
					<div className="form-control border border-gray-100 rounded p-2">
						<label className="block text-base text-slate-500 mb-2">
							{translations["country"] || "Country"}
						</label>
						{!editMode ? (
							<p className="text-slate-800">{siteConfig.phone.country}</p>
						) : (
							<>
								<input
									type="text"
									name="country"
									defaultValue={siteConfig.phone.country}
									placeholder={
										translations["type-your-country"] || "Type your country"
									}
									disabled={true}
									{...register("country")}
								/>
								{errors.country && (
									<p className="errorMsg">{errors.country.message}</p>
								)}
							</>
						)}
					</div>
				</div>
				<div className="flex items-center gap-4 mt-10">
					<div className="form-control">
						<label></label>
						<button
							type="button"
							onClick={() => setEditMode((prevMode) => !prevMode)}
							className="py-2 px-4 active:scale-95 rounded shadow-around"
							style={{
								backgroundColor: settings?.colors?.primary,
								color: settings?.colors?.primary_text,
								// border: `1px solid ${settings?.colors?.primary_text}`,
							}}
						>
							{editMode
								? `${translations["cancel"] || "Cancel"}`
								: `${translations["edit"] || "Edit"}`}
						</button>
					</div>
					{!editMode && (
						<div className="form-control">
							<button
								className="flex items-center space-x-3 py-2 px-4 active:scale-95 rounded shadow-around"
								onClick={() => dispatch(logoutUser())}
								style={{
									backgroundColor: settings?.colors?.primary,
									color: settings?.colors?.primary_text,
									// border: `1px solid ${settings?.colors?.primary_text}`,
								}}
							>
								<IoLogOut /> {translations["logout"] || "Logout"}
							</button>
						</div>
					)}
					{editMode ? (
						<div className="form-control">
							<label></label>
							<button
								type="submit"
								className="py-2  px-4 active:scale-95 rounded shadow-around"
								style={{
									backgroundColor: settings?.colors?.primary,
									color: settings?.colors?.primary_text,
									// border: `1px solid ${settings?.colors?.primary_text}`,
								}}
							>
								{translations["update-now"] || "Update Now"}
							</button>
						</div>
					) : null}
				</div>
			</form>
		</div>
	);
};

export default MyProfile;
