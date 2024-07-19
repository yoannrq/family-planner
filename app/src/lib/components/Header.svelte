<script lang="ts">
	// [ Package imports ]
	import { onMount } from 'svelte';

	// [ Local imports ]
	import { initializeColorStore, getHexCodeColor } from '$lib/stores/colorStore';
	import SvgDisplay from './SvgDisplay.svelte';

	export let user: App.User;
	export let groups: App.Group[];
	export let groupId: string | undefined;

	const firstTwoLetters = user.name.slice(0, 2);
	const userColor = getHexCodeColor(user.settingColorId);

	// Get the current group name, using $ to make it reactive to groupId changes
	$: currentGroup = groups.find((group) => group.id.toString() === groupId);
	$: currentGroupName = currentGroup ? currentGroup.name : '';

	function modalGroups() {
		const section = document.querySelector('.modal-groups');
		if (!section) return;
		section.classList.toggle('hidden');
	}

	onMount(async () => {
		await initializeColorStore();
	});
</script>

<header>
	<a href="/me/profile" class="personal-avatar" style="background-color: {userColor}"
		>{firstTwoLetters}</a
	>
	{#key groupId}
		<h1 class="current-group">{currentGroupName}</h1>
	{/key}
	<button on:click={modalGroups}>
		<SvgDisplay
			pathToBeDrawn="M64.12 147.8a4 4 0 0 1-4 4.2H16a8 8 0 0 1-7.8-6.17a8.35 8.35 0 0 1 1.62-6.93A67.8 67.8 0 0 1 37 117.51a40 40 0 1 1 66.46-35.8a3.94 3.94 0 0 1-2.27 4.18A64.08 64.08 0 0 0 64 144c0 1.28 0 2.54.12 3.8m182-8.91A67.76 67.76 0 0 0 219 117.51a40 40 0 1 0-66.46-35.8a3.94 3.94 0 0 0 2.27 4.18A64.08 64.08 0 0 1 192 144c0 1.28 0 2.54-.12 3.8a4 4 0 0 0 4 4.2H240a8 8 0 0 0 7.8-6.17a8.33 8.33 0 0 0-1.63-6.94Zm-89 43.18a48 48 0 1 0-58.37 0A72.13 72.13 0 0 0 65.07 212A8 8 0 0 0 72 224h112a8 8 0 0 0 6.93-12a72.15 72.15 0 0 0-33.74-29.93Z"
			thisClass=""
			size="1.8rem"
			color={userColor}
		/>
	</button>
</header>
<section class="hidden modal-groups">
	<ul class="group-list">
		{#each groups as group}
			<li style="background-color: {getHexCodeColor(group.colorId)}20">
				<a href={`/me/${group.id}/dashboard`} on:click={modalGroups}>
					<div class="group-color" style="background-color: {getHexCodeColor(group.colorId)}"></div>
					{group.name}
				</a>
			</li>
		{/each}
		<li class="border-bottom-curved">
			<a href="/me/add-group">
				<SvgDisplay
					pathToBeDrawn="M120 80a40 40 0 1 1-40-40a40 40 0 0 1 40 40m56 40a40 40 0 1 0-40-40a40 40 0 0 0 40 40m-96 16a40 40 0 1 0 40 40a40 40 0 0 0-40-40m128 32h-24v-24a8 8 0 0 0-16 0v24h-24a8 8 0 0 0 0 16h24v24a8 8 0 0 0 16 0v-24h24a8 8 0 0 0 0-16"
					thisClass=""
					size="1.8rem"
					color={userColor}
				/>
				Créer un groupe
			</a>
		</li>
	</ul>
</section>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 1rem;
		background-color: var(--color-background);
	}

	.personal-avatar {
		width: 2.1rem;
		height: 2.1rem;
		border-radius: 50%;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.current-group {
		display: inline-block;
		font-weight: bold;
		font-size: 1.5rem;
	}

	header button {
		background-color: transparent;
		border: none;
	}

	.modal-groups {
		position: absolute;
		top: 3rem;
		left: 0;
		right: 0;
		width: 100%;
	}

	.hidden {
		display: none;
	}

	.group-list {
		list-style: none;
		background-color: #f9f9fb;
		padding: 0;
	}

	.group-list li {
		border-bottom: 0.0625rem solid var(--color-primary);
		padding-left: 3rem;
	}

	.group-list li a {
		display: flex;
		align-items: center;
		padding: 1rem;
		text-decoration: none;
		font-size: 1.25rem;
		color: var(--color-text);
	}

	.group-color {
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		display: inline-block;
		margin-right: 0.5rem;
	}

	.border-bottom-curved {
		border-bottom-left-radius: 1rem;
		border-bottom-right-radius: 1rem;
	}
</style>
