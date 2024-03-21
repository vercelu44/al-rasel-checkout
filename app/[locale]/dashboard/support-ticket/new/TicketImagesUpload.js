import Image from "next/image";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUniqueUpdatedFiles, validateImages } from "@/utils/file-upload";
import { BsCameraFill } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";

const TicketImagesUpload = ({ imageFiles, setImageFiles }) => {
  const { translations } = useSelector((state) => state.common);
  const [validationError, setValidationError] = useState("");

  const handleImageUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    const validationError = validateImages(newFiles);
    if (validationError) {
      setValidationError(validationError);
      return;
    }
    const uniqueUpdatedFiles = getUniqueUpdatedFiles(imageFiles, newFiles);
    setImageFiles(uniqueUpdatedFiles); // getting images files to pass it to backend
    if (newFiles.length) setValidationError("");
  };

  const handleRemoveImage = (findIndex) => {
    const updatedFiles = imageFiles.filter((_, index) => findIndex !== index);
    setImageFiles(updatedFiles);
  };

  return (
    <>
      <div
        className="p-4 img-uploader min-h-[72px] hidden md:flex items-center border-2 border-dashed border-slate-300 rounded-lg"
        onDrop={(e) => {
          e.preventDefault();
          handleImageUpload({ target: { files: e.dataTransfer.files } });
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="flex flex-wrap gap-4 items-center">
          <label htmlFor="image-upload">
            <span className="border border-slate-300 rounded-lg py-2 px-4 cursor-pointer">
              {translations["browse"] || "ব্রাউজ করুন"}
            </span>
            <input
              type="file"
              accept="image/*"
              id="image-upload"
              name="image"
              className="hidden"
              multiple
              onChange={handleImageUpload}
            />
          </label>
          <h3 className="text-slate-500">
            {translations["or,-drag-and-drop-files-here"] ||
              "অথবা, ফাইল টেনে এনে এখানে ছাড়ুন"}
          </h3>
        </div>
      </div>
      {validationError && (
        <div className="text-red-500 mt-2">{validationError}</div>
      )}

      <div className="flex gap-4 mt-3">
        {imageFiles.map((file, index) => (
          <div className="relative" key={index}>
            <Image
              src={URL.createObjectURL(file)}
              alt={`Image ${index}`}
              height={74}
              width={74}
              className="object-cover h-[74px] md:h-[68px] w-[74px] md:w-[68px] rounded-lg"
            />
            <button
              className="absolute right-1 lg:right-1 top-1 lg:top-1 bg-transparent text-red-500"
              onClick={() => handleRemoveImage(index)}
            >
              <RxCross2
                size={22}
                className="bg-red-500 border border-white font-semibold rounded-full p-1 text-white"
              />
            </button>
          </div>
        ))}
        <label
          htmlFor={`image-upload-mobile`}
          className="md:hidden w-[72px] lg:w-[88px] h-[72px] lg:h-[88px] py-2 px-1 text-center border-2 border-dashed border-slate-300 rounded-lg cursor-pointer text-slate-500"
        >
          <BsCameraFill size={24} />
          <p className="text-[10px]/[14px] lg:text-sm/[100%] mt-1 lg:mt-2">
            {translations["upload-image"] || "ছবি আপলোড করুন"}
          </p>
          <input
            type="file"
            accept="image/*"
            id={`image-upload-mobile`}
            name="image"
            className="hidden"
            multiple
            onChange={handleImageUpload}
          />
        </label>
      </div>
    </>
  );
};

export default TicketImagesUpload;
