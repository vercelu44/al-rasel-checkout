/**
 * The function `getGTMFormattedCartItems` takes an array of items and returns a new array with
 * specific properties formatted for Google Tag Manager.
 * @param [items] - An array of items representing products in a shopping cart. Each item object should
 * have the following properties:
 */
export const getGTMFormattedCartItems = (items = []) =>
  items.map((item) => ({
    item_id: item.id,
    item_barcode: item.barcodeId,
    item_name: item.product_name,
    image: item.image,
    item_brand: item?.brand?.brand_name || "no-brand",
    item_category: item?.category?.category_name,
    item_category2: item?.sub_category?.category_name,
    item_category3: item?.child_category?.category_name,
    price: item.new_price,
    quantity: item.quantity,
  }));

/**
 * The function `getGTMFormattedSaleProducts` takes an array of items and returns a formatted array
 * with specific properties extracted from each item.
 * @param [items] - The `getGTMFormattedSaleProducts` function takes an array of items as input and
 * returns a formatted array of sale products. Each item in the input array is expected to have the
 * following properties:
 * @returns The function `getGTMFormattedSaleProducts` returns an array of formatted sale product
 * objects based on the input `items` array. Each formatted product object includes properties such as
 * `item_id`, `item_barcode`, `item_name`, `image`, `item_brand`, `item_category`, `price`, and
 * `quantity`. If the `items` input is not an array, an empty array
 */
export const getGTMFormattedSaleProducts = (items = []) => {
  let formattedItems = [];
  if (!Array.isArray(items)) return formattedItems;
  formattedItems = items.map((item) => {
    return {
      item_id: item.product?.id,
      item_barcode: item.barcode?.barcode,
      item_name: item.product?.product_name,
      image: item.product?.image,
      item_brand: item.product?.brand?.brand_name || "no-brand",
      item_category: item.product?.category?.category_name || "",
      price: item.price,
      quantity: item.qty,
    };
  });
  return formattedItems;
};
