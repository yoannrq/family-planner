// [ Package imports ]

// [ Local imports ]
import type { LayoutLoad } from './$types';
import { getToken, isTokenExpired, refreshAccessToken, getPreferencesObject } from '$lib/auth';
import { goto } from '$app/navigation';

export const load: LayoutLoad = async ({ url }): Promise<App.User | null> => {
	const currentPath = url.pathname;
	const accessToken = await getToken('access');
	const user = await getPreferencesObject();

	if (!accessToken || isTokenExpired(accessToken)) {
		const isRefreshOk = await refreshAccessToken();
		console.log('currentPath :' + currentPath);
		console.log('isRefreshOk :' + isRefreshOk);
		console.log('user :', user);
		if (!isRefreshOk) {
			if (!['/', '/signup'].includes(currentPath)) {
				console.log('layout.ts : Redirecting to / because isRefreshOk is false');
				goto('/');
				return null;
			}
		}
	}

	if (!user && !['/', '/signup'].includes(currentPath)) {
		console.log('layout.ts : Redirecting to / because user is not set');
		goto('/');
		return null;
	}

	if (user && 'email' in user && 'name' in user) {
		if (['/', '/signup'].includes(currentPath)) {
			console.log('layout.ts : Redirecting to /me/dashboard');
			goto('/me/dashboard');
		}

		return {
			email: user.email,
			name: user.name,
			profilePictureUrl: user.profilePictureUrl
		};
	}

	return null;
};

export const prerender = false;
