import type * as React from "react";
import Image from "next/image";
import { useState } from "react";
import { BsCameraFill } from "react-icons/bs";
import profileAvatar from "@/public/assets/images/profile_avatar.png";

import type { User } from "@/types";

interface ProfileImageUploadProps {
  profileImageFile: File | null;
  setProfileImageFile: (file: File | null) => void;
  editMode: boolean;
  user: User | null;
}

const ProfileImageUpload = ({
  profileImageFile,
  setProfileImageFile,
  editMode,
  user,
}: ProfileImageUploadProps) => {
  const [validationError, setValidationError] = useState("");

  const validateImage = (file: File) => {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedExtensions.test(file.name)) {
      return "Only JPG, JPEG, and PNG files are allowed.";
    }
    if (file.size > maxSize) {
      return "File size exceeds the maximum limit of 5MB.";
    }

    return "";
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    const validationError = validateImage(file);
    if (validationError) {
      setValidationError(validationError);
      return;
    }
    setProfileImageFile(file);
    if (file) setValidationError("");
  };

  return (
    <div className="mb-14">
      <div className="w-[6.5rem] h-[6.5rem] relative rounded-full bg-gray-200">
        <Image
          src={
            profileImageFile
              ? URL.createObjectURL(profileImageFile)
              : user?.image || profileAvatar
          }
          alt="Profile"
          // avatar may come from Google/Facebook login, which isn't an allowed image host
          unoptimized
          height={128}
          width={128}
          className="w-full h-full rounded-full"
        />
        {editMode && (
          <label
            htmlFor="image-upload"
            className="absolute bottom-0 right-0 w-9 h-9 bg-primary rounded-full flex items-center justify-center cursor-pointer border-2 border-white"
          >
            <BsCameraFill className="text-white" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              id="image-upload"
              className="hidden"
            />
          </label>
        )}
        <h3 className="text-center m-3 text-sm text-slate-500">Profile</h3>
      </div>
      {validationError && editMode && (
        <div className="text-red-500 mt-12">{validationError}</div>
      )}
    </div>
  );
};

export default ProfileImageUpload;
