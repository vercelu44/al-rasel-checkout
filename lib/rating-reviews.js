import EmojiDisappointed from "@/components/elements/svg/EmojiDisappointed";
import EmojiHappy from "@/components/elements/svg/EmojiHappy";
import EmojiNeutral from "@/components/elements/svg/EmojiNeutral";
import EmojiSad from "@/components/elements/svg/EmojiSad";
import EmojiSmile from "@/components/elements/svg/EmojiSmile ";

/**
 * The function `getRatingEmoji` returns an emoji based on the provided rating, with a
 * default of a happy emoji if no rating is provided.
 * @param [rating=5] - The rating parameter is a number that represents the rating of something, such
 * as a product or a service. It has a default value of 5 if no value is provided.
 * @returns The appropriate emoji component based on the given rating.
 */
export const getRatingEmoji = (rating = 5) => {
	switch (Math.round(rating)) {
		case 1:
			return <EmojiSad />;
		case 2:
			return <EmojiDisappointed />;
		case 3:
			return <EmojiNeutral />;
		case 4:
			return <EmojiSmile />;
		case 5:
			return <EmojiHappy />;
		default:
			return <EmojiHappy />;
	}
};

/**
 * The function `getRatingText` returns a translated text based on a given rating.
 * @param [rating=5] - The rating parameter is a number that represents the rating given to something.
 * It has a default value of 5 if no value is provided.
 * @param [translations] - An object containing translations for different rating texts. The keys in
 * the object represent the rating text and the values represent the translated text in the desired
 * language.
 * @returns The function `getRatingText` returns a string value representing the appropriate
 * rating text based on the input rating.
 */
export const getRatingText = (rating = 5, translations = {}) => {
	switch (Math.round(rating)) {
		case 1:
			return translations["very-bad"] || "Very Bad";
		case 2:
			return translations["bad"] || "Bad";
		case 3:
			return translations["average"] || "Average";
		case 4:
			return translations["good"] || "Good";
		case 5:
			return translations["outstanding"] || "Outstanding";
		default:
			return translations["outstanding"] || "Outstanding";
	}
};
