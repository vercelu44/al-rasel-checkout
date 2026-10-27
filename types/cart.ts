import type { Coupon, Product, ProductVariant } from "./product";
import type { SiteSettings } from "./settings";

/**
 * A product in the cart. It is the product itself plus the chosen variant,
 * so every product field (name, image, brand…) is still available.
 */
export interface CartItem extends Product {
	/** Id of the chosen variant – unique per cart line. */
	barcodeId: number;
	selectedBarCode: ProductVariant;
	/** Variants of the same colour (used to change the size from the cart). */
	availableSizes: ProductVariant[];
	quantity: number;
}

/** Payload for the `addToCart` action. */
export interface AddToCartPayload {
	product: Product | CartItem;
	selectedBarCode: ProductVariant;
	settings: SiteSettings | null;
}

/** The coupon currently applied at checkout. */
export type AppliedCoupon = Coupon;
