// [ Package imports ]

// [ Local imports ]
import type { LayoutLoad } from './$types';
import {
	getToken,
	isTokenExpired,
	refreshAccessToken,
	getPreferencesObject,
	clearPreferencesObjectAndSecureStorage
} from '$lib/auth';
import { goto } from '$app/navigation';
import { getColors } from '$lib/api/color';
import { setPreferencesObject } from '$lib/auth';
import { initializeColorStore } from '$lib/stores/colorStore';

export const load: LayoutLoad = async ({ url }): Promise<App.LayoutData | null> => {
	const currentPath = url.pathname;
	const accessToken = await getToken('access');
	const user = await getPreferencesObject<App.User>('user');
	const groups = await getPreferencesObject<App.Group[]>('groups');
	const colors = await getPreferencesObject<App.Color[]>('colors');

	// Clear preferences and redirect to login page if the current url is not login or signup page
	async function redirectToHome() {
		await clearPreferencesObjectAndSecureStorage();
		if (!['/', '/signup'].includes(currentPath)) {
			goto('/');
		}
		return null;
	}

	if (colors === null || colors.length === 0) {
		const colors = await getColors();
		await setPreferencesObject('colors', colors);
	}

	// If access token is expired or falsy, get another one with refresh token
	if (!accessToken || isTokenExpired(accessToken)) {
		const isRefreshOk = await refreshAccessToken();

		if (!isRefreshOk) {
			return redirectToHome();
		}
	}

	// If user and group informations are missing, redirect to login page
	if (!user || groups === null || groups.length === 0) {
		return redirectToHome();
	}

	if (['/', '/signup'].includes(currentPath)) {
		await initializeColorStore();
		goto(`/me/${groups[0].id}/dashboard`);
	}

	return { user, groups };
};

export const prerender = false;
