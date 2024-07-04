<script lang="ts">
	import { setTokens } from '$lib/auth.js';
	import { PUBLIC_URL_API } from '$env/static/public';
	import { goto } from '$app/navigation';
	import { Preferences } from '@capacitor/preferences';
	import { CapacitorHttp } from '@capacitor/core';
	import type { HttpResponse } from '@capacitor/core';

	let email = '';
	let password = '';
	let errorMessage = '';

	async function handleSubmit(event: any) {
		event.preventDefault();

		if (email === '' || password === '') {
			errorMessage = 'Please fill in all fields';
			return;
		}

		try {
			const response: HttpResponse = await CapacitorHttp.request({
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

			if (response.status === 200) {
				// Store tokens in secure and memory storage
				setTokens(response.data.accessToken, response.data.refreshToken);

				console.log('Tokens stored', response.data.accessToken, response.data.refreshToken);
				console.log('User email stored', email);
				// Store user email in preferences
				await Preferences.set({
					key: 'email',
					value: email
				});
				goto('/dashboard');
			} else {
				errorMessage = response.data.message;
			}
		} catch (error: any) {
			errorMessage = error.message;
		}
	}
</script>

<main>
	<div class="login-container">
		<h1>Family Planner</h1>
		<p>Votre outil de gestion familiale</p>
		<img src="/family_logo.png" alt="Family Planner" />
		<form on:submit={handleSubmit}>
			{#if errorMessage}
				<div class="error-message">
					<!-- TODO : add a link to the forgot password page -->
					<!-- TODO : Gérer l'affiche des erreurs zod, etc -->
					{errorMessage}
				</div>
			{/if}
			<div class="input-group">
				<label for="email">Email :</label>
				<input type="email" id="email" bind:value={email} required />
			</div>
			<div class="input-group">
				<label for="password">Mot de passe :</label>
				<input type="password" id="password" bind:value={password} required />
			</div>
			<button type="submit">Se connecter</button>
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

	button {
		background-color: var(--color-primary);
		color: white;
		border: none;
		padding: 0.75rem; /* 12px */
		border-radius: 0.3125rem; /* 5px */
		font-size: 1rem; /* 16px */
		cursor: pointer;
		transition: background-color 0.3s;
		width: 70%;
	}

	button:hover {
		background-color: var(--color-secondary);
	}

	.error-message {
		background-color: var(--color-tertiary);
		color: white;
		padding: 0.625rem; /* 10px */
		border-radius: 0.3125rem; /* 5px */
		margin-bottom: 0.9375rem; /* 15px */
		text-align: center;
	}

	.signup-link {
		text-align: center;
		margin-top: 0.9375rem; /* 15px */
	}

	.signup-link a {
		color: var(--color-primary);
		text-decoration: none;
	}
</style>
