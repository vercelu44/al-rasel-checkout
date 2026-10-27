/**
 * Orders ("sales") as returned by the backend.
 *
 * Most fields are optional because the backend may leave any of them out
 * (and pages fall back to `{}` when a request fails).
 */
import type { DateString, ID } from "./common";
import type { Product, ProductVariant } from "./product";

/** Order status values used by the order tracking UI. */
export type OrderStatus =
	| "Pending"
	| "Processing"
	| "On Hold"
	| "Shipped"
	| "Delivered"
	| "Completed"
	| "Cancelled"
	| (string & {}); // keep autocomplete but allow other backend values

/** Customer info stored on an order. */
export interface OrderCustomer {
	id?: ID;
	name?: string;
	email?: string;
	mobile?: string;
}

/** Delivery address and charge of an order. */
export interface OrderShipping {
	name?: string;
	phone?: string;
	address?: string;
	alt_address?: string;
	delivery_charge?: number;
}

/** An order ("sale") as returned by the backend. */
export interface Sale {
	id?: ID;
	invoice_no?: string;
	invoice_url?: string;
	status?: OrderStatus;
	payment_type?: "COD" | "Online" | (string & {});
	sale_date?: DateString;
	sub_total?: number;
	discount_amount?: number;
	total_amount?: number;
	paid_amount?: number;
	due_amount?: number;
	customer?: OrderCustomer;
	shipping?: OrderShipping;
}

/** One ordered product line inside an order. */
export interface SaleProduct {
	id?: ID;
	qty?: number;
	price?: number;
	product?: Product;
	barcode?: ProductVariant;
}

/** Response of `order/show/:id` and `order/show-by-invoice/:invoice`. */
export interface OrderDetails {
	/** Sent by some endpoints next to `sale` */
	id?: ID;
	sale: Sale;
	saleProducts: SaleProduct[];
}

/** Summary returned by our own `/api/order-summary-show/[order_id]` route. */
export interface OrderSummary
	extends Pick<
		Sale,
		| "id"
		| "invoice_no"
		| "status"
		| "sub_total"
		| "total_amount"
		| "due_amount"
		| "paid_amount"
		| "customer"
		| "sale_date"
		| "invoice_url"
	> {
	ordered_items?: SaleProduct[];
	shipping?: Pick<OrderShipping, "delivery_charge">;
	payment_type?: Sale["payment_type"];
}

/** The order fields needed to pay for an order later (payment modal). */
export interface PayableOrder {
	id?: ID;
	invoice_no?: string;
	total_amount?: number;
	due_amount?: number;
	shipping?: Pick<OrderShipping, "delivery_charge">;
}

/** One cart line as sent to the backend when placing an order. */
export interface OrderItemPayload {
	barcode_id: number;
	quantity: number;
	price: number;
}
