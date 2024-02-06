"use client";

import Image from "next/image";
import React, { useState } from "react";
import { BsCameraFill } from "react-icons/bs";
import { validateImages } from "@/utils/file-upload";

const ReviewImagesUpload = ({
	itemId,
	imageFiles,
	updateImageFiles,
	translations = {},
}) => {
	const [validationError, setValidationError] = useState("");

	const handleImageUpload = (id, e) => {
		const files = Array.from(e.target.files);
		const validationError = validateImages(files);
		if (validationError) {
			setValidationError(validationError);
			return;
		}
		updateImageFiles(itemId, files);
		if (files.length) setValidationError("");
	};

	return (
		<>
			<div className="flex gap-4 mt-2 lg:mt-3">
				{imageFiles[itemId] &&
					imageFiles[itemId].map((file, index) => (
						<div
							key={index}
							className="w-[72px] lg:w-[88px] h-[72px] lg:h-[88px]"
						>
							<Image
								src={URL.createObjectURL(file)}
								alt={`Image ${index}`}
								height={96}
								width={96}
								className="object-cover h-full rounded-lg"
							/>
						</div>
					))}

				<label
					htmlFor={`image-upload-${itemId}`}
					className="w-[72px] lg:w-[88px] h-[72px] lg:h-[88px] py-2 px-1 text-center border-2 border-dashed border-slate-300 hover:bg-primary-50 rounded-lg cursor-pointer text-slate-500"
				>
					<BsCameraFill size={24} />
					<p className="text-[10px]/[14px] lg:text-sm/[100%] mt-1 lg:mt-2">
						{translations["upload-image"] || "ছবি আপলোড করুন"}
					</p>
					<input
						type="file"
						accept="image/*"
						id={`image-upload-${itemId}`}
						name="image"
						className="hidden"
						multiple
						onChange={(e) => handleImageUpload(itemId, e)}
					/>
				</label>
			</div>
			{validationError && (
				<div className="text-red-500 mt-2">{validationError}</div>
			)}
		</>
	);
};

export default ReviewImagesUpload;
