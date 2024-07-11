// [ Package imports ]

// [ Local imports ]
import type { LayoutLoad } from './$types';
import {
	getToken,
	isTokenExpired,
	refreshAccessToken,
	getPreferencesObject,
	clearPreferencesObject
} from '$lib/auth';
import { goto } from '$app/navigation';

export const load: LayoutLoad = async ({ url }): Promise<App.LayoutData | null> => {
	const currentPath = url.pathname;
	const accessToken = await getToken('access');
	const user = await getPreferencesObject<App.User>('user');
	const groups = await getPreferencesObject<App.Group[]>('groups');

	const redirectToHome = async () => {
		await clearPreferencesObject();
		if (!['/', '/signup'].includes(currentPath)) {
			goto('/');
		}
		return null;
	};

	if (!accessToken || isTokenExpired(accessToken)) {
		const isRefreshOk = await refreshAccessToken();

		if (!isRefreshOk) {
			return redirectToHome();
		}
	}

	if (!user || groups === null || groups.length === 0) {
		return redirectToHome();
	}

	if (['/', '/signup'].includes(currentPath)) {
		goto(`/me/${groups[0].id}/dashboard`);
	}

	return { user, groups };
};

export const prerender = false;
