import type { DateString, ID } from "./common";

/** Customer review of a product. */
export interface ProductReview {
	id?: ID;
	rating?: number;
	comment?: string;
	image?: string;
	images?: string[];
	created_at?: DateString;
	likes_count?: number;
	dislikes_count?: number;
	is_liked?: boolean;
	is_disliked?: boolean;
	customer?: { name?: string; image?: string };
	product_variant?: { color?: string; size?: string };
}

export type ReviewReactionType = "like" | "dislike";
