import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }): Promise<App.User> => {
	const user = (await parent()) as App.User;

	if (!user) {
		throw redirect(307, '/');
	}

	return {
		email: user.email,
		name: user.name,
		profilePictureUrl: user.profilePictureUrl
	};
};
