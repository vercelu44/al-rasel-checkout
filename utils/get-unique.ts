/**
 * The function generates a unique ID by combining the current timestamp and a random string.
 * @returns A string that combines the current timestamp in base 36 and a random string in base 36.
 */
export const generateUniqueId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36);
  return timestamp + randomStr;
};
