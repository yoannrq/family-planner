// [ Package imports ]
import { CapacitorHttp } from '@capacitor/core';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from 'jwt-decode';
import { SecureStorage } from '@aparajita/capacitor-secure-storage';
import { Preferences } from '@capacitor/preferences';

// [ Local imports ]
import { PUBLIC_URL_API } from '$env/static/public';
import { goto } from '$app/navigation';

/**
 * @function setPreferencesObject
 * @summary Store user email and authenticated status in preferences storage
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {string} profilePictureUrl - User profile picture url
 * @returns {Promise<void>} - Promise that resolves when the operation is done
 */
export async function setPreferencesObject(
	email: string,
	name: string,
	profilePictureUrl: string
): Promise<void> {
	await Preferences.set({
		key: 'user',
		value: JSON.stringify({
			email: email,
			name: name,
			profilePictureUrl: profilePictureUrl
		})
	});
	console.info('Preferences set:', email);
}

/**
 * @function getPreferencesObject
 * @summary Get user email from preferences storage
 * @returns {Promise<App.User | null>} - User object or null if not found
 */
export async function getPreferencesObject(): Promise<App.User | null> {
	const ret = await Preferences.get({ key: 'user' });

	if (ret && ret.value && typeof ret.value === 'string') {
		const user = JSON.parse(ret.value) as App.User;

		if (user && user.email && user.name) {
			console.info('Preferences get:', user.email);
			console.info('Preferences get:', user.name);
			return user;
		}
	}

	console.info('Preferences get: null');
	return null;
}

/**
 * @function clearPreferencesObject
 * @summary Clear everything from preferences storage
 * @returns {Promise<void>} - Promise
 */
export async function clearPreferencesObject(): Promise<void> {
	await Preferences.clear();
	console.info('Preferences clear');
}

/**
 * @function setToken
 * @summary Store access token in secure storage
 * @param {string} key - key of the token
 * @param {string} token
 * @returns {Promise<void>} - Promise
 */
export async function setToken(key: string, token: string): Promise<void> {
	await SecureStorage.setItem(key, token);
	console.info('Token set:', key);
	console.info('Token set:', token);
}

/**
 * @function getToken
 * @summary Get token from secure storage
 * @param {string} key - key of the token ('refresh' or 'access')
 * @returns {Promise<string | null>} - token if found, null otherwise
 */
export async function getToken(key: 'refresh' | 'access'): Promise<string | null> {
	try {
		const token = await SecureStorage.getItem(key);

		if (token && typeof token === 'string') {
			console.info('Token get:', key);
			return token;
		} else {
			console.info('Token get: null');
			return null;
		}
	} catch (error) {
		console.error('Erreur lors de la récupération du token:', error);
		return null;
	}
}

/**
 * @function refreshAccessToken
 * @summary API call to get a new access token
 * @returns {Promise<boolean>} - true if access token has been refreshed, false otherwise
 */
export async function refreshAccessToken(): Promise<boolean> {
	const refreshToken = await getToken('refresh');
	const isRefreshTokenExpired = isTokenExpired(refreshToken);
	console.log('refreshToken', refreshToken);
	if (refreshToken && !isRefreshTokenExpired) {
		try {
			const { data, status } = await CapacitorHttp.post({
				url: `${PUBLIC_URL_API}/api/auth/new-access-token`,
				headers: { 'Content-Type': 'application/json' },
				data: { refreshToken }
			});
			console.log('data: ', data);

			if (status === 200 && data?.accessToken) {
				await setToken('access', data.accessToken);
				console.info('Token refreshed', data.accessToken);
				return true;
			}

			console.error('Erreur lors du rafraîchissement du token:', status, data);
			await clearPreferencesObject();
			return false;
		} catch (error) {
			console.error('Erreur lors du rafraîchissement du token, error :', error);
			await clearPreferencesObject();
			return false;
		}
	}
	console.error('Erreur lors du rafraîchissement du token: refresh token not found or expired');
	await clearPreferencesObject();
	return false;
}

/**
 * @function isTokenExpired
 * @summary Check if a token is expired
 * @param {string} token - Token to check
 * @returns {boolean} - True if token is expired, false otherwise
 */
export function isTokenExpired(token: string | null): boolean {
	if (!token) return true;
	try {
		const decodedToken = jwtDecode<JwtPayload>(token);

		if (typeof decodedToken.exp === 'undefined') {
			console.error('Token has no expiration date');
			return true;
		}
		console.info('Token expiration date:', decodedToken.exp);
		return decodedToken.exp < Date.now() / 1000;
	} catch (error) {
		console.error('Error during decoding process :', error);
		return true;
	}
}

/**
 * @function getValidAccessTokenOrGoToLogin
 * @summary Get valid access token or go to login page
 * @returns {Promise<string | null>} - Access token or null if not found
 */
export async function getValidAccessTokenOrGoToLogin(): Promise<string | null> {
	let accessToken = await getToken('access');
	const isAccessTokenExpired = isTokenExpired(accessToken);

	// If token is expired or non-existent, get a new one
	if (!accessToken || isAccessTokenExpired) {
		const refreshToken = await getToken('refresh');
		const isRefreshTokenExpired = isTokenExpired(refreshToken);

		// If refresh token is expired or non-existent, go to login page
		if (!refreshToken || isRefreshTokenExpired) {
			await clearPreferencesObject();
			goto('/');
			return null;
		} else {
			const tokenRefreshed = await refreshAccessToken();

			// If refresh token has not been refreshed, go to login page
			if (!tokenRefreshed) {
				await clearPreferencesObject();
				goto('/');
				return null;
			}

			// If refresh token has been refreshed, get a new access token
			accessToken = await getToken('access');
		}
	}

	return accessToken;
}
