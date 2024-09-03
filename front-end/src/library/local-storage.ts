export const getStorageItem = <DefaultValue = unknown>(
	key: string,
	defaultValue?: DefaultValue
) => {
	try {
		const item = localStorage.getItem(key);

		if (typeof item === "string") {
			return JSON.parse(item);
		}
	} catch {
		// Empty on purpose
	}

	return defaultValue;
};

export const setStorageItem = <Value = unknown>(key: string, value: Value) => {
	localStorage.setItem(key, JSON.stringify(value));
};

export const removeStorageItem = (key: string) => {
	localStorage.removeItem(key);
};
