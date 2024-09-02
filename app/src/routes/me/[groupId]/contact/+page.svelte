<script lang="ts">
	// [ Package imports ]
	import { onMount } from 'svelte';

	// [ Local imports ]
	import type { PageData } from './$types';
	import { getContacts } from '$lib/api/contact';
	import { goto } from '$app/navigation';

	// [ Component imports ]
	import FloatingCreationButton from '$lib/components/FloatingCreationButton.svelte';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import ContactDisplay from '$lib/components/ContactDisplay.svelte';
	import CategoryHeader from '$lib/components/CategoryHeader.svelte';

	// [ Store imports ]
	import { clearError, errorStore } from '$lib/stores/errorStore';
	import { storeContact } from '$lib/stores/contactStore';
	import { loading } from '$lib/stores/loadingStatus';

	export let data: PageData;
	export let contacts: App.Contact[] = [];

	function handleClick(contact: App.Contact) {
		storeContact(contact);
		clearError();
		goto(`/me/${data.groupId}/contact/${contact.id}`);
	}

	onMount(async () => {
		clearError();
		loading.set(true);

		contacts = await getContacts(data.groupId);
		loading.set(false);
	});
</script>

<CategoryHeader user={data.user} groupId={data.groupId} categoryName="Contact" />

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
					<a
						href="/me/{data.groupId}/contact/{contact.id}"
						on:click|preventDefault={() => handleClick(contact)}
					>
						<ContactDisplay {contact} />
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p>There are no contacts in this group.</p>
	{/if}
	<FloatingCreationButton
		groupId={data.groupId}
		currentPage="contact"
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

	a {
		text-decoration: none;
	}
</style>
