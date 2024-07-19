<script lang="ts">
	// [ Package imports ]

	// [ Local imports ]
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { errorStore, clearError } from '$lib/stores/errorStore';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import { updateMe } from '$lib/api/me';
	import { setPreferencesObject } from '$lib/auth';
	import SvgDisplay from '$lib/components/SvgDisplay.svelte';

	export let data: PageData;

	let userColor = '#a7beae';
	let name = data.user.name;
	let password = '';
	let confirmedPassword = '';
	let updatedUser: App.User | null = null;

	const firstTwoLetters = data.user.name.slice(0, 2);

	function goToProfile() {
		goto('/me/profile');
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		clearError();

		if (password !== confirmedPassword) {
			errorStore.set({ status: 400, message: 'Passwords do not match.' });
			return;
		}

		try {
			updatedUser = await updateMe(name, password);

			if (updatedUser === null) {
				return;
			}

			// Store user email, name and profil picture URL in Preferences storage
			setPreferencesObject('user', {
				email: updatedUser.email,
				name: updatedUser.name,
				profilePictureUrl: updatedUser.profilePictureUrl
			});

			clearError();
			goto('/me/profile');
			return;
		} catch (error: any) {
			errorStore.set({ status: error.status, message: error.message });
		}
	}
</script>

<header>
	<button on:click={goToProfile}>
		<SvgDisplay
			pathToBeDrawn="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"
			thisClass=""
			size="1.65rem"
			color={userColor}
		/>
	</button>
	<h1>Éditer mon profil</h1>
	<button type="submit" form="edit-profile">
		<SvgDisplay
			pathToBeDrawn="M229.66 77.66l-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69L218.34 66.34a8 8 0 0 1 11.32 11.32"
			thisClass=""
			size="1.65rem"
			color={userColor}
		/>
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
			<SvgDisplay
				pathToBeDrawn="M172 120a44 44 0 1 1-44-44a44 44 0 0 1 44 44m60 8A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88.09 88.09 0 0 0-91.47-87.93C77.43 41.89 39.87 81.12 40 128.25a87.65 87.65 0 0 0 22.24 58.16A79.7 79.7 0 0 1 84 165.1a4 4 0 0 1 4.83.32a59.83 59.83 0 0 0 78.28 0a4 4 0 0 1 4.83-.32a79.7 79.7 0 0 1 21.79 21.31A87.62 87.62 0 0 0 216 128"
				size="1.8rem"
				color={userColor}
				thisClass=""
			/>
			<div class="input-group">
				<label for="name">Nom :</label>
				<input type="text" id="name" bind:value={name} required />
			</div>
		</div>
		<div class="input-and-icon-block">
			<SvgDisplay
				pathToBeDrawn="M208 82H94V56a34 34 0 0 1 34-34c16.3 0 31 11.69 34.12 27.19a6 6 0 0 0 11.76-2.38C169.55 25.48 150.26 10 128 10a46.06 46.06 0 0 0-46 46v26H48a14 14 0 0 0-14 14v112a14 14 0 0 0 14 14h160a14 14 0 0 0 14-14V96a14 14 0 0 0-14-14m2 126a2 2 0 0 1-2 2H48a2 2 0 0 1-2-2V96a2 2 0 0 1 2-2h160a2 2 0 0 1 2 2Zm-82-94a26 26 0 0 0-6 51.29V184a6 6 0 0 0 12 0v-18.71a26 26 0 0 0-6-51.29m0 40a14 14 0 1 1 14-14a14 14 0 0 1-14 14"
				size="1.8rem"
				color={userColor}
				thisClass=""
			/>
			<div class="input-group">
				<label for="password">Mot de passe :</label>
				<input type="password" id="password" bind:value={password} />
			</div>
		</div>
		<div class="input-and-icon-block">
			<SvgDisplay
				pathToBeDrawn="M208 82h-34V56a46 46 0 0 0-92 0v26H48a14 14 0 0 0-14 14v112a14 14 0 0 0 14 14h160a14 14 0 0 0 14-14V96a14 14 0 0 0-14-14M94 56a34 34 0 0 1 68 0v26H94Zm116 152a2 2 0 0 1-2 2H48a2 2 0 0 1-2-2V96a2 2 0 0 1 2-2h160a2 2 0 0 1 2 2Zm-82-94a26 26 0 0 0-6 51.29V184a6 6 0 0 0 12 0v-18.71a26 26 0 0 0-6-51.29m0 40a14 14 0 1 1 14-14a14 14 0 0 1-14 14"
				size="1.8rem"
				color={userColor}
				thisClass=""
			/>
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
