// [ Package imports ]
import { CapacitorHttp } from '@capacitor/core';

// [ Local imports ]
import { PUBLIC_URL_API } from '$env/static/public';

/**
 * @function getColors
 * @route GET /api/public/color
 * @summary Get an array with all colors
 * @public
 * @returns {Promise<App.Color[]>} - The colors
 */
export async function getColors(): Promise<App.Color[]> {
	try {
		const { data, status } = await CapacitorHttp.get({
			url: `${PUBLIC_URL_API}/api/public/color`,
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (status === 200 && data) {
			return data;
		} else {
			console.error('Erreur lors de la récupération des couleurs');
			return [];
		}
	} catch (error: unknown) {
		console.error(error);
		return [];
	}
}
