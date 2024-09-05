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
	try {
		const accessToken = await getValidAccessTokenOrGoToLogin();
		const { data, status } = await CapacitorHttp.get({
			url: `${PUBLIC_URL_API}/api/me/group`,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			}
		});

		if (status === 200 && data) {
			return data as App.Group[];
		} else {
			storeError(status, data.err.message);
			return [];
		}
	} catch (error: unknown) {
		console.error(error);
		storeError(500, 'Something went wrong');
		return [];
	}
}

/**
 * @function getGroupByIdWithUsers
 * @route GET /api/me/group/:groupId
 * @summary Get a group by id with users
 * @protected header {string} Authorization - Bearer token
 * @param {number | string} groupId - The id of the group
 * @returns {Promise<App.GroupWithUsers | null>} - The group with users
 */
export async function getGroupByIdWithUsers(
	groupId: number | string
): Promise<App.GroupWithUsers | null> {
	try {
		const accessToken = await getValidAccessTokenOrGoToLogin();
		const { data, status } = await CapacitorHttp.get({
			url: `${PUBLIC_URL_API}/api/me/group/${groupId}`,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			}
		});

		if (status === 200 && data) {
			clearError();
			return data as App.GroupWithUsers;
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
 * @function createGroup
 * @route POST /api/me/group
 * @summary Create a group
 * @protected header {string} Authorization - Bearer token
 * @param {string} name - The name of the group
 * @param {number} colorId - The color of the group
 * @returns {Promise<App.Group | null>} - The created group
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
			return data as App.Group;
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
 * @function updateGroup
 * @route PATCH /api/me/group/:groupId
 * @summary Update a group
 * @protected header {string} Authorization - Bearer token
 * @param {number} groupId - The id of the group
 * @param {string} name - The name of the group
 * @param {number} colorId - The color of the group
 * @param {number} ownerId - The id of the owner
 * @returns {Promise<App.Group | null>} - The updated group
 */
export async function updateGroup(
	groupId: number,
	name?: string,
	colorId?: number,
	ownerId?: number
): Promise<App.Group | null> {
	try {
		const accessToken = await getValidAccessTokenOrGoToLogin();
		const { data, status } = await CapacitorHttp.patch({
			url: `${PUBLIC_URL_API}/api/me/group/${groupId}`,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			},
			data: {
				name,
				colorId,
				ownerId
			}
		});

		if (status === 200 && data) {
			clearError();
			return data as App.Group;
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
 * @function removeUserFromGroup
 * @route DELETE /api/me/group/:groupId/user/:userId
 * @summary Delete a user from a group
 * @protected header {string} Authorization - Bearer token
 * @param {number} groupId - The id of the group
 * @param {number} userId - The id of the user
 * @returns {Promise<boolean>} - True if the user was removed
 */
export async function removeUserFromGroup(groupId: number, userId: number): Promise<boolean> {
	try {
		const accessToken = await getValidAccessTokenOrGoToLogin();
		const { status } = await CapacitorHttp.delete({
			url: `${PUBLIC_URL_API}/api/me/group/${groupId}/user/${userId}`,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			}
		});

		if (status === 204) {
			clearError();
			return true;
		} else {
			storeError(status, 'Something went wrong');
			return false;
		}
	} catch (error: unknown) {
		console.error(error);
		storeError(500, 'Something went wrong');
		return false;
	}
}
