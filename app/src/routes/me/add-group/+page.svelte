<script lang="ts">
	// [ Package imports ]
	import { onMount } from 'svelte';

	// [ Local imports ]
	import type { PageData } from './$types';
	import { createGroup, getUserGroups } from '$lib/api/group';
	import { errorStore, clearError } from '$lib/stores/errorStore';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import { setPreferencesObject, getPreferencesObject } from '$lib/auth';
	import { goto } from '$app/navigation';

	export let data: PageData;

	let colors: App.Color[] = [];
	let selectedColorId: number = 0;
	let selectedColor: App.Color | undefined = undefined;
	let selectStyle = '';
	let groupName = '';

	// Get the colors from the user's preferences
	const getColors = async (): Promise<App.Color[]> => {
		const colors = await getPreferencesObject('colors');
		return colors as App.Color[];
	};

	// Responsive update of selected style and color
	$: {
		selectedColor = colors.find((color) => color.id === selectedColorId);
		selectStyle = `background-color: ${selectedColor?.hexCode || '#0388fc'};`;
	}

	// Initial loading of colors and selection of the first one
	onMount(async () => {
		colors = (await getColors()) as App.Color[];
		if (colors.length > 0) {
			selectedColorId = colors[0].id;
		}
	});

	// Handle form submission
	async function handleSubmit() {
		// Clear the error store
		clearError();

		const newGroup = await createGroup(groupName, selectedColorId, data.user.id);

		if (!newGroup) {
			return;
		}

		const groups = await getUserGroups();

		if (groups.length === 0) {
			return;
		}

		// Store user groups in Preferences storage
		setPreferencesObject('groups', groups);

		const groupId = (newGroup.id).toString();

		goToDashboard(groupId);
	}

	const goToDashboard = (id: string) => {
		// Clear the error store
		clearError();
		goto(`/me/${id}/dashboard`);
	};
</script>

<section>
	<h2>Nouveau groupe</h2>
	<img src="/family-group.png" alt="Members of a family" />
	<a class="attribute" href="https://storyset.com/people">Illustration by Storyset</a>
	{#if $errorStore.status > 0}
		<ErrorDisplay message={$errorStore.message} severity="warning" />
	{/if}
	<form on:submit|preventDefault={handleSubmit}>
		<label for="group-name">Nom du groupe</label>
		<input type="text" id="group-name" name="name" bind:value={groupName} required />
		<label for="group-color">Couleur du groupe</label>
		<select id="group-color" name="color" bind:value={selectedColorId} style={selectStyle}>
			{#if colors && colors.length > 0}
				{#each colors as color}
					<option value={color.id}>{color.name}</option>
				{/each}
			{:else}
				<option value={0}>Perroquet</option>
			{/if}
		</select>
		<button class="submit-button" type="submit">Créer</button>
	</form>
	<button class="cancel-button" on:click|preventDefault={() => goToDashboard(data.groupId)}>Annuler</button>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	h2 {
		font-size: 1.7rem;
		color: var(--color-primary);
	}

	img {
		width: 10rem; /* 160px */
	}

	.attribute {
		font-size: 0.65rem;
		color: var(--color-secondary);
		margin: 0.3 0rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	label {
		font-weight: bold;
		font-size: 1.25rem;
	}

	input,
	select {
		padding: 0.5rem;
		border: 1px solid var(--color-secondary);
		border-radius: 0.25rem;
	}

	.submit-button {
		padding: 0.5rem;
		border: none;
		border-radius: 0.25rem;
		background-color: var(--color-primary);
		color: white;
		font-size: 1.1rem;
	}

	.cancel-button {
		padding: 0.5rem;
		border: none;
		border-radius: 0.25rem;
		background-color: var(--color-tertiary);
		color: white;
		font-size: 1.1rem;
		width: 55%;
	}
</style>
