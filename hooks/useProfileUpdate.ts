import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { siteConfig } from "@/config/site";
import axiosInstance from "@/lib/axios-instance";
import { setUser } from "@/store/slices/authSlice";
import { useUpdateProfileMutation } from "@/store/api/authAPI";
import type { ApiResponse, ProfileFormValues, User } from "@/types";

const useProfileUpdate = () => {
	const dispatch = useAppDispatch();
	const [updateProfile] = useUpdateProfileMutation();
	const { user } = useAppSelector((state) => state.auth);

	const handleUserUpdate = async (data: ProfileFormValues): Promise<boolean> => {
		try {
			const formData = new FormData();
			formData.append("image", data?.profileImageFile || user?.image);
			formData.append("name", data.name);
			formData.append("birth_date", data.birth_date);
			formData.append("gender", data.gender);
			formData.append("email", data.email);
			formData.append("phone", user?.phone);
			formData.append("alt_phone_no", data?.alt_phone_no);
			formData.append("address", data.address);
			formData.append("city", data.city);
			formData.append("country", siteConfig.phone.country);

			await updateProfile(formData).unwrap(); //updating user profile
			// Handle the successful response if necessary
			const updatedUser = await axiosInstance.get<ApiResponse<User>>(`user`);
			dispatch(setUser(updatedUser.data.data));
			toast.success("Profile updated successfully!");
			return true;
		} catch (error) {
			// Handle the error if necessary
			toast.error("Failed to update profile");
			console.error(error);
			return false;
		}
	};

	return {
		handleUserUpdate,
	};
};

export default useProfileUpdate;

// Example usage:
// const updateUser = async (data) => {
//   const isSuccess = await handleUserUpdate(data, profileImageFile);
//   if (isSuccess) {
//     setEditMode(false);
//   }
// };
