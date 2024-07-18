<script lang="ts">
	// [ Package imports ]

	// [ Local imports ]
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { errorStore, clearError } from '$lib/stores/errorStore';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';

	export let data: PageData;

	let name = data.user.name;
	let email = data.user.email;
	let password = '';
	let confirmedPassword = '';

	const firstTwoLetters = data.user.name.slice(0, 2);

	function goToProfile() {
		goto('/me/profile');
	}

	function handleSubmit(event: Event) {
		event.preventDefault();
		clearError();

		if (password !== confirmedPassword) {
			errorStore.set({ status: 400, message: 'Passwords do not match.' });
			return;
		}

		// TODO : call the API to update the user's profile

		clearError();
		return;
	}
</script>

<header>
	<button on:click={goToProfile}>
		<img src="/close.png" alt="Back to Profile" class="icon" />
	</button>
	<h1>Éditer mon profil</h1>
	<button type="submit" form="edit-profile">
		<img src="/check.png" alt="Edit profil" class="icon" />
	</button>
</header>
<section>
	{#if data.user.profilePictureUrl}
		<!-- TODO gérer la gestion de l'image de profil -->
		<img src={data.user.profilePictureUrl} alt="Profile" />
	{:else}
		<div class="personal-avatar">{firstTwoLetters}</div>
	{/if}
	<form on:submit={handleSubmit} id="edit-profile">
		{#if $errorStore.status > 0}
			<ErrorDisplay message={$errorStore.message} severity="warning" />
		{/if}
		<div class="input-and-icon-block">
			<img src="/user-circle-edit.png" alt="User" />
			<div class="input-group">
				<label for="name">Nom :</label>
				<input type="text" id="name" bind:value={name} required />
			</div>
		</div>
		<div class="input-and-icon-block">
			<img src="/mail-edit.png" alt="Email" />
			<div class="input-group">
				<label for="email">Email :</label>
				<input type="email" id="email" bind:value={email} required />
			</div>
		</div>
		<div class="input-and-icon-block">
			<img src="/lock-off-edit.png" alt="Password" />
			<div class="input-group">
				<label for="password">Mot de passe :</label>
				<input type="password" id="password" bind:value={password} />
			</div>
		</div>
		<div class="input-and-icon-block">
			<img src="/lock-on-edit.png" alt="Password confirmation" />
			<div class="input-group">
				<label for="confirmed-password">Confirmation du mot de passe :</label>
				<input type="password" id="confirmed-password" bind:value={confirmedPassword} />
			</div>
		</div>
	</form>
</section>

<style>
	header {
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 3rem;
		width: 100%;
		padding: 1rem 0;
		background-color: var(--color-secondary);
	}

	header button {
		background-color: var(--color-background);
		padding: 0.5rem;
		border: none;
		border-radius: 50%;
	}

	header h1 {
		font-size: 1.3rem;
		color: white;
	}

	.icon {
		width: 1.5rem;
		height: 1.5rem;
	}

	.personal-avatar {
		width: 7rem; /* 112px */
		height: 7rem;
		border-radius: 50%;
		background-color: var(--color-secondary);
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.5rem;
		color: white;
		font-size: 2rem;
		margin: 3rem auto;
	}

	section {
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	section img {
		width: 5rem; /* 80px */
		height: 5rem;
		border-radius: 50%;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 0 auto;
	}

	form img {
		width: 1.65rem;
		height: 1.65rem;
	}

	.input-and-icon-block {
		display: flex;
		align-items: center;
	}

	.input-group {
		margin-left: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.3125rem; /* 5px */
		font-weight: bold;
	}

	input {
		width: 90%;
		padding: 0.625rem; /* 10px */
		border: 0.0625rem solid var(--color-secondary); /* 1px */
		border-radius: 0.3125rem; /* 5px */
		font-size: 1rem; /* 16px */
	}
</style>
