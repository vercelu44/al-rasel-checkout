/**
 * The function `getPixelFormattedOrderItems` takes an array of items and returns a formatted array
 * with specific properties extracted from each item.
 * @param items - An array of order items, where each item is an object containing information about a
 * product in the order. Each item object has the following properties:
 * @returns The function `getPixelFormattedOrderItems` returns an array of formatted order items with
 * properties `id`, `quantity`, `item_price`, `name`, and `content_image_url` for each item in the
 * input array.
 */
export const getPixelFormattedOrderItems = (items) => {
	let formattedItems = [];
	if (!Array.isArray(items)) return formattedItems;
	formattedItems = items.map((item) => {
		return {
			id: item.product.id,
			quantity: item.qty,
			item_price: item.price,
			name: item.product.product_name,
			content_image_url: item.product.image,
		};
	});
	return formattedItems;
};
