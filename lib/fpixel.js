import { Cookies } from "@/utils/cookies";

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export const pageview = (eventOptions = {}) => {
  // window.fbq("track", "PageView");
  window.fbq(
    "track",
    "PageView",
    {
      fbp: Cookies.get("_fbp"), // Get Facebook Pixel cookie, // no need to pass coz meta gets it automatically, it's only for client satisfaction
      fbc: Cookies.get("_fbc"), // Get Facebook Click ID cookie // no need to pass coz meta gets it automatically, it's only for client satisfaction
      first_party_collection: true, // no need to pass coz meta gets it automatically, it's only for client satisfaction
    },
    eventOptions
  ); // Pass the event ID
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name, options = {}, eventOptions = {}) => {
  try {
    window.fbq(
      "track",
      name,
      {
        fbp: Cookies.get("_fbp"), // Get Facebook Pixel cookie, // no need to pass coz meta gets it automatically, it's only for client satisfaction
        fbc: Cookies.get("_fbc"), // Get Facebook Click ID cookie // no need to pass coz meta gets it automatically, it's only for client satisfaction
        first_party_collection: true, // no need to pass coz meta gets it automatically, it's only for client satisfaction
        ...options,
      },
      eventOptions
    );
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

  return {
    value: product?.new_price, // Individual product price in BDT
    currency: "BDT",
    content_ids: [product.id], // An array of product IDs, e.g. ["product.id],
    content_type: "product",
    content_name: product?.product_name,
    content_image_url: product?.image,
    content_category: product?.child_category?.category_name ||
        product?.sub_category?.category_name ||
        product?.category?.category_name ||
        "No Category",
    num_items: 1,
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
    content_category: item.child_category?.category_name ||
        item.sub_category?.category_name ||
        item.category?.category_name ||
        "No Category",
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
  // console.log(items[0], "items[0] in getInitiateCheckoutPixelData");
  return {
    value: total, // Total order value in BDT
    currency: "BDT",
    content_ids: items.map((item) => item.id),
    content_type: "product",
    contents: contentItems(items),
    num_items: items.length,
  };
};

/**
 * The function `getPixelFormattedSaleProducts` takes an array of items and returns a formatted array
 * with specific properties extracted from each item.
 * @param items - An array of objects representing sale products. Each object contains the following
 * properties:
 * @returns The function `getPixelFormattedSaleProducts` returns an array of objects with properties
 * `id`, `quantity`, `item_price`, `name`, and `content_image_url` for each item in the input array.
 */
export const getPixelFormattedSaleProducts = (items) => {
  let formattedItems = [];
  if (!Array.isArray(items)) return formattedItems;
  formattedItems = items.map((item) => {
    return {
      id: item.product?.id,
      quantity: item.qty,
      item_price: item.price,
      name: item.product?.product_name,
      content_image_url: item.product?.image,
    };
  });
  return formattedItems;
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
export const getPurchasedItemsPixelData = (saleProducts = [], total) => {
  const contents = getPixelFormattedSaleProducts(saleProducts);
  return {
    value: total, // Total order value in BDT
    currency: "BDT",
    content_ids: contents.map((item) => item.id),
    content_type: "product",
    contents,
    num_items: contents.length,
  };
};
