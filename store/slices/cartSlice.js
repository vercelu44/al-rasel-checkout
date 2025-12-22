import { getFilteredByKeyValue } from "@/utils/filter-items";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Helper function to load cart items from local storage
const loadCartItemsFromLocalStorage = () => {
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

const initialState = {
	isCartOpen: false,
	selectedProduct: null,
	sizeChangeProduct: null,
	cart: loadCartItemsFromLocalStorage() || [], // Initialize with local storage data or an empty array
	discountCoupon: null,
};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		toggleCart: (state) => {
			state.isCartOpen = !state.isCartOpen;
		},
		addToSelected: (state, action) => {
			state.selectedProduct = action.payload;
		},
		removeFromSelected: (state) => {
			state.selectedProduct = null;
		},
		addToSizeChange: (state, action) => {
			state.sizeChangeProduct = action.payload;
		},
		removeFromSizeChange: (state) => {
			state.sizeChangeProduct = null;
		},

		//Adding new item to the cart
		addToCart: (state, action) => {
			const { product, selectedBarCode, settings } = action.payload;
			const index = state.cart
				.map((item) => item.barcodeId)
				.indexOf(selectedBarCode.id);

			if (index === -1) {
				const newCartItem = { ...product }; //creating new item for each variant
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
		addQuantity: (state, action) => {
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
		removeQuantity: (state, action) => {
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
		removeFromCart: (state, action) => {
			const barcodeId = action.payload;
			const index = state.cart.map((item) => item.barcodeId).indexOf(barcodeId);
			state.cart.splice(index, 1);
		},

		// Clear all items from cart
		clearCart: (state) => {
			state.cart = [];
		},

		// Add coupon discount
		addDiscountInfo: (state, action) => {
			const discount = action.payload;
			state.discountCoupon = discount;
		},

		// Clear coupon discount
		clearDiscountInfo: (state, action) => {
			const discount = action.payload;
			state.discountCoupon = discount;
		},
	},
});

export const {
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
