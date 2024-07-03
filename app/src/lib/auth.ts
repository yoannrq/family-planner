// [ Package imports ]
import { writable } from 'svelte/store';
import { CapacitorHttp } from '@capacitor/core';
import type { HttpResponse } from '@capacitor/core';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

// [ Local imports ]

// Store access token in memory svelte/store
export const accessToken = writable<string | null>(null);

// [ Functions ]
// Store refresh token in secure storage and access token in memory
export async function setTokens(access: string, refresh: string) {
	accessToken.set(access);
	await SecureStoragePlugin.set({
		key: 'refreshToken',
		value: refresh
	});
}

// Get refresh token from secure storage
export async function getRefreshToken(): Promise<string | null> {
	try {
		const { value } = await SecureStoragePlugin.get({ key: 'refreshToken' });
		return value;
	} catch (error) {
		console.error('Erreur lors de la récupération du refresh token:', error);
		return null;
	}
}

// Clear refresh token from secure storage and access token in memory
export async function clearTokens() {
	accessToken.set(null);
	try {
		await SecureStoragePlugin.remove({ key: 'refreshToken' });
	} catch (error) {
		console.error('Erreur lors de la suppression du refresh token:', error);
	}
}

// API call to get a new access token
export async function refreshAccessToken() {
	const refreshToken = await getRefreshToken();
	if (refreshToken) {
		try {
			// [ Call API ]
			const response: HttpResponse = await CapacitorHttp.post({
				url: '/api/auth/new-access-token',
				headers: { 'Content-Type': 'application/json' },
				data: { refreshToken }
			});

			if (response.status === 200) {
				const responseData = response.data;
				if (typeof responseData === 'object' && 'accessToken' in responseData) {
					const newAccessToken = responseData.accessToken;
					accessToken.set(newAccessToken);
					return true;
				} else {
					//TODO Gérer les erreurs au travers d'une page d'erreur
					console.error('La réponse ne contient pas de accessToken valide');
				}
			} else {
				console.error('Erreur lors du rafraîchissement du token:', response.status, response.data);
			}
		} catch (error) {
			console.error('Erreur lors du rafraîchissement du token:', error);
		}
	}
	return false;
}
