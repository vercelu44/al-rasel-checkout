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
	return null;
};

// Helper function to calculate price break discount
const calculatePriceBreakDiscount = (priceBreakDiscounts, quantity) => {
	if (!priceBreakDiscounts || priceBreakDiscounts.length === 0) {
		return 0;
	}

	// Sort by min_qty in descending order to check from highest quantity first
	const sortedDiscounts = [...priceBreakDiscounts].sort((a, b) => 
		parseFloat(b.min_qty) - parseFloat(a.min_qty)
	);

	// Find the applicable discount
	for (const discount of sortedDiscounts) {
		const minQty = parseFloat(discount.min_qty);
		const maxQty = discount.max_qty ? parseFloat(discount.max_qty) : Infinity;
		
		if (quantity >= minQty && quantity <= maxQty) {
			return {
				discountValue: parseFloat(discount.discount_value),
				discountType: discount.discount_type // 'fixed' or 'percentage'
			};
		}
	}
	
	return 0;
};

// Helper function to calculate final price with discount
const calculateFinalPrice = (product, quantity) => {
	// Use selling_price or old_price as base
	const basePrice = product.basePrice // useful to skip multiple discounts, price break discounts should be calculated on base price
	
	// Check for price break discounts
	const priceBreakDiscount = calculatePriceBreakDiscount(
		product.price_break_discounts, 
		quantity
	);
	console.log(product.selectedBarCode)

	
	let finalPrice =  parseFloat(product.selectedBarCode.discount_selling_price) || 0; // Default to selling price if no break discount applies
	
	if (priceBreakDiscount) {
		if (priceBreakDiscount.discountType === 'fixed') {
			finalPrice = basePrice - priceBreakDiscount.discountValue;
		} else if (priceBreakDiscount.discountType === 'percentage') {
			finalPrice = basePrice * (1 - priceBreakDiscount.discountValue / 100);
		}
	}
	
	// Ensure price doesn't go below 0
	return Math.max(0, finalPrice);
};

const initialState = {
	isCartOpen: false,
	selectedProduct: null,
	sizeChangeProduct: null,
	cart: loadCartItemsFromLocalStorage() || [],
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

		addToCart: (state, action) => {
			const { product, selectedBarCode, settings } = action.payload;
			const index = state.cart
				.map((item) => item.barcodeId)
				.indexOf(selectedBarCode.id);

			if (index === -1) {
				const newCartItem = { ...product };
				newCartItem.barcodeId = selectedBarCode.id;
				newCartItem.selectedBarCode = selectedBarCode;
				newCartItem.availableSizes = getFilteredByKeyValue(
					product.barcodes,
					"color",
					selectedBarCode.color
				);
				newCartItem.quantity = 1;
				
				// Calculate initial price with discount
				newCartItem.basePrice = parseFloat(selectedBarCode.selling_price) || 0;
				const finalPrice = calculateFinalPrice(newCartItem, newCartItem.quantity);
				newCartItem.finalPrice = finalPrice;
				// console.log(finalPrice)
				
				state.cart.push(newCartItem);
				toast.success("Product added");
			} else {
				const existingProduct = state.cart[index];

				if (
					existingProduct.quantity >=
					existingProduct?.selectedBarCode?.stock_qty && 
					settings?.allow_stock_out_product_add_to_cart === 0
				) {
					const { color, size } = existingProduct.selectedBarCode;
					let message = color || size
						? `No more stock for ${color} ${size}`
						: "No more stock";
					toast.error(message);
					return;
				}

				// Increment quantity
				existingProduct.quantity++;
				
				// Recalculate price based on new quantity
				const newFinalPrice = calculateFinalPrice(existingProduct, existingProduct.quantity);
				existingProduct.finalPrice = newFinalPrice;
				
				state.cart.splice(index, 1, existingProduct);
				toast.success("Product added");
			}
		},

		addQuantity: (state, action) => {
			const { barcodeId, settings } = action.payload;
			const index = state.cart.map((item) => item.barcodeId).indexOf(barcodeId);
			const item = state.cart[index];

			if (item.quantity >= item?.selectedBarCode?.stock_qty && 
				settings?.allow_stock_out_product_add_to_cart === 0) {
				toast.error("No more stock");
				return;
			}

			// Increase quantity
			item.quantity++;
			
			// Recalculate price with new quantity
			const newFinalPrice = calculateFinalPrice(item, item.quantity);
			item.finalPrice = newFinalPrice;
			// item.appliedDiscount = item.basePrice - newFinalPrice;

			state.cart.splice(index, 1, item);
		},

		removeQuantity: (state, action) => {
			const barcodeId = action.payload;
			const index = state.cart.map((item) => item.barcodeId).indexOf(barcodeId);
			const item = state.cart[index];

			if (item.quantity > 1) {
				item.quantity--;
				
				// Recalculate price with new quantity
				const newFinalPrice = calculateFinalPrice(item, item.quantity);
				item.finalPrice = newFinalPrice;

				state.cart.splice(index, 1, item);
			} else {
				state.cart.splice(index, 1);
			}
		},

		removeFromCart: (state, action) => {
			const barcodeId = action.payload;
			const index = state.cart.map((item) => item.barcodeId).indexOf(barcodeId);
			state.cart.splice(index, 1);
		},

		clearCart: (state) => {
			state.cart = [];
		},

		addDiscountInfo: (state, action) => {
			state.discountCoupon = action.payload;
		},

		clearDiscountInfo: (state) => {
			state.discountCoupon = null;
		},
		
		// New action to manually recalculate all cart item prices (useful for coupon application)
		recalculateCartPrices: (state) => {
			state.cart.forEach(item => {
				const newFinalPrice = calculateFinalPrice(item, item.quantity);
				item.finalPrice = newFinalPrice;
			});
		}
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
	recalculateCartPrices,
} = cartSlice.actions;

export default cartSlice.reducer;