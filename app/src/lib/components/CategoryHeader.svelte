<script lang="ts">
	// [ Package imports ]
	import { onMount } from 'svelte';

	// [ Local imports ]
	import SvgDisplay from './SvgDisplay.svelte';
	import { initializeColorStore, getHexCodeColor } from '$lib/stores/colorStore';

	export let user: App.User;
	export let groupId: string | undefined;
	export let categoryName: string;

	const userColor = getHexCodeColor(user.settingColorId);

	onMount(async () => {
		await initializeColorStore();
	});
</script>

<header>
	<a href="/me/{groupId}/dashboard">
		<SvgDisplay
			pathToBeDrawn="M224 120v96a8 8 0 0 1-8 8h-56a8 8 0 0 1-8-8v-52a4 4 0 0 0-4-4h-40a4 4 0 0 0-4 4v52a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8v-96a16 16 0 0 1 4.69-11.31l80-80a16 16 0 0 1 22.62 0l80 80A16 16 0 0 1 224 120"
			thisClass=""
			size="1.8rem"
			color={userColor}
		/>
	</a>
	<h1 style="color: {userColor}">{categoryName}</h1>
</header>

<style>
	header {
		display: flex;
		justify-content: left;
		align-items: center;
		padding: 0 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		position: relative;
		z-index: 100;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: 500;
		margin-left: 4rem;
	}

	a {
		text-decoration: none;
		color: inherit;
	}
</style>
