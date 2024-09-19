<script lang="ts">
	// [ Package imports ]
	import { onMount } from 'svelte';

	// [ Local imports ]
	import { goto } from '$app/navigation';
	import { getHexCodeColor } from '$lib/stores/colorStore';

	export let currentPage: string;
	export let groupId: string | undefined;
	export let settingColorId: number;

	let settingColor: string = '';

	function handleClick() {
		const direction = `/me/${groupId}/${currentPage}/add-${currentPage}`;
		goto(direction);
	}

	onMount(() => {
		settingColor = getHexCodeColor(settingColorId);
	});
</script>

<button class="floating-button" style="background-color: {settingColor}" on:click={handleClick}>
	<span class="plus-icon">+</span>
</button>

<style>
	.floating-button {
		position: fixed;
		bottom: 1.25rem;
		right: 1.25rem;
		width: 3.75rem;
		height: 3.75rem;
		border-radius: 50%;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		border: none;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
		z-index: 100;
	}

	.plus-icon {
		font-size: 2.125rem;
	}
</style>
