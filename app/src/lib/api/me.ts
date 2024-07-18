// [ Package imports ]
import { CapacitorHttp } from '@capacitor/core';

// [ Local imports ]
import { PUBLIC_URL_API } from '$env/static/public';
import { getValidAccessTokenOrGoToLogin } from '$lib/auth';
import { addError } from '$lib/stores/errorStore';

/**
 * @function updateMe
 * @route PATCH /api/me
 * @summary Update user information
 * @protected header {string} Authorization - Bearer token
 * @param {string} name - The name of the user
 * @param {string} password - The password of the user
 * @returns {Promise<App.User | null>} - Updated user
 */
export async function updateMe(name?: string, password?: string): Promise<App.User | null> {
	const accessToken = await getValidAccessTokenOrGoToLogin();
	const { data, status } = await CapacitorHttp.patch({
		url: `${PUBLIC_URL_API}/api/me`,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`
		},
		data: {
			name,
			password
		}
	});

	if (status === 200 && data) {
		return data;
	} else {
		addError(status, data.err.message);
		return null;
	}
}
