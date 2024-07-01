<script lang="ts">
	import SignUp from 'clerk-sveltekit/client/SignUp.svelte';
</script>

<section>
	<div>
		<SignUp redirectUrl="/dashboard" />
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
