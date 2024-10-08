// [ Package imports ]
import { CapacitorHttp } from '@capacitor/core';

// [ Local imports ]
import { PUBLIC_URL_API } from '$env/static/public';
import { getValidAccessTokenOrGoToLogin } from '$lib/auth';
import { storeError, clearError } from '$lib/stores/errorStore';

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
		clearError();
		return data;
	} else {
		storeError(status, data.err.message);
		return [];
	}
}

/**
 * @function createContact
 * @route POST /api/me/group/:groupId/contact
 * @summary Create a contact
 * @protected header {string} Authorization - Bearer token
 * @param {App.Contact} contact - Contact object
 * @returns {Promise<App.Contact>} - Created contact
 */
export async function createContact(contact: App.ContactCreationData): Promise<App.Contact | null> {
	try {
		const accessToken = await getValidAccessTokenOrGoToLogin();
		const { data, status } = await CapacitorHttp.post({
			url: `${PUBLIC_URL_API}/api/me/group/${contact.groupId}/contact`,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			},
			data: contact
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

/**
 * @function updateContact
 * @route PATCH /api/me/group/:groupId/contact/:contactId
 * @summary Update a contact
 * @protected header {string} Authorization - Bearer token
 * @param {App.Contact} contact - Contact object
 * @returns {Promise<App.Contact>} - Updated contact
 */
export async function updateContact(contact: App.Contact): Promise<App.Contact | null> {
	try {
		const accessToken = await getValidAccessTokenOrGoToLogin();
		const { data, status } = await CapacitorHttp.patch({
			url: `${PUBLIC_URL_API}/api/me/group/${contact.groupId}/contact/${contact.id}`,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			},
			data: contact
		});

		if (status === 200 && data) {
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
