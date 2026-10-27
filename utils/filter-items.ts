/**
 * The function `getFilteredByKeyValue` filters an array of objects based on a specified key-value
 * pair.
 * @param items - The `items` parameter is an array of objects.
 * @param key - The key parameter is the property key that you want to filter the items by.
 * @param value - The value parameter is the value that you want to filter the items by.
 * @returns The function `getFilteredByKeyValue` returns an array of items that have a specific
 * key-value pair.
 */
export const getFilteredByKeyValue = <T, K extends keyof T>(
  items: T[],
  key: K,
  value: T[K]
): T[] => {
  if (Array.isArray(items) && items.length > 1) {
    return items.filter((item) => item[key] === value);
  }
  return items;
};

/**
 * The function `getFilteredByKeyNotValue` filters an array of objects based on a specific key-value
 * pair, excluding objects where the value matches the specified value.
 * @param items - The `items` parameter is an array of objects.
 * @param key - The key parameter is the property key that you want to filter the items by.
 * @param value - The `value` parameter is the value that you want to filter out from the `items` array
 * based on the `key` parameter.
 * @returns The function `getFilteredByKeyNotValue` returns an array of items that do not have the
 * specified value for the given key.
 */
export const getFilteredByKeyNotValue = <T, K extends keyof T>(
  items: T[],
  key: K,
  value: T[K]
): T[] => {
  if (Array.isArray(items) && items.length > 1) {
    return items.filter((item) => item[key] !== value);
  }
  return items;
};
