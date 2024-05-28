export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export const pageview = () => {
	window.fbq("track", "PageView");
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name, options = {}) => {
	try {
		window.fbq("track", name, options);
	} catch (error) {}
};

/**
 * The function `getProductPixelData` extracts relevant data from a product object to be used for
 * tracking purposes.
 * @param [product] - The `getProductPixelData` function takes a `product` object as an argument and
 * returns an object with specific properties extracted from the `product` object. The properties
 * extracted are:
 * @returns The function `getProductPixelData` returns an object with the following properties:
 * - `value`: The new price of the product in BDT
 * - `currency`: The currency set to "BDT"
 * - `content_ids`: An array containing the product ID
 * - `content_name`: The name of the product
 * - `content_image_url`: The URL of the product image
 */
export const getProductPixelData = (product = {}) => {
	// console.log(product);
	return {
		value: product?.new_price, // Individual product price in BDT
		currency: "BDT",
		content_ids: [product.id], // An array of product IDs, e.g. ["product.id],
		// content_type: "product",
		content_name: product?.product_name,
		content_image_url: product?.image,
	};
};

/**
 * The function `getInitiateCheckoutPixelData` generates pixel data for initiating a checkout with item
 * details and total order value.
 * @param [items] - The `items` parameter in the `getInitiateCheckoutPixelData` function is an array of
 * objects representing the items in the checkout. Each item object should have the following
 * properties:
 * @param total - The `total` parameter represents the total order value in BDT (Bangladeshi Taka).
 * @returns The function `getInitiateCheckoutPixelData` returns an object with the following
 * properties:
 * - `value`: Total order value in BDT
 * - `currency`: Currency set to "BDT"
 * - `content_ids`: An array of item IDs
 * - `contents`: An array of objects containing item details such as ID, quantity, item price, name,
 * and content image URL
 * - `
 */
export const getInitiateCheckoutPixelData = (items = [], total) => {
	const itemContents = items.map((item) => ({
		id: item.id,
		quantity: item.quantity,
		item_price: item.new_price,
		name: item.product_name,
		content_image_url: item.image,
	}));
	return {
		value: total, // Total order value in BDT
		currency: "BDT",
		content_ids: items.map((item) => item.id),
		// content_type: "product",
		contents: itemContents,
		num_items: items.length,
	};
};

/**
 * The function `getPurchasedItemsPixelData` generates pixel data for tracking purchased items in a
 * JavaScript environment.
 * @param [contents] - The `contents` parameter is an array that contains the items that have been
 * purchased. Each item in the array should have an `id` property that uniquely identifies the item.
 * @param total - Total order value in Bangladeshi Taka (BDT)
 * @returns An object is being returned with the following properties:
 * - `value`: Total order value in BDT
 * - `currency`: Currency set to "BDT"
 * - `content_ids`: An array of IDs extracted from the `contents` array
 * - `contents`: The original `contents` array
 * - `num_items`: The number of items in the `contents` array
 */
export const getPurchasedItemsPixelData = (contents = [], total) => {
	return {
		value: total, // Total order value in BDT
		currency: "BDT",
		content_ids: contents.map((item) => item.id),
		// content_type: "product",
		contents,
		num_items: contents.length,
	};
};
