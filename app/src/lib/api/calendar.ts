// [ Package imports ]
import { CapacitorHttp } from '@capacitor/core';

// [ Local imports ]
import { PUBLIC_URL_API } from '$env/static/public';
import { getValidAccessTokenOrGoToLogin } from '$lib/auth';
import { storeError, clearError } from '$lib/stores/errorStore';

/**
 * @function getCalendarEntries
 * @route GET /api/me/group/:groupId/calendar
 * @summary Get the calendar entries of the current group
 * @protected header {string} Authorization - Bearer token
 * @returns {Promise<App.CalendarEntry[]>} - List of calendar entries
 */
export async function getCalendarEntries(groupId: string): Promise<App.CalendarEntry[]> {
	const accessToken = await getValidAccessTokenOrGoToLogin();
	const { data, status } = await CapacitorHttp.get({
		url: `${PUBLIC_URL_API}/api/me/group/${groupId}/calendar`,
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
 * @function getCalendarEntriesUpdated
 * @route GET /api/me/group/:groupId/calendar?lastUpdate=:lastUpdate
 * @summary Get the calendar entries of the current group updated since lastUpdate
 * @protected header {string} Authorization - Bearer token
 * @param {number | string} groupId - Group ID
 * @param {string} lastUpdate - Last update timestamp
 * @returns {Promise<App.CalendarEntriesUpdatedWithLastUpdateTimestamp>} - List of updated calendar entries
 */
export async function getCalendarEntriesUpdated(
	groupId: number | string,
	lastUpdate: string
): Promise<App.CalendarEntriesUpdatedWithLastUpdateTimestamp> {
	const accessToken = await getValidAccessTokenOrGoToLogin();
	const { data, status } = await CapacitorHttp.get({
		url: `${PUBLIC_URL_API}/api/me/group/${groupId}/calendar?lastUpdate=${lastUpdate}`,
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
		return { entries: [], lastUpdateTimestamp: lastUpdate };
	}
}

/**
 * @function createCalendarEntry
 * @route POST /api/me/group/:groupId/calendar
 * @summary Create a calendar entry
 * @protected header {string} Authorization - Bearer token
 * @param {App.CalendarEntry} calendarEntry - Calendar entry object
 * @returns {Promise<App.CalendarEntry>} - Created calendar entry
 */
export async function createCalendarEntry(
	calendarEntry: App.CalendarEntryCreationData
): Promise<App.CalendarEntry | null> {
	try {
		const accessToken = await getValidAccessTokenOrGoToLogin();
		const { data, status } = await CapacitorHttp.post({
			url: `${PUBLIC_URL_API}/api/me/group/${calendarEntry.groupId}/calendar`,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			},
			data: calendarEntry
		});

		if (status === 201 && data) {
			clearError();
			return data;
		} else {
			storeError(status, data.message || 'Something went wrong');
			return null;
		}
	} catch (err: unknown) {
		console.error(err);
		storeError(500, 'Something went wrong');
		return null;
	}
}
