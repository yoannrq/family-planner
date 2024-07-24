<script lang="ts">
	import { onMount } from 'svelte';
	// [ Package imports ]

	// [ Local imports ]
	import type { PageData } from './$types';
	import { getContacts } from '$lib/api/contact';
	import { addError, clearError, errorStore } from '$lib/stores/errorStore';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import { loading } from '$lib/stores/loadingStatus';
	import ContactDisplay from '$lib/components/ContactDisplay.svelte';

	export let data: PageData;
	export let contacts: App.Contact[] = [];

	onMount(async () => {
		clearError();
		loading.set(true);

		if (!data.groupId) {
			addError(404, 'Something went wrong with the group identifier.');
			loading.set(false);
			return;
		}

		contacts = await getContacts(data.groupId);
		loading.set(false);
		console.log(contacts);
	});
</script>

<main>
	{#if $errorStore.status > 0}
		<ErrorDisplay message={$errorStore.message} severity="warning" />
	{/if}

	{#if $loading}
		<!-- TODO COMPONENT LOADING SPINNER -->
		<p>Chargement des contacts...</p>
	{:else if contacts.length > 0}
		<ul>
			{#each contacts as contact}
				<li>
					<a href="/me/{data.groupId}/contact/{contact.id}">
						<ContactDisplay {contact} />
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p>There are no contacts in this group.</p>
	{/if}
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

	a {
		text-decoration: none;
	}
</style>
