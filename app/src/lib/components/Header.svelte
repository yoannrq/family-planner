<script lang="ts">
	export let user: App.User;
	export let groups: App.Group[];
	const firstTwoLetters = user.name.slice(0, 2);
</script>

<header>
	<div class="personal-avatar">{firstTwoLetters}</div>
	<div>{groups[0].name}</div>
	<div>{groups[1].name}</div>
</header>

<style></style>
