/**
 * The function `getAppropriatePhoto` returns the appropriate image for a given product and color name.
 * @param product - The `product` parameter is an object that represents a product. It may have the
 * following properties:
 * @param colorName - The color name of the photo you want to retrieve.
 * @returns the appropriate photo for a given product and color name.
 */
export const getAppropriatePhoto = (product, colorName) => {
	if (!product) return;
	let image = product.image;
	if (!Array.isArray(product.photos)) return image;
	const colorPhoto = product.photos.find(
		(photo) => photo.color_name === colorName
	);
	if (colorPhoto) {
		image = colorPhoto.image;
	}
	return image;
};
