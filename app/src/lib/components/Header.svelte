<script lang="ts">
	export let user: App.User;
	const firstTwoLetters = user.name.slice(0, 2).toUpperCase;
</script>

<header>
	<div class="personal-avatar">{firstTwoLetters}</div>
</header>

<style></style>
