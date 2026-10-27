import { getFilteredByKeyValue } from "@/utils/filter-items";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AddToCartPayload, AppliedCoupon, CartItem, Product, SiteSettings } from "@/types";
import { toast } from "react-toastify";

// Helper function to load cart items from local storage.
// Called only in the browser after hydration (see ReduxProvider), so the
// server HTML and the first client render match (cart starts empty on both).
export const loadCartItemsFromLocalStorage = (): CartItem[] | null => {
	if (typeof window !== "undefined") {
		try {
			const cartItems = localStorage.getItem("cart_items");
			if (cartItems) {
				return JSON.parse(cartItems);
			}
		} catch (error) {
			console.error("Error loading cart items from local storage:", error);
		}
	}
	return null; // Return null if no cart items found or error occurred
};

export interface CartState {
	isCartOpen: boolean;
	/** Product waiting for a variant to be chosen (variant drawer). */
	selectedProduct: Product | null;
	/** Cart item whose size is being changed. */
	sizeChangeProduct: CartItem | null;
	cart: CartItem[];
	isCartHydrated: boolean;
	discountCoupon: AppliedCoupon | null;
}

const initialState: CartState = {
	isCartOpen: false,
	selectedProduct: null,
	sizeChangeProduct: null,
	cart: [], // Filled from local storage after hydration via `hydrateCart`
	isCartHydrated: false, // true once local storage has been read
	discountCoupon: null,
};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		// Load saved cart items once, right after the app mounts in the browser
		hydrateCart: (state, action: PayloadAction<CartItem[] | null>) => {
			if (state.isCartHydrated) return;
			const savedItems = Array.isArray(action.payload) ? action.payload : [];
			// keep anything added before hydration finished (normally nothing)
			const addedBeforeHydration = state.cart.filter(
				(item) => !savedItems.some((saved) => saved.barcodeId === item.barcodeId)
			);
			state.cart = [...savedItems, ...addedBeforeHydration];
			state.isCartHydrated = true;
		},
		toggleCart: (state) => {
			state.isCartOpen = !state.isCartOpen;
		},
		addToSelected: (state, action: PayloadAction<Product>) => {
			state.selectedProduct = action.payload;
		},
		removeFromSelected: (state) => {
			state.selectedProduct = null;
		},
		addToSizeChange: (state, action: PayloadAction<CartItem>) => {
			state.sizeChangeProduct = action.payload;
		},
		removeFromSizeChange: (state) => {
			state.sizeChangeProduct = null;
		},

		//Adding new item to the cart
		addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
			const { product, selectedBarCode, settings } = action.payload;
			const index = state.cart
				.map((item) => item.barcodeId)
				.indexOf(selectedBarCode.id);

			if (index === -1) {
				const newCartItem = { ...product } as CartItem; //creating new item for each variant
				newCartItem.barcodeId = selectedBarCode.id;
				newCartItem.selectedBarCode = selectedBarCode;
				//filtering available sizes for selected color
				newCartItem.availableSizes = getFilteredByKeyValue(
					product.barcodes,
					"color",
					selectedBarCode.color
				);
				newCartItem.quantity = 1;
				state.cart.push(newCartItem);
				toast.success("Product added");
			} else {
				const existingProduct = state.cart[index];

				//checking available stock
				if (
					existingProduct.quantity >=
					existingProduct?.selectedBarCode?.stock_qty && settings?.allow_stock_out_product_add_to_cart === 0
				) {
					const { color, size } = existingProduct.selectedBarCode;
					let message =
						color || size
							? `No more stock for ${color} ${size}`
							: "No more stock";
					toast.error(message);
					return;
				}

				//Incrementing quantity for existing items
				existingProduct.quantity++;
				state.cart.splice(index, 1, existingProduct);
				toast.success("Product added");
			}
		},

		// Increasing Item Quantity
		addQuantity: (
			state,
			action: PayloadAction<{ barcodeId: number; settings: SiteSettings | null }>
		) => {
			const { barcodeId, settings } = action.payload;
			const index = state.cart.map((item) => item.barcodeId).indexOf(barcodeId);
			const item = state.cart[index];

			//checking available stock
			if (item.quantity >= item?.selectedBarCode?.stock_qty && settings?.allow_stock_out_product_add_to_cart === 0) {
				toast.error("No more stock");
				return;
			}

			//Updating item
			item.quantity++;
			state.cart.splice(index, 1, item);
		},

		// Decreasing Item Quantity
		removeQuantity: (state, action: PayloadAction<number>) => {
			const barcodeId = action.payload;
			const index = state.cart.map((item) => item.barcodeId).indexOf(barcodeId);

			//Updating item
			const item = state.cart[index];
			if (item.quantity > 1) {
				item.quantity--;
				state.cart.splice(index, 1, item);
			} else {
				state.cart.splice(index, 1);
			}
		},

		//Removing item from cart
		removeFromCart: (state, action: PayloadAction<number>) => {
			const barcodeId = action.payload;
			const index = state.cart.map((item) => item.barcodeId).indexOf(barcodeId);
			state.cart.splice(index, 1);
		},

		// Clear all items from cart
		clearCart: (state) => {
			state.cart = [];
		},

		// Add coupon discount
		addDiscountInfo: (state, action: PayloadAction<AppliedCoupon | null>) => {
			const discount = action.payload;
			state.discountCoupon = discount;
		},

		// Clear coupon discount
		clearDiscountInfo: (state, action: PayloadAction<AppliedCoupon | null | undefined>) => {
			const discount = action.payload;
			state.discountCoupon = discount;
		},
	},
});

export const {
	hydrateCart,
	toggleCart,
	addToSelected,
	removeFromSelected,
	addToSizeChange,
	removeFromSizeChange,
	addToCart,
	addQuantity,
	removeQuantity,
	removeFromCart,
	clearCart,
	addDiscountInfo,
	clearDiscountInfo,
} = cartSlice.actions;

export default cartSlice.reducer;
