/**
 * The function `getFirstVariantOfColor` returns the first barcode object with a specified color name
 * from an array of barcodes.
 * @param colorName - Color name is a string representing the color of the variant you are looking for.
 * @param barcodes - An array of objects, where each object represents a product variant and contains
 * information such as color, size, and barcode.
 * @returns The function `getFirstVariantOfColor` returns the first barcode object that matches the
 * given colorName from the provided array of barcodes. If no matching barcode is found, it returns
 * `null`.
 */
import type { ProductVariant } from "@/types";

export const getFirstVariantOfColor = (
	colorName: string | null | undefined,
	barcodes: ProductVariant[] | undefined
): ProductVariant | null => {
	if (!colorName || !Array.isArray(barcodes)) return null;
	return barcodes.find((barcode) => barcode.color === colorName) || null;
};
