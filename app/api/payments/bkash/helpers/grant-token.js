import { getTokenHeaders } from "./bkash-headers";

/**
 * The function `generateGrantToken` is an asynchronous function that generates a grant token by making
 * a POST request to a specified URL with the necessary headers and body parameters.
 * @returns The function `generateGrantToken` returns an object with a property `grantToken`. The value
 * of `grantToken` is either the `id_token` from the token response or `null` if there was an error
 * generating the token.
 */
const generateGrantToken = async () => {
	// we can get new token from expired token using refresh token, learn how to integrate with refresh token
	// `${process.env.BKASH_BASE_URL}/token/refresh` // referesh token API

	try {
		const tokenResponse = await fetch(
			`${process.env.BKASH_BASE_URL}/token/grant`,
			{
				method: "POST",
				headers: getTokenHeaders(),
				body: JSON.stringify({
					app_key: process.env.BKASH_APP_KEY,
					app_secret: process.env.BKASH_APP_SECRET,
				}),
			}
		);
		const tokenResult = await tokenResponse.json();
		return { grantToken: tokenResult?.id_token }; // Indicate success
	} catch (e) {
		console.error("Error generating token:", e);
		// throw new Error("Failed to generate token");
		return { grantToken: null }; // Indicate failure
	}
};

export default generateGrantToken;
