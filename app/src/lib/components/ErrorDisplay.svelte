<script lang="ts">
	import { goto } from '$app/navigation';

	export let message: string;
	export let severity: 'info' | 'warning' | 'error' = 'error';
</script>

<div class="error-container {severity}">
	<p>{message}</p>
	{#if severity === 'error'}
		<button on:click={() => goto('/login')}>Recharger la page</button>
	{/if}
</div>

<style>
	.error-container {
		color: white;
		padding: 0.625rem; /* 10px */
		border-radius: 0.3125rem; /* 5px */
		margin-bottom: 0.9375rem; /* 15px */
		text-align: center;
	}
	.info {
		background-color: var(--color-info);
	}
	.warning {
		background-color: var(--color-tertiary);
	}
	.error {
		background-color: var(--color-error);
	}
</style>
