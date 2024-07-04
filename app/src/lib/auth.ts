// [ Package imports ]
import { writable } from 'svelte/store';
import { CapacitorHttp } from '@capacitor/core';
import type { HttpResponse } from '@capacitor/core';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from 'jwt-decode';
import { SecureStorage } from '@aparajita/capacitor-secure-storage';

// [ Local imports ]
import { PUBLIC_URL_API } from '$env/static/public';

// Store access token in memory svelte/store
export const accessToken = writable<string | null>(null);

// [ Functions ]
// Store refresh token in secure storage and access token in memory
export async function setTokens(access: string, refresh: string) {
	accessToken.set(access);
	await SecureStorage.setItem('refreshToken', refresh);
}

// Get refresh token from secure storage
export async function getRefreshToken(): Promise<string | null> {
	try {
		const result = await SecureStorage.getItem('refreshToken');

		if (result && result && typeof result === 'string') {
			return result;
		} else {
			console.error('Refresh token non trouvé ou invalide');
			return null;
		}
	} catch (error) {
		console.error('Erreur lors de la récupération du refresh token:', error);
		return null;
	}
}

// Clear refresh token from secure storage and access token in memory
export async function clearTokens() {
	accessToken.set(null);
	try {
		await SecureStorage.removeItem('refreshToken');
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
				url: `${PUBLIC_URL_API}/api/auth/new-access-token`,
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

// Check if a token is expired
export function isTokenExpired(token: string | null): boolean {
	if (!token) return true;
	try {
		const decodedToken = jwtDecode<JwtPayload>(token);

		if (typeof decodedToken.exp === 'undefined') {
			console.warn('Token has no expiration date');
			return true;
		}
		return decodedToken.exp < Date.now() / 1000;
	} catch (error) {
		console.error('Error during decoding process :', error);
		return true;
	}
}
