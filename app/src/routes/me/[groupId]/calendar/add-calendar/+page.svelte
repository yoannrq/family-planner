<script lang="ts">
	// [ Local imports ]
	import type { PageData } from './$types';

	// [ Component imports ]
	import CategoryHeader from '$lib/components/CategoryHeader.svelte';

	export let data: PageData;
</script>

<CategoryHeader user={data.user} groupId={data.groupId} currentPage="addCalendar" />

<main>
	<h1>Add Calendar</h1>
	<p>This is the add calendar page.</p>
</main>
