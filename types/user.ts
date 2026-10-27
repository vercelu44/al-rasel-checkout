import type { ID } from "./common";

/** Logged-in customer profile from `GET user`. */
export interface User {
	id?: ID;
	name?: string;
	email?: string;
	phone?: string;
	alt_phone_no?: string;
	image?: string;
	gender?: string;
	birth_date?: string;
	address?: string;
	city?: string;
	country?: string;
}

/** Form values of the profile edit form. */
export interface ProfileFormValues {
	name: string;
	email: string;
	gender: string;
	birth_date: string;
	alt_phone_no?: string;
	address: string;
	city: string;
	phone?: string;
	country?: string;
	profileImageFile?: File | null;
}
