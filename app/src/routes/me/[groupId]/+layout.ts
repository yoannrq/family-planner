// [ Package imports ]

// [ Local imports ]
import type { LayoutLoad } from './$types';
import { goto } from '$app/navigation';

export const load: LayoutLoad = async ({ parent, params }): Promise<App.LayoutData> => {
	const parentData = (await parent()) as App.LayoutData;

	if (!parentData) {
		goto('/');
	}

	return {
		user: parentData.user,
		groups: parentData.groups,
		groupId: params.groupId
	};
};
