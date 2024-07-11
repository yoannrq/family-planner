// [ Package imports ]
import { redirect } from '@sveltejs/kit';

// [ Local imports ]
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }): Promise<App.LayoutData> => {
	const parentData = (await parent()) as App.LayoutData;

	// TODO changer redirect par goto et ajouter !groups
	if (!parentData) {
		throw redirect(307, '/');
	}

	return {
		user: parentData.user,
		groups: parentData.groups
	};
};
