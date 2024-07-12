<script lang="ts">
	export let user: App.User;
	export let groups: App.Group[];
	export let groupId: string | undefined;

	const firstTwoLetters = user.name.slice(0, 2);

	// Get the current group name, using == instead of === to compare strings and numbers, using $ to make it reactive to groupId changes
	$: currentGroup = groups.find((group) => group.id == groupId);
	$: currentGroupName = currentGroup ? currentGroup.name : '';

	// TODO - Change this temporary color to a dynamic color
	const temporaryColor = '#0388fc';

	function modalGroups() {
		const section = document.querySelector('.modal-groups');
		if (!section) return;
		section.classList.toggle('hidden');
	}
</script>

<header>
	<a href="/me/profile" class="personal-avatar">{firstTwoLetters}</a>
	{#key groupId}
		<h1 class="current-group">{currentGroupName}</h1>
	{/key}
	<button on:click={modalGroups}
		><img src="/group.png" alt="Show groups list" class="icon" /></button
	>
</header>
<section class="hidden modal-groups">
	<ul class="group-list">
		{#each groups as group}
			<li style="background-color: {temporaryColor}20">
				<a href={`/me/${group.id}/dashboard`} on:click={modalGroups}>
					<div class="group-color" style="background-color: {temporaryColor}"></div>
					{group.name}
				</a>
			</li>
		{/each}
		<li class="border-bottom-curved">
			<a href="/me/add-group">
				<img src="/add-group.png" alt="Create new group" class="icon" />Créer un groupe
			</a>
		</li>
	</ul>
</section>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 1rem;
		background-color: var(--color-background);
	}

	.personal-avatar {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		background-color: var(--color-primary);
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.current-group {
		display: inline-block;
		font-weight: bold;
		font-size: 1.5rem;
	}

	header button {
		background-color: transparent;
		border: none;
	}

	.icon {
		width: 1.5rem;
		height: 1.5rem;
	}

	.modal-groups {
		position: absolute;
		top: 3rem;
		left: 0;
		right: 0;
		width: 100%;
	}

	.hidden {
		display: none;
	}

	.group-list {
		list-style: none;
		background-color: #f9f9fb;
		padding: 0;
	}

	.group-list li {
		border-bottom: 0.0625rem solid var(--color-primary);
		padding-left: 3rem;
	}

	.group-list li a {
		display: flex;
		align-items: center;
		padding: 1rem;
		text-decoration: none;
		font-size: 1.25rem;
		color: var(--color-text);
	}

	.group-color {
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		display: inline-block;
		margin-right: 0.5rem;
	}

	.border-bottom-curved {
		border-bottom-left-radius: 1rem;
		border-bottom-right-radius: 1rem;
	}
</style>
