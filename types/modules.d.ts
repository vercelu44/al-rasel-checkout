/** Packages that do not ship their own TypeScript types. */

declare module "drift-zoom" {
	interface DriftOptions {
		paneContainer?: HTMLElement | null;
		inlineContainer?: HTMLElement | null;
		[option: string]: unknown;
	}
	export default class Drift {
		constructor(trigger: HTMLElement, options?: DriftOptions);
		destroy(): void;
	}
}

declare module "sslcommerz-lts" {
	export default class SSLCommerzPayment {
		constructor(storeId: string, storePassword: string, isLive: boolean);
		init(data: Record<string, unknown>): Promise<{ GatewayPageURL?: string; [key: string]: unknown }>;
		validate(data: { val_id: string }): Promise<Record<string, unknown>>;
	}
}
