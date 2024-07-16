// [ Package imports ]
import { writable } from 'svelte/store';

// [ Local imports ]
import { getPreferencesObject, setPreferencesObject } from '$lib/auth';
import { getColors } from '$lib/api/color';

type ColorStore = Record<string, string>;
const colorStore = writable<ColorStore>({});

/**
 * @function initializeColorStore
 * @summary Initialize the color store with the colors from the preferences or the default colors
 * @returns
 */
export async function initializeColorStore() {
	let currentColors: ColorStore = {};

	// Subscribe to the store to get the current colors
	colorStore.subscribe((value) => {
		currentColors = value;
	})();

	// If the store is already initialized, return
	if (Object.keys(currentColors).length > 0) {
		return;
	}

	// Get the colors from the preferences
	let colorsList = await getPreferencesObject<App.Color[] | null>('colors');

	// If the colors are not in the preferences, get the colors from the API
	if (colorsList === null || colorsList.length === 0) {
		const colors = await getColors();
		await setPreferencesObject('colors', colors);
		colorsList = colors;
	}

	const newColorStore: ColorStore = {};

	// Set the colors in the store
	colorsList.forEach((color) => {
		newColorStore[color.id.toString()] = color.hexCode;
	});
	colorStore.set(newColorStore);
}

/**
 * @function getHexCodeColor
 * @summary Get the hexadecimal code for a color
 * @param {number} colorId - The color id
 * @returns {string} - The hex code
 */
export function getHexCodeColor(colorId: number): string {
	let hexCode: string | undefined;
	colorStore.subscribe((store) => {
		hexCode = store[colorId.toString()];
	})();
	return hexCode || '#2f3c7e';
}
