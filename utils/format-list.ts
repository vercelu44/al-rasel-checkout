/**
 * The function `getChunksList` takes an array and splits it into smaller arrays of a specified size.
 * @param list - The `list` parameter is an array that you want to split into chunks.
 * @param [chunk_size=2] - The `chunk_size` parameter determines the size of each chunk in the
 * resulting chunks list. By default, it is set to 2, which means that the input list will be divided
 * into chunks of size 2.
 * @returns The function `getChunksList` returns an array of chunks, where each chunk is a subarray of
 * the original `list` array. If the `list` is an array, the function will divide it into chunks of
 * size `chunk_size` (default is 2). If the `list` is not an array, it will return an array with the
 * `list` as the only element
 */
export const getChunksList = <T,>(list: T[], chunk_size = 2): T[][] => {
	if (Array.isArray(list)) {
		const chunksList = new Array(Math.ceil(list.length / chunk_size))
			.fill(undefined)
			.map((_, index) => index * chunk_size)
			.map((begin) => list.slice(begin, begin + chunk_size));
		return chunksList;
	}
	return [list as unknown as T[]];
};

/**
 * The `groupByKey` function takes a list of objects and a key, and returns an object where the keys
 * are unique values of the specified key and the values are arrays of objects with that key value.
 * @param list - An array of objects that you want to group by a specific key.
 * @param key - The "key" parameter is a string that represents the property key by which the list
 * should be grouped.
 * @returns The function `groupByKey` returns an object where the keys are unique values of the
 * specified `key` in the `list` array, and the values are arrays of items from the `list` array that
 * have the same value for the specified `key`.
 */
export const groupByKey = <T, K extends keyof T>(
	list: T[],
	key: K
): Record<string, T[]> => {
	return list.reduce<Record<string, T[]>>((result, item) => {
		const groupKey = String(item[key]);
		if (!result[groupKey]) {
			result[groupKey] = [];
		}
		result[groupKey].push(item);
		return result;
	}, {});
};
