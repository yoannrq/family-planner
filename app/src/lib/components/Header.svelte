<script lang="ts">
	export let user: App.User;
	export let groups: App.Group[];
	const firstTwoLetters = user.name.slice(0, 2).toUpperCase;
</script>

<header>
	<div class="personal-avatar">{firstTwoLetters}</div>
	<div>{groups}</div>
</header>

<style></style>
