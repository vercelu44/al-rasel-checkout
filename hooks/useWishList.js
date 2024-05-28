import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import * as pixel from "/lib/fpixel";
import {
	useAddToWishListMutation,
	useGetWishListQuery,
	useRemoveFromWishListMutation,
} from "@/store/api/wishListAPI";
import { setLoginModalOpen } from "@/store/slices/authSlice";

/**
 * The `useWishList` function is a custom hook that provides methods for adding and removing products
 * from a user's wishlist.
 * @returns The `useWishList` function returns an object with two properties: `handleAddToWishlist` and
 * `handleRemoveFromWishlist`.
 */
const useWishList = () => {
	const { locale } = useParams();
	const dispatch = useDispatch();
	const { data, isLoading } = useGetWishListQuery({ locale });
	const { user } = useSelector((state) => state.auth);
	const [addToWishlist] = useAddToWishListMutation();
	const [deleteFromWishlist] = useRemoveFromWishListMutation();

	const wishedProducts = data?.data || [];

	/**
	 * The function `handleAddToWishlist` adds a product to the user's wishlist and displays a success or
	 * error message using the `toast` library.
	 * @param product - The product parameter is the product that the user
	 * wants to add to their wishlist.
	 * @returns nothing (undefined).
	 */
	const handleAddToWishlist = async (product) => {
		if (!user) {
			// toast.error("You're not logged in");
			dispatch(setLoginModalOpen(true));
			return;
		}
		try {
			await addToWishlist({ product_id: product?.id });
			//Pixel Add to wishlist event
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
	const handleRemoveFromWishlist = async (productId) => {
		try {
			await deleteFromWishlist(productId);
			toast.success("Product removed successfully!");
		} catch (error) {
			toast.error("Failed to delete from wishlist");
		}
	};

	/**
	 * The function checks if a product with a given ID exists in the user's wishlist.
	 * @param productId - The productId parameter is the unique identifier of a product in the wish list.
	 * @returns a boolean value.
	 */
	const handleWishListProductStatus = (productId) => {
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
