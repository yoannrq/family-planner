// [ Package imports ]
import { CapacitorHttp } from '@capacitor/core';

// [ Local imports ]
import { PUBLIC_URL_API } from '$env/static/public';

export async function getColors(): Promise<App.Color[]> {
	const { data, status } = await CapacitorHttp.get({
		url: `${PUBLIC_URL_API}/api/public/color`,
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (status === 200 && data) {
		return data;
	} else {
		console.error('Erreur lors de la récupération des couleurs');
		return [];
	}
}
