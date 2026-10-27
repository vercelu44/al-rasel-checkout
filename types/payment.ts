import type { BinaryFlag, ID } from "./common";

/** Payment method from `info/payment-method` (COD, bKash, SSLCommerz…). */
export interface PaymentMethod {
	id?: ID;
	/** e.g. "COD", "bkash", "sslcommerz" */
	key?: string;
	/** Used to choose the payment gateway, e.g. "Bkash Payment", "SSL Payment". */
	title?: string;
	image?: string;
	/** Logo shown in the payment method list */
	icon?: string;
	status?: BinaryFlag;
}

/** The backend returns payment methods as an object keyed by method key. */
export type PaymentMethodMap = Record<string, PaymentMethod>;

/** Response of our payment API routes (bKash / SSLCommerz). */
export interface PaymentGatewayResponse {
	GatewayPageURL?: string;
	message?: string;
	status?: boolean | string;
}
