<script lang="ts">
	// [ Local imports ]
	import type { LayoutData } from './$types';
	import Header from '$lib/components/Header.svelte';

	export let data: LayoutData;
</script>

<Header user={data.user} groups={data.groups} groupId={data.groupId} />

<slot />
