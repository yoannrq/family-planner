// [ Package imports ]
import { CapacitorHttp } from '@capacitor/core';

// [ Local imports ]
import { PUBLIC_URL_API } from '$env/static/public';
import { getValidAccessTokenOrGoToLogin } from '$lib/auth';

/**
 * @function getUserGroups
 * @route GET /api/me/group
 * @summary Get the groups of the user
 * @protected header {string} Authorization - Bearer token
 * @returns {Promise<App.Group[]>} - The groups
 */
export async function getUserGroups(): Promise<App.Group[]> {
	const accessToken = await getValidAccessTokenOrGoToLogin();
	const { data, status } = await CapacitorHttp.get({
		url: `${PUBLIC_URL_API}/api/me/group`,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (status === 200 && data) {
		return data;
	} else {
		console.error('Erreur lors de la récupération des groupes utilisateurs');
		return [];
	}
}
