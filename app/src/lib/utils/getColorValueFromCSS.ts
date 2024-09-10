/**
 * @function getColorValueFromCSS
 * @description Get the color value from the CSS variable
 * @param {string} variableName
 * @returns {string} - The color value
 */
export const getColorValueFromCSS = (variableName: string): string => {
	const style = getComputedStyle(document.documentElement);
	const color = style.getPropertyValue(variableName);
	return color;
};
