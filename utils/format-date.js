import { differenceInDays, format } from "date-fns";

/**
 * The function `getBdFormattedDate` takes a date as input and returns the formatted date in the
 * Bengali (Bangladesh) locale.
 * @param date - The `date` parameter is the input date that you want to format.
 * @returns The function `getBdFormattedDate` returns a formatted date string in the "bn-BD"
 * (Bengali-Bangladesh) locale.
 */
export const getBdFormattedDate = (date) => {
	if (!date) return "Invalid Date";
	return new Date(date).toLocaleDateString("bn-BD");
};

/**
 * The function `getFormattedDate` takes a date as input and returns it in the format "dd MMM yyyy".
 * @param date - The `date` parameter is a string representing a date in any valid format.
 * @returns a formatted date string in the format "dd MMM yyyy".
 */
export const getFormattedDate = (date) => {
	try {
		return format(new Date(date), "dd MMM yyyy");
	} catch (error) {
		return "Invalid Date";
	}
};

/**
 * The function `getFormattedDateTime` takes a date and returns a formatted string with the date and
 * time in the Bangladeshi time zone.
 * @param date - The `date` parameter in the `getFormattedDateTime` function is the date and time that
 * you want to format. It can be a Date object, a timestamp, or a date string that can be recognized by
 * the `Date` constructor.
 * @param [locale=en-US] - The `locale` parameter in the `getFormattedDateTime` function is used to
 * specify the language and region for formatting the date and time. It determines how the date and
 * time components will be displayed, such as the month name, day of the week, and time format. In this
 * function, the
 * @param [numberingSystem=latn] - The `numberingSystem` parameter in the `getFormattedDateTime`
 * function is used to specify the numbering system to be used for formatting the date and time. In the
 * provided function, it is set to "latn" by default, which represents the Latin numbering system.
 * @returns The `getFormattedDateTime` function returns a formatted date and time string in the format
 * "Month Day, Year - Hour:Minute" based on the input date, locale, and numbering system provided. The
 * date is formatted with the full month name, day of the month, and year, while the time is formatted
 * with the hour and minute in 24-hour format. The returned string combines the formatted
 */
export const getFormattedDateTime = (
	date,
	locale = "en-US",
	numberingSystem = "latn"
) => {
	const optionsDate = {
		timeZone: "Asia/Dhaka", // Set the time zone to Bangladeshi time zone
		year: "numeric",
		month: "long",
		day: "numeric",
		numberingSystem,
	};

	const optionsTime = {
		timeZone: "Asia/Dhaka", // Set the time zone to Bangladeshi time zone
		hour: "2-digit",
		minute: "2-digit",
	};
	const formattedDate = new Date(date).toLocaleString(locale, optionsDate);
	const formattedTime = new Date(date).toLocaleString(locale, optionsTime);

	return `${formattedDate} - ${formattedTime}`;
};

/**
 * The function calculates the number of days that have passed since a given date.
 * @param createdAt - The `createdAt` parameter is a date representing the creation date of an object
 * or entity.
 * @returns The function `getDaysSinceCreation` returns the number of days that have passed since the
 * `createdAt` date.
 */
export const getDaysSinceCreation = (createdAt) => {
	const days = differenceInDays(new Date(), new Date(createdAt));
	return days;
};