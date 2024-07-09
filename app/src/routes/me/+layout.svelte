<script lang="ts">

	// [ Local imports ]
	import type { LayoutData } from './$types';
	import Header from '$lib/components/Header.svelte';

	export let data: LayoutData;
</script>

<!-- TODO essayer le Header ici -->
<Header user={data.user} userGroups={data.userGroups} />

<slot />
