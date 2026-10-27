/**
 * The function calculates the total of a specific column in a table data array.
 * @param tableData - An array of objects representing a table, where each object represents a row and
 * contains key-value pairs for each column in the table.
 * @param columnKey - The columnKey parameter is a string that represents the key or property name of
 * the column in the tableData array for which we want to calculate the total.
 * @returns The function `getColumnTotal` returns the total sum of values in a specified column of a
 * table represented by `tableData` array. If `tableData` is not an array, it returns 0.
 */
export const getColumnTotal = <T extends object>(
  tableData: T[],
  columnKey: keyof T
): number => {
  let total = 0;
  if (Array.isArray(tableData)) {
    tableData.forEach((row) => {
      total += Number(row?.[columnKey]) || 0;
    });
  }
  return total;
};

/**
 * The function calculates the total of a column in a table by multiplying the values of another column
 * in each row.
 * @param tableData - an array of objects representing a table
 * @param multiplyKey - The key of the property in each row of the tableData array that contains the
 * value to be multiplied with the value of the columnKey property.
 * @param columnKey - The parameter `columnKey` is a string representing the key of the column in the
 * table data that we want to multiply with the `multiplyKey` parameter.
 * @returns The function `getMultipliedColumnTotal` returns the total sum of the multiplication of two
 * properties (`multiplyKey` and `columnKey`) of each object in an array (`tableData`).
 */
export const getMultipliedColumnTotal = <T extends object>(
  tableData: T[],
  multiplyKey: keyof T,
  columnKey: keyof T
): number => {
  let total = 0;
  if (Array.isArray(tableData)) {
    tableData.forEach((row) => {
      total += (Number(row?.[multiplyKey]) || 1) * (Number(row?.[columnKey]) || 0);
    });
  }
  return total;
};
