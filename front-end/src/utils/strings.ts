/**
 * Converts a string's casing to title case.
 */
export const toTitleCase = (str: string) => {
	const words = str.split(" ");

	return words
		.map(word => {
			const firstChar = word.charAt(0).toUpperCase();
			const restOfStr = word.substring(1);

			return firstChar + restOfStr;
		})
		.join(" ");
};
