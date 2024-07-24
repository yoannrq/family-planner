// [ Package imports ]
import { CapacitorHttp } from '@capacitor/core';

// [ Local imports ]
import { PUBLIC_URL_API } from '$env/static/public';
import { getValidAccessTokenOrGoToLogin } from '$lib/auth';
import { addError } from '$lib/stores/errorStore';

/**
 * @function getContacts
 * @route GET /api/me/group/:groupId/contact
 * @summary Get the contacts of the current group
 * @protected header {string} Authorization - Bearer token
 * @returns {Promise<App.Contact[]>} - List of contacts
 */
export async function getContacts(groupId: string): Promise<App.Contact[]> {
	const accessToken = await getValidAccessTokenOrGoToLogin();
	const { data, status } = await CapacitorHttp.get({
		url: `${PUBLIC_URL_API}/api/me/group/${groupId}/contact`,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (status === 200 && data) {
		return data;
	} else {
		addError(status, data.err.message);
		return [];
	}
}
