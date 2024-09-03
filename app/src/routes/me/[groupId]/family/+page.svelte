<script lang="ts">
	// [ Package imports ]
	import { onMount } from 'svelte';

	// [ Local imports ]
	import type { PageData } from './$types';
	import { getGroupByIdWithUsers } from '$lib/api/group.js';

	// [ Component imports ]
	import CategoryHeader from '$lib/components/CategoryHeader.svelte';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import PersonDisplay from '$lib/components/PersonDisplay.svelte';
	import FloatingCreationButton from '$lib/components/FloatingCreationButton.svelte';

	// [ Store imports ]
	import { errorStore, clearError } from '$lib/stores/errorStore';
	import { loading } from '$lib/stores/loadingStatus';

	export let data: PageData;
	export let users: App.User[] | undefined = [];

	onMount(async () => {
		clearError();
		loading.set(true);

		const groupWithUsers = await getGroupByIdWithUsers(data.groupId);
		users = groupWithUsers?.users;
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
		<p>Chargement des membres de la famille...</p>
	{:else if users}
		<ul>
			{#each users as user}
				<li>
					<PersonDisplay person={user} />
					<button on:click={() => console.log(user)}></button>
				</li>
			{/each}
		</ul>
	{:else}
		<p>Problème survenu lors de la récupération des membres de la famille.</p>
	{/if}
	<FloatingCreationButton
		groupId={data.groupId}
		currentPage="family"
		settingColorId={data.user.settingColorId}
	/>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	ul {
		list-style-type: none;
		padding: 0;
		background-color: var(--color-deep-background);
		margin: 0;
	}

	li {
		border-bottom: solid 1px var(--color-light-text);
	}
</style>
