// [ Package imports]
import type { Handle } from '@sveltejs/kit';

// [ Local imports ]
import { clearPreferencesObject, getToken, isTokenExpired, refreshAccessToken } from '$lib/auth';
import { goto } from '$app/navigation';

export const handle: Handle = async ({ event, resolve }) => {
	const accessToken = await getToken('access');
	const currentPath = event.url.pathname;

	if (!accessToken || isTokenExpired(accessToken)) {
		const isRefreshOk = await refreshAccessToken();

		if (!isRefreshOk && !['/', '/signup'].includes(currentPath)) {
			clearPreferencesObject();
			goto('/');
		}

		const refreshedAccessToken = await getToken('access');
		if (!refreshedAccessToken || isTokenExpired(refreshedAccessToken)) {
			clearPreferencesObject();
			goto('/');
		}
	}

	return await resolve(event);
};
