<script lang="ts">
	// [ Package imports ]
	import { onMount } from 'svelte';

	// [ Local imports ]
	import type { PageData } from './$types';

	// [ Component imports ]
	import CategoryHeader from '$lib/components/CategoryHeader.svelte';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';

	// [ Store imports ]
	import { errorStore, clearError } from '$lib/stores/errorStore';
	import { loading } from '$lib/stores/loadingStatus';

	export let data: PageData;
	export let users: App.User[] = [];

	onMount(async () => {
		clearError();
		loading.set(true);

		// TODO: users = await getUsers(data.groupId);
		loading.set(false);
	});
</script>

<CategoryHeader user={data.user} groupId={data.groupId} categoryName="Ma Famille" />

<main>
	{#if $errorStore.status > 0}
		<ErrorDisplay message={$errorStore.message} severity="warning" />
	{/if}
	{#if $loading}
		<!-- TODO COMPONENT LOADING SPINNER -->
		<p>Chargement des contacts...</p>
	{/if}
	<ul></ul>
</main>

<style></style>
