// [ Package imports ]
import { CapacitorHttp } from '@capacitor/core';

// [ Local imports ]
import { PUBLIC_URL_API } from '$env/static/public';
import { getValidAccessTokenOrGoToLogin } from '$lib/auth';

export async function getUserGroups(): Promise<App.Group[]> {
	const accessToken = await getValidAccessTokenOrGoToLogin();
	const { data, status } = await CapacitorHttp.get({
		url: `${PUBLIC_URL_API}/api/me/groups`,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (status === 200 && data?.groups) {
		return data.groups;
	} else {
		console.error('Erreur lors de la récupération des groupes utilisateurs');
		return [];
	}
}
