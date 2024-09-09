<script lang="ts">
	// [ Package imports ]
	import { onMount } from 'svelte';

	// [ Local imports ]
	import type { PageData } from './$types';
	import { getGroupByIdWithUsers, updateGroup, removeUserFromGroup } from '$lib/api/group.js';
	import { getColorValueFromCSS } from '$lib/utils/getColorValueFromCSS';
	import { getUserGroups } from '$lib/api/group.js';
	import { setPreferencesObject } from '$lib/auth.js';
	import { goto } from '$app/navigation';

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

	$: currentGroup = data.groups.find((group) => group.id === parseInt(data.groupId));

	/**
	 * @function getGroupByIdAndUpdateGroupData
	 * @summary Fetches a group by ID and updates group and user data.
	 * @param {string} groupId - The ID of the group to fetch and update.
	 * @returns {Promise<void>}
	 */
	async function getGroupByIdAndUpdateGroupData(groupId: string): Promise<void> {
		const groupWithUsers = await getGroupByIdWithUsers(groupId);
		// Update the group data with the new group data
		if (groupWithUsers) {
			data.groups = data.groups.map((group) => {
				if (group.id === parseInt(groupId)) {
					return groupWithUsers;
				}
				return group;
			});
		}
		// Update the users with the new users
		users = groupWithUsers?.users;
	}

	async function promotingUser(clickedUserId: number) {
		clearError();
		loading.set(true);

		await updateGroup(parseInt(data.groupId), undefined, undefined, clickedUserId);
		await getGroupByIdAndUpdateGroupData(data.groupId);

		loading.set(false);
	}

	async function removingUser(clickedUserId: number) {
		clearError();
		loading.set(true);

		await removeUserFromGroup(parseInt(data.groupId), clickedUserId);
		await getGroupByIdAndUpdateGroupData(data.groupId);

		loading.set(false);
	}

	async function leavingCurrentGroup(clickedUserId: number) {
		clearError();
		loading.set(true);

		const isRemoved = await removeUserFromGroup(parseInt(data.groupId), clickedUserId);

		if (!isRemoved) {
			loading.set(false);
			return;
		}
		// Update Preferences groups data
		const groups: App.Group[] = await getUserGroups();
		setPreferencesObject('groups', groups);

		const groupId = groups[0].id;
		loading.set(false);

		goto(`/me/${groupId}/dashboard`);
	}

	onMount(async () => {
		clearError();
		loading.set(true);

		await getGroupByIdAndUpdateGroupData(data.groupId);
		loading.set(false);
	});
</script>

<CategoryHeader user={data.user} groupId={data.groupId} currentPage="family" />

<main>
	{#if $errorStore.status > 0}
		<ErrorDisplay message={$errorStore.message} severity="warning" />
	{/if}
	{#if $loading}
		<p class="loading-bloc"></p>
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
						{#if data.user.id === currentGroup?.ownerId && user.id !== currentGroup?.ownerId}
							<button on:click={() => promotingUser(user.id)}>
								<SvgDisplay
									pathToBeDrawn="M248 80a28 28 0 1 0-51.12 15.77l-26.79 33L146 73.4a28 28 0 1 0-36.06 0l-24.03 55.34l-26.79-33a28 28 0 1 0-26.6 12L47 194.63A16 16 0 0 0 62.78 208h130.44A16 16 0 0 0 209 194.63l14.47-86.85A28 28 0 0 0 248 80M128 40a12 12 0 1 1-12 12a12 12 0 0 1 12-12M24 80a12 12 0 1 1 12 12a12 12 0 0 1-12-12m169.22 112H62.78l-13.92-83.48L81.79 149a8 8 0 0 0 6.21 3a8 8 0 0 0 1.08-.07a8 8 0 0 0 6.26-4.74l29.3-67.4a27 27 0 0 0 6.72 0l29.3 67.4a8 8 0 0 0 6.26 4.74a8 8 0 0 0 1.08.07a8 8 0 0 0 6.21-3l32.93-40.52ZM220 92a12 12 0 1 1 12-12a12 12 0 0 1-12 12"
									thisClass=""
									color={promotingColor}
									size="2rem"
								/>
							</button>
							<button on:click={() => removingUser(user.id)}>
								<SvgDisplay
									pathToBeDrawn="M232 216h-24V40a16 16 0 0 0-16-16H64a16 16 0 0 0-16 16v176H24a8 8 0 0 0 0 16h208a8 8 0 0 0 0-16M64 40h128v176H64Zm104 92a12 12 0 1 1-12-12a12 12 0 0 1 12 12"
									thisClass=""
									color={removingColor}
									size="2rem"
								/>
							</button>
						{:else if data.user.id === user.id && user.id !== currentGroup?.ownerId}
							<button on:click={() => leavingCurrentGroup(user.id)}>
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

	@keyframes pulseColor {
		0% {
			color: var(--color-primary);
		}
		50% {
			color: var(--color-secondary);
		}
		100% {
			color: var(--color-primary);
		}
	}

	@keyframes loadingDots {
		0% {
			content: 'Chargement des membres de la famille';
		}
		25% {
			content: 'Chargement des membres de la famille.';
		}
		50% {
			content: 'Chargement des membres de la famille..';
		}
		75% {
			content: 'Chargement des membres de la famille...';
		}
	}

	.loading-bloc {
		font-size: 1.5rem; /* 16px */
		width: 70%;
		animation: pulseColor 2s infinite;
	}

	.loading-bloc::after {
		content: '';
		animation: loadingDots 1.5s steps(4, end) infinite;
	}
</style>
