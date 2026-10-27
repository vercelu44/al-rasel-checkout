/**
 * The function calculates the percentage of sale quantity out of the total quantity.
 * @param saleQty - The saleQty parameter represents the quantity of items that have been sold.
 * @param stockQty - The stockQty parameter represents the quantity of items in stock.
 * @returns the sale percentage as a rounded integer.
 */
export const getSalePercent = (saleQty: number | undefined, stockQty: number | undefined): number => {
	let salePercent = 0;
	if (saleQty === 0 && stockQty === 0) return 0;
	if (typeof saleQty === "number" && typeof stockQty === "number") {
		const totalQty = stockQty + saleQty;
		salePercent = (saleQty / totalQty) * 100;
	}
	return Math.round(salePercent);
};

/**
 * The function calculates the discount percentage between an old price and a new price.
 * @param oldPrice - The original price of the item before any discount is applied.
 * @param newPrice - The new price of the item.
 * @returns the discount percentage as a rounded integer value.
 */
export const getDiscountPercent = (oldPrice: number | undefined, newPrice: number | undefined): number => {
	let discountPercent = 0;

	if (
		typeof oldPrice === "number" &&
		typeof newPrice === "number" &&
		oldPrice > newPrice
	) {
		discountPercent = ((oldPrice - newPrice) / oldPrice) * 100;
		discountPercent = Math.max(0, Math.min(discountPercent, 100));
	}

	return Math.round(discountPercent);
};
