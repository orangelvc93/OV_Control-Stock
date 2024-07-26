"use client";

export const getFromLocalStorage = (key: string) => {
	const item = localStorage.getItem(key);
	if (item) {
		try {
			return JSON.parse(item);
		} catch (error) {
			console.error("Error parsing JSON from localStorage", error);
			return null;
		}
	}
	return null;
};
