/**
 * The function `getCountByKeyValue` counts the number of items in an array that have a specific
 * key-value pair.
 * @param items - The `items` parameter is an array of objects.
 * @param key - The `key` parameter is a string that represents the property key of the objects in the
 * `items` array that you want to check for a specific value.
 * @param value - The value parameter is the specific value that you want to count in the items array.
 * @returns the count of items in the given array that have a specific key-value pair.
 */
export const getCountByKeyValue = <T, K extends keyof T>(
  items: T[],
  key: K,
  value: T[K]
): number => {
  let count = 0;
  if (Array.isArray(items)) {
    items.forEach((item) => {
      if (item[key] === value) {
        count++;
      }
    });
  }
  return count;
};

/**
 * The function `getCountByKeyNotValue` counts the number of items in an array where the value of a
 * specified key is not equal to a specified value.
 * @param items - An array of objects. Each object represents an item and has various properties.
 * @param key - The "key" parameter is a string that represents the property key of each item in the
 * "items" array that you want to check.
 * @param value - The `value` parameter represents the value that you want to exclude when counting the
 * occurrences of a specific key in an array of objects.
 * @returns the count of items in the given array that have a specific key but do not have a specific
 * value for that key.
 */
export const getCountByKeyNotValue = <T, K extends keyof T>(
  items: T[],
  key: K,
  value: T[K]
): number => {
  let count = 0;
  if (Array.isArray(items)) {
    items.forEach((item) => {
      if (item[key] !== value) {
        count++;
      }
    });
  }
  return count;
};
