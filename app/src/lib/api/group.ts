// [ Package imports ]
import { CapacitorHttp } from '@capacitor/core';

// [ Local imports ]
import { PUBLIC_URL_API } from '$env/static/public';
import { getValidAccessTokenOrGoToLogin } from '$lib/auth';
import { storeError, clearError } from '$lib/stores/errorStore';

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
		storeError(status, data.err.message);
		return [];
	}
}

/**
 * @function createGroup
 * @route POST /api/me/group
 * @summary Create a group
 * @protected header {string} Authorization - Bearer token
 * @param {string} name - The name of the group
 * @param {number} colorId - The color of the group
 * @returns {Promise<App.Group>} - The created group
 */
export async function createGroup(name: string, colorId: number): Promise<App.Group | null> {
	try {
		const accessToken = await getValidAccessTokenOrGoToLogin();
		const { data, status } = await CapacitorHttp.post({
			url: `${PUBLIC_URL_API}/api/me/group`,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			},
			data: {
				name,
				colorId
			}
		});

		if (status === 201 && data) {
			clearError();
			return data;
		} else {
			storeError(status, data.message || 'Something went wrong');
			return null;
		}
	} catch (error: unknown) {
		console.error(error);
		storeError(500, 'Something went wrong');
		return null;
	}
}
