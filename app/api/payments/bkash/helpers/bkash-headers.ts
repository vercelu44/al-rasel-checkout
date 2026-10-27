/**
 * The function `getAuthHeaders` returns an object with the necessary headers for authentication,
 * including the "Content-Type", "Accept", and "x-app-key" headers.
 * @returns The function `getAuthHeaders` is returning an object with the following properties:
 */
export const getAuthHeaders = async () => {
	return {
		"Content-Type": "application/json",
		Accept: "application/json",
		"x-app-key": process.env.BKASH_APP_KEY,
	};
};

/**
 * The function `getTokenHeaders` returns an object with headers for making a request to obtain a
 * token, including the username and password from environment variables.
 * @returns The function `getTokenHeaders` returns an object with the following properties:
 */
export const getTokenHeaders = () => {
	return {
		"Content-Type": "application/json",
		Accept: "application/json",
		username: process.env.BKASH_USERNAME,
		password: process.env.BKASH_PASSWORD,
	};
};
