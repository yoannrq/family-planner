// [ Package imports ]

// [ Local imports ]
import type { LayoutLoad } from './$types';
import { goto } from '$app/navigation';

export const load: LayoutLoad = async ({ parent }): Promise<App.LayoutDataWithoutGroupId> => {
	const parentData = (await parent()) as App.LayoutDataWithoutGroupId;

	if (!parentData) {
		goto('/');
	}

	return {
		user: parentData.user,
		groups: parentData.groups
	};
};
