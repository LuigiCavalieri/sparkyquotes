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

export const isEmail = (str: string) => {
	return /^[a-z0-9]+(?:\.[a-z0-9]+)*@[a-z0-9-]{3,}\.[a-z]{2,5}$/i.test(String(str));
};
