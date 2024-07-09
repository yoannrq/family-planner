<script lang="ts">
</script>

<slot />

<style>
	:global(:root) {
		--color-primary: #8aaae5;
		--color-deep-primary: #2f3c7e;
		--color-secondary: #a7beae;
		--color-tertiary: #f98866;
		--color-info: #4a90e2;
		--color-error: #e74c3c;
		--color-text: #333333;
		--color-background: #fcf6f5;

		font-family: Arial, sans-serif;
		margin: 0;
		padding: 0;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family: Arial, sans-serif;
		background-color: var(--color-background);
		color: var(--color-text);
	}
</style>
