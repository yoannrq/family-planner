// [ Package imports ]
import { redirect } from '@sveltejs/kit';

// [ Local imports ]
import type { LayoutLoad } from './$types';
import { getUserGroups } from '$lib/api/group';

export const load: LayoutLoad = async ({ parent }): Promise<App.LayoutData> => {
	const user = (await parent()) as App.User;

	if (!user) {
		throw redirect(307, '/');
	}

	const userGroups = await getUserGroups(user.email);

	return {
		user: {
			email: user.email,
			name: user.name,
			profilePictureUrl: user.profilePictureUrl
		},
		userGroups
	};
};
