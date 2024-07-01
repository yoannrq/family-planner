<script lang="ts">
	import Clerk from '@clerk/clerk-js';
	import PUBLIC_CLERK_PUBLISHABLE_KEY from '$env/static/public';

	const clerk = new Clerk();
</script>

{#if $isLoaded}
	<slot />
{:else}
	<p>Loading...</p>
{/if}
