<script lang="ts">
	// [ Local imports ]
	import type { LayoutData } from './$types';
	import CategoryHeader from '$lib/components/CategoryHeader.svelte';

	export let data: LayoutData;
</script>

<CategoryHeader
	user={data.user}
	groups={data.groups}
	groupId={data.groupId}
	categoryName="Contact"
/>

<slot />
