export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export const pageview = () => {
	window.fbq("track", "PageView");
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name, options = {}, eventOptions = {}) => {
	try {
		// fbq('track', 'Purchase', {value: 12, currency: 'USD'}, {eventID: 'EVENT_ID'});
		window.fbq("track", name, options, eventOptions);
	} catch (error) {}
};

export const getProductPixelData = (product = {}) => {
	// console.log(product);
	return {
		value: product?.new_price, // Individual product price in BDT
		currency: "BDT",
		content_ids: [product.id], // 'REQUIRED': array of product IDs,
		content_type: "product", // RECOMMENDED: Either product or product_group based on the content_ids or contents being passed.
		content_name: product?.product_name,
		content_image_url: product?.image,
	};
};

/**
 * The function `getInitiateCheckoutPixelData` generates pixel data for purchase items including item
 * details and total order value.
 * @param [items] - The `items` parameter is an array containing objects with the following properties
 * for each item:
 * @param total - The `total` parameter represents the total order value in BDT (Bangladeshi Taka).
 * @returns The function `getInitiateCheckoutPixelData` returns an object with the following properties:
 * - `value`: Total order value in BDT
 * - `currency`: Currency set to "BDT"
 * - `content_ids`: An array of barcode values for each item in the purchase
 * - `contents`: An array of objects containing details of each item purchased, including id, quantity,
 * item_price, name
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
		content_type: "product",
		contents: itemContents,
		num_items: items.length,
	};
};

export const getPurchasedItemsPixelData = (contents = [], total) => {
	return {
		value: total, // Total order value in BDT
		currency: "BDT",
		content_ids: contents.map((item) => item.id),
		content_type: "product",
		contents,
		num_items: contents.length,
	};
};
