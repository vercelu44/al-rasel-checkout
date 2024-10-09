import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  addToSelected,
  removeFromCart,
  removeFromSelected,
} from "@/store/slices/cartSlice";
import { useRouter } from "@/navigation";
import * as pixel from "/lib/fpixel";
import { useAddToTrackingMutation } from "@/store/api/serverSideTrackingAPI";
import { generateUniqueId } from "@/utils/get-unique";

/**
 * The `useCart` function is a custom hook in JavaScript that provides methods for adding products to
 * the cart and handling the checkout process.
 * @returns The useCart function returns an object with two properties: handleAddToCart and
 * handleAddAndCheckout.
 */
const useCart = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [AddToConversionAPI] = useAddToTrackingMutation();
  const { selectedProduct } = useSelector((state) => state.cart);
  const { settings } = useSelector((state) => state.common);

  const handleMetaPixelAddToCart = (product) => {
    const eventID = generateUniqueId();

    // //Pixel Add to cart event
    pixel.event("AddToCart", pixel.getProductPixelData(product), {
      eventID: eventID,
    });
    //For conversion API
    if (settings?.fb_pixel_id && settings?.fb_access_token) {
      AddToConversionAPI({
        event_id: eventID,
        event_name: "AddToCart",
        product_ids: [product.id],
      });
    }
  };

  /**
   * The function `handleAddToCart` adds a product to the cart, taking into account the selected variant
   * and checking for stock availability.
   * @param product - The product object contains information about the product, such as its name, price,
   * and barcodes.
   * @param selectedVariant - The selectedVariant parameter is an object that represents the specific
   * variant of a product that the user has selected. It contains information such as the size, color,
   * and stock quantity of the variant.
   * @returns The function `handleAddToCart` returns a boolean value. It returns `true` if the product is
   * successfully added to the cart, and `false` otherwise.
   */
  const handleAddToCart = (product, selectedVariant) => {
    // if (product.barcodes?.length === 1 && !selectedVariant) {

    if (
      product.barcodes?.length === 1 &&
      product.barcodes[0].size === "" &&
      product.barcodes[0].color === ""
    ) {
      if (product.barcodes[0]?.stock_qty <= 0) {
        toast.error("Oops! no stock available");
        return false;
      }

      handleMetaPixelAddToCart(product); //Pixel Add to cart event

      dispatch(
        addToCart({
          product: product,
          selectedBarCode: product.barcodes[0],
        })
      );
      return true;
    }
    if (!selectedVariant) {
      dispatch(addToSelected(product));
      selectedProduct && toast.error("You must select one variant at least");
      return false;
    }

    handleMetaPixelAddToCart(product); //Pixel Add to cart event

    dispatch(
      addToCart({
        product: product,
        selectedBarCode: selectedVariant,
      })
    );

    return true;
  };

  /**
   * The function `handleAddAndCheckout` adds a product to the cart, closes the drawer if specified, and
   * navigates to the checkout page.
   * @param product - The product object that you want to add to the cart and checkout.
   * @param selectedVariant - The selectedVariant parameter is the variant of the product that the user
   * has chosen to add to the cart. It could be an object containing information about the variant, such
   * as its ID, price, and other attributes.
   * @param isDrawerClose - A boolean value indicating whether the drawer should be closed after adding
   * the product to the cart.
   */
  const handleAddAndCheckout = (product, selectedVariant, isDrawerClose) => {
    const isSuccess = handleAddToCart(product, selectedVariant);
    if (isSuccess) {
      isDrawerClose && dispatch(removeFromSelected());
      router.push("/checkout");
    }
  };

  const handleSizeChange = (cartItem, selectedVariant) => {
    dispatch(removeFromCart(cartItem.barcodeId));
    dispatch(
      addToCart({
        product: cartItem,
        selectedBarCode: selectedVariant,
      })
    );
  };

  return {
    handleAddToCart,
    handleAddAndCheckout,
    handleSizeChange,
  };
};

export default useCart;
