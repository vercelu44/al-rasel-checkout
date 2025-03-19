import { Cookies } from "@/utils/cookies";

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export const pageView = (eventOptions = {}) => {
  // window.fbq("track", "PageView");
  window.fbq("track", "PageView", {
    fbp: Cookies.get("_fbp"), // Get Facebook Pixel cookie, // no need to pass coz meta gets it automatically, it's only for client satisfaction
    fbc: Cookies.get("_fbc"), // Get Facebook Click ID cookie // no need to pass coz meta gets it automatically, it's only for client satisfaction
    first_party_collection: true, // no need to pass coz meta gets it automatically, it's only for client satisfaction
  }, eventOptions); // Pass the event ID
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name, options = {}, eventOptions = {}) => {
  try {
    // fbq('track', 'Purchase', {value: 12, currency: 'USD'}, {eventID: 'EVENT_ID'});
    window.fbq("track", name, {
      fbp: Cookies.get("_fbp"), // Get Facebook Pixel cookie, // no need to pass coz meta gets it automatically, it's only for client satisfaction
      fbc: Cookies.get("_fbc"), // Get Facebook Click ID cookie // no need to pass coz meta gets it automatically, it's only for client satisfaction
      first_party_collection: true,  // no need to pass coz meta gets it automatically, it's only for client satisfaction
      ...options,
    }, eventOptions);
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
 * The function `contentItems` maps an array of items to a new array with specific properties renamed.
 * @param [items] - The `items` parameter is an array of objects containing information about different
 * products. Each object in the array should have the following properties:
 */
export const contentItems = (items = []) =>
  items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    item_price: item.new_price,
    name: item.product_name,
    content_image_url: item.image,
  }));

/**
 * The function `getInitiateCheckoutPixelData` generates data for a Facebook Pixel event related to
 * initiating a checkout with items and total order value.
 * @param [items] - The `items` parameter is an array containing information about the products in the
 * user's cart. Each item in the array should have an `id` property that uniquely identifies the
 * product.
 * @param total - The `total` parameter represents the total order value in BDT (Bangladeshi Taka).
 * @returns An object is being returned with the following properties:
 * - `value`: Total order value in BDT
 * - `currency`: Currency set to "BDT"
 * - `content_ids`: An array of IDs extracted from the `items` array
 * - `content_type`: Set to "product"
 * - `contents`: A function `contentItems` is called with the `items` array as an argument
 */
export const getInitiateCheckoutPixelData = (items = [], total) => {
  return {
    value: total, // Total order value in BDT
    currency: "BDT",
    content_ids: items.map((item) => item.id),
    content_type: "product",
    contents: contentItems(items),
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
