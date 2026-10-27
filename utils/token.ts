/**
 * The function retrieves a token from local storage or returns an empty string.
 * @returns The `getToken` function is returning the value of the `token` variable, which is either the
 * value stored in the "token" key in the browser's `localStorage` or an empty string if the key does
 * not exist.
 */
const getToken = (): string => {
  const token = localStorage.getItem("token") || "";
  return token;
};

export default getToken;
