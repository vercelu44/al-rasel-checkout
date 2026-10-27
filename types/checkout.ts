import type * as React from "react";
import type { OrderItemPayload } from "./order";
import type { PaymentMethod } from "./payment";

/** Delivery zones offered at checkout. */
export type DeliveryAreaKey = "inside dhaka" | "sub dhaka" | "outside dhaka";

export interface DeliveryArea {
	key: DeliveryAreaKey;
	title: string;
	charges: number | undefined;
	icon?: React.ReactNode;
}

/**
 * How the customer pays:
 * - `no_payment` → cash on delivery
 * - `delivery_charge_payment` → pay only the delivery charge online
 * - `total_payment` → pay everything online
 */
export type PaymentOptionKey = "no_payment" | "delivery_charge_payment" | "total_payment";

export interface PaymentOption {
	key: PaymentOptionKey;
	title: string;
	value: number;
}

/** Values of the shipping address form. */
export interface ShippingFormValues {
	name: string;
	phone: string;
	address: string;
	city: string;
	note?: string;
}

/** Simpler cash-on-delivery order sent from a product landing page. */
export interface LandingPageOrder {
	name: string;
	phone: string;
	address: string;
	order_items: OrderItemPayload[];
	payment_type: "COD";
	delivery_type: DeliveryAreaKey;
	delivery_charge: number;
	subtotal: number;
	grand_total: number;
}

/** Order data built on the checkout page before it is sent to the backend. */
export interface NewOrder {
	name: string;
	alt_name: string;
	phone: string;
	alt_phone: string;
	address: string;
	alt_address: string;
	order_items: OrderItemPayload[];
	payment_method?: PaymentMethod | null;
	/** Set right before submit: "COD" or "Online". */
	payment_type?: "COD" | "Online";
	delivery_type: string;
	delivery_charge: number;
	coupon: string | null;
	coupon_discount: number;
	subtotal: number;
	after_discount: number;
	grand_total: number;
	paymentOption?: PaymentOptionKey | null;
	note?: string;
	fbp?: string | null;
	fbc?: string | null;
	incomplete_unique_id?: string | null;
	/** Landing page checkout only. */
	product_id?: number;
}
