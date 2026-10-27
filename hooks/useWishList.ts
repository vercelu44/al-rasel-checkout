import { toast } from "react-toastify";
import { useAppSelector } from "@/store/hooks";
import { useParams } from "next/navigation";
import * as pixel from "@/lib/fpixel";
import {
	useAddToWishListMutation,
	useGetWishListQuery,
	useRemoveFromWishListMutation,
} from "@/store/api/wishListAPI";
import type { ID, Product } from "@/types";

/**
 * The `useWishList` function is a custom hook that provides methods for adding and removing products
 * from a user's wishlist.
 * @returns The `useWishList` function returns an object with two properties: `handleAddToWishlist` and
 * `handleRemoveFromWishlist`.
 */
const useWishList = () => {
	const { locale } = useParams<{ locale: string }>();
	const { user } = useAppSelector((state) => state.auth);
	// The wishlist belongs to a logged-in user; don't request it for guests
	const { data } = useGetWishListQuery({ locale }, { skip: !user });
	const [addToWishlist] = useAddToWishListMutation();
	const [deleteFromWishlist] = useRemoveFromWishListMutation();

	const wishedProducts = data?.data || [];

	/**
	 * The function `handleAddToWishlist` adds a product to the user's wishlist and displays a success or
	 * error message using the `toast` library.
	 * @param productId - The productId parameter is the unique identifier of the product that the user
	 * wants to add to their wishlist.
	 * @returns nothing (undefined).
	 */
	const handleAddToWishlist = async (product: Product) => {
		if (!user) {
			toast.error("You're not logged in");
			return;
		}
		try {
			await addToWishlist({ product_id: product?.id });
			// //Pixel Add to wishlist event
			pixel.event("AddToWishlist", pixel.getProductPixelData(product));
			toast.success("Product added to Wishlist!");
		} catch (error) {
			toast.error("Failed to add to wishlist");
		}
	};

	/**
	 * The function `handleRemoveFromWishlist` removes a product from a wishlist and displays a success
	 * message if successful, or an error message if unsuccessful.
	 * @param productId - The ID of the product that needs to be removed from the wishlist.
	 */
	const handleRemoveFromWishlist = async (productId: ID) => {
		try {
			await deleteFromWishlist(productId);
			toast.success("Product removed from wishlist!");
		} catch (error) {
			toast.error("Failed to delete from wishlist");
		}
	};

	/**
	 * The function checks if a product with a given ID exists in the user's wishlist.
	 * @param productId - The productId parameter is the unique identifier of a product in the wish list.
	 * @returns a boolean value.
	 */
	const handleWishListProductStatus = (productId: ID) => {
		if (!user) return false;
		return !!wishedProducts.find((product) => product.id === productId);
	};

	/**
	 * The function `getWishlistCount` returns the number of products in the user's wishlist, or 0 if the
	 * user is not defined.
	 * @returns The number of products in the user's wishlist.
	 */
	const getWishlistCount = () => {
		if (!user) return 0;
		return wishedProducts.length;
	};

	return {
		handleAddToWishlist,
		handleRemoveFromWishlist,
		handleWishListProductStatus,
		getWishlistCount,
	};
};

export default useWishList;
