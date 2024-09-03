<script lang="ts">
	// [ Package imports ]
	import { onMount } from 'svelte';

	// [ Local imports ]
	import type { PageData } from './$types';
	import { getGroupByIdWithUsers } from '$lib/api/group.js';
	import { getColorValueFromCSS } from '$lib/utils/getColorValueFromCSS';

	// [ Component imports ]
	import CategoryHeader from '$lib/components/CategoryHeader.svelte';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import PersonDisplay from '$lib/components/PersonDisplay.svelte';
	import FloatingCreationButton from '$lib/components/FloatingCreationButton.svelte';
	import SvgDisplay from '$lib/components/SvgDisplay.svelte';

	// [ Store imports ]
	import { errorStore, clearError } from '$lib/stores/errorStore';
	import { loading } from '$lib/stores/loadingStatus';

	export let data: PageData;
	export let users: App.User[] | undefined = [];

	const promotingColor = getColorValueFromCSS('--color-primary');
	const removingColor = getColorValueFromCSS('--color-error');

	const currentGroup = data.groups.find((group) => group.id === parseInt(data.groupId));

	async function promotingUser() {
		console.log('promoting user');
	}

	async function removingUser() {
		console.log('removing user');
	}

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
					{#if user.id === currentGroup?.ownerId}
						<div class="owner-badge">
							<SvgDisplay
								pathToBeDrawn="M248 80a28 28 0 1 0-51.12 15.77l-26.79 33L146 73.4a28 28 0 1 0-36.06 0l-24.03 55.34l-26.79-33a28 28 0 1 0-26.6 12L47 194.63A16 16 0 0 0 62.78 208h130.44A16 16 0 0 0 209 194.63l14.47-86.85A28 28 0 0 0 248 80M128 40a12 12 0 1 1-12 12a12 12 0 0 1 12-12M24 80a12 12 0 1 1 12 12a12 12 0 0 1-12-12m196 12a12 12 0 1 1 12-12a12 12 0 0 1-12 12"
								thisClass=""
								color={promotingColor}
								size="2rem"
							/>
						</div>
					{/if}
					<div class="buttons-container">
						{#if user.id !== data.user.id && user.id !== currentGroup?.ownerId}
							<button on:click={promotingUser}>
								<SvgDisplay
									pathToBeDrawn="M248 80a28 28 0 1 0-51.12 15.77l-26.79 33L146 73.4a28 28 0 1 0-36.06 0l-24.03 55.34l-26.79-33a28 28 0 1 0-26.6 12L47 194.63A16 16 0 0 0 62.78 208h130.44A16 16 0 0 0 209 194.63l14.47-86.85A28 28 0 0 0 248 80M128 40a12 12 0 1 1-12 12a12 12 0 0 1 12-12M24 80a12 12 0 1 1 12 12a12 12 0 0 1-12-12m169.22 112H62.78l-13.92-83.48L81.79 149a8 8 0 0 0 6.21 3a8 8 0 0 0 1.08-.07a8 8 0 0 0 6.26-4.74l29.3-67.4a27 27 0 0 0 6.72 0l29.3 67.4a8 8 0 0 0 6.26 4.74a8 8 0 0 0 1.08.07a8 8 0 0 0 6.21-3l32.93-40.52ZM220 92a12 12 0 1 1 12-12a12 12 0 0 1-12 12"
									thisClass=""
									color={promotingColor}
									size="2rem"
								/>
							</button>
							<button on:click={removingUser}>
								<SvgDisplay
									pathToBeDrawn="M232 216h-24V40a16 16 0 0 0-16-16H64a16 16 0 0 0-16 16v176H24a8 8 0 0 0 0 16h208a8 8 0 0 0 0-16M64 40h128v176H64Zm104 92a12 12 0 1 1-12-12a12 12 0 0 1 12 12"
									thisClass=""
									color={removingColor}
									size="2rem"
								/>
							</button>
						{/if}
					</div>
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
		position: relative;
		height: 4rem;
	}

	.owner-badge {
		position: absolute;
		top: -0.6rem;
		left: 2rem;
		rotate: 35deg;
	}

	.buttons-container {
		display: flex;
		justify-content: space-between;
		position: absolute;
		right: 0.5rem;
		top: 0;
	}

	button {
		border: none;
		outline: none;
		background: none;
	}
</style>
