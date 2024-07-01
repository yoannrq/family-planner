<script lang="ts">
	import SignIn from 'clerk-sveltekit/client/SignIn.svelte';
</script>

<section>
	<div>
		<SignIn redirectUrl="/dashboard" />
	</div>
</section>

<style>
	section {
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
