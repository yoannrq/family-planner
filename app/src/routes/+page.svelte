<script lang="ts">
	// [ Package imports ]
	import { CapacitorHttp } from '@capacitor/core';

	// [ Local imports ]
	import { setToken, setPreferencesObject, getToken } from '$lib/auth.js';
	import { PUBLIC_URL_API } from '$env/static/public';
	import { goto } from '$app/navigation';
	import { getUserGroups } from '$lib/api/group';

	// [ Component imports ]
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';

	// [ Store imports ]
	import { initializeColorStore } from '$lib/stores/colorStore';
	import { clearError } from '$lib/stores/errorStore';
	import { loading } from '$lib/stores/loadingStatus';

	let email: string;
	let password: string;
	let errorMessage: string;
	let severity: 'info' | 'warning' | 'error';

	async function handleSubmit() {
		clearError();
		loading.set(true);

		try {
			const { status, data } = await CapacitorHttp.request({
				url: `${PUBLIC_URL_API}/api/auth/login`,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					email,
					password
				}
			});
			loading.set(false);

			if (status === 200) {
				// Store tokens in secure storage
				setToken('access', data.accessToken);
				setToken('refresh', data.refreshToken);

				// Store user informations in Preferences storage
				setPreferencesObject('user', {
					id: data.id,
					email: data.email,
					name: data.name,
					profilePictureUrl: data.profilpictureUrl,
					settingColorId: data.settingColorId
				});

				const groups: App.Group[] = await getUserGroups();

				if (groups.length === 0) {
					errorMessage = "You don't have any group.";
					severity = 'info';
					return;
				}

				// Store user groups in Preferences storage
				setPreferencesObject('groups', groups);

				// Initialize the color store
				initializeColorStore();

				const groupId = groups[0].id;

				goto(`/me/${groupId}/dashboard`);
			} else {
				errorMessage = data.message;
				severity = 'warning';
			}
		} catch (error: any) {
			loading.set(false);
			errorMessage = error.message || 'Server error';
			severity = 'error';
		}
	}
</script>

<main>
	<div class="login-container">
		<h1>Family Planner</h1>
		<p>Votre outil de gestion familiale</p>
		<img src="/family_logo.png" alt="Family Planner" />
		<form on:submit|preventDefault={handleSubmit}>
			{#if errorMessage}
				<!-- TODO : add a link to the forgot password page -->
				<ErrorDisplay message={errorMessage} {severity} />
			{/if}
			<div class="input-group">
				<label for="email">Email :</label>
				<input type="email" id="email" bind:value={email} required />
			</div>
			<div class="input-group">
				<label for="password">Mot de passe :</label>
				<input type="password" id="password" bind:value={password} required />
			</div>
			{#if $loading}
				<button class="loading-button" disabled></button>
			{:else}
				<button class="submit-button" type="submit">Se connecter</button>
			{/if}
			<div class="signup-link">
				<a href="/signup">S'inscrire</a>
			</div>
		</form>
	</div>
</main>

<style>
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	.login-container {
		max-width: 100%;
		padding: 1.25rem; /* 20px */
		box-sizing: border-box;
	}

	h1 {
		text-align: center;
		color: var(--color-primary);
		margin-bottom: 1.25rem; /* 20px */
	}

	p {
		text-align: center;
		color: var(--color-deep-primary);
		margin-bottom: 1.25rem; /* 20px */
	}

	img {
		display: block;
		margin: 0 auto;
		margin-bottom: 1.25rem; /* 20px */
		max-width: 100%;
		height: 5rem; /* 80px */
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.input-group {
		margin-bottom: 0.9375rem; /* 15px */
	}

	label {
		display: block;
		margin-bottom: 0.3125rem; /* 5px */
		font-weight: bold;
	}

	input {
		width: 100%;
		padding: 0.625rem; /* 10px */
		border: 0.0625rem solid var(--color-deep-primary); /* 1px */
		border-radius: 0.3125rem; /* 5px */
		font-size: 1rem; /* 16px */
	}

	.submit-button {
		background-color: var(--color-primary);
		color: white;
		border: none;
		padding: 0.75rem; /* 12px */
		border-radius: 0.3125rem; /* 5px */
		font-size: 1rem; /* 16px */
		width: 70%;
	}

	.signup-link {
		text-align: center;
		margin-top: 0.9375rem; /* 15px */
	}

	.signup-link a {
		color: var(--color-primary);
		text-decoration: none;
	}

	@keyframes pulseColor {
		0% {
			background-color: var(--color-primary);
		}
		50% {
			background-color: var(--color-secondary);
		}
		100% {
			background-color: var(--color-primary);
		}
	}

	@keyframes loadingDots {
		0% {
			content: 'Connexion';
		}
		25% {
			content: 'Connexion.';
		}
		50% {
			content: 'Connexion..';
		}
		75% {
			content: 'Connexion...';
		}
	}

	.loading-button {
		color: white;
		border: none;
		padding: 0.75rem; /* 12px */
		border-radius: 0.3125rem; /* 5px */
		font-size: 1rem; /* 16px */
		width: 70%;
		animation: pulseColor 2s infinite;
	}

	.loading-button::after {
		content: '';
		animation: loadingDots 1.5s steps(4, end) infinite;
	}
</style>
