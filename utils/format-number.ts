/**
 * The getFractionFixed function takes a number as input and returns it as a string, either as an integer
 * or with two decimal places.
 * @param num - The parameter `num` is a number that needs to be formatted.
 * @returns The function `getFractionFixed` returns a string representation of the input number. If the
 * input is an integer, it returns the number as a string. If the input is a decimal number, it returns
 * the number rounded to 2 decimal places as a string. If the input is not a number, it returns the
 * input as is.
 */
export function getFractionFixed<T>(num: number | T): string | T {
  if (Number.isInteger(num)) {
    return num.toString();
  } else if (typeof num === "number") {
    return num.toFixed(2);
  } else {
    return num;
  }
}

/**
 * The formatLongNumber function takes a number as input and returns a formatted string representation
 * of the number with abbreviations for thousands, millions, and billions.
 * @param num - The `num` parameter represents a number that you want to format.
 * @returns The function `formatLongNumber` returns a formatted string representation of a number. If
 * the number is less than 1000, it returns the number as a string. If the number is between 1000 and
 * 999,999, it returns the number divided by 1000 and rounded to 1 decimal place, followed by the
 * letter "k". If the number is between 1,
 */
export const formatLongNumber = (num: number): string => {
  if (num < 1000) {
    return num.toString();
  } else if (num >= 1000 && num < 1000000) {
    return (num / 1000).toFixed(1) + "k";
  } else if (num >= 1000000 && num < 1000000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else {
    return (num / 1000000000).toFixed(1) + "B";
  }
};
