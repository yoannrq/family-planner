<script lang="ts">
	// [ Local imports ]
	import SvgDisplay from '$lib/components/SvgDisplay.svelte';

	export let pathToBeDrawn: string;
	export let color: string;
	export let size: string;
	export let thisClass: string;

	export let blockTitle: string;
	export let blockAttribute: string;

	export let groupId: string | undefined;

	const blockRedirectUrl = `/me/${groupId}/dashboard/${blockAttribute}`;
</script>

<a href={blockRedirectUrl}>
	<div>
		<SvgDisplay {pathToBeDrawn} {color} {size} {thisClass} />
		<h3>{blockTitle}</h3>
	</div>
</a>

<style>
	a {
		text-decoration: none;
	}

	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0.6rem;
		border-radius: 0.5rem;
		background-color: var(--color-background);
		box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
	}

	h3 {
		font-size: 1.1rem;
		margin: 0.6 0rem;
		color: var(--color-text);
	}
</style>
