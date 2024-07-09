<script lang="ts">
	// [ Package imports ]
	import { CapacitorHttp } from '@capacitor/core';
	import type { HttpResponse } from '@capacitor/core';

	// [ Local imports ]
	import { PUBLIC_URL_API } from '$env/static/public';
	import { goto } from '$app/navigation';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';

	let errorMessage = '';
	let email = '';
	let password = '';
	let confirmedPassword = '';
	let name = '';

	async function handleSubmit(event: any) {
		event.preventDefault();

		if (password !== confirmedPassword) {
			errorMessage = 'Passwords do not match.';
			return;
		}

		try {
			const response: HttpResponse = await CapacitorHttp.request({
				url: `${PUBLIC_URL_API}/api/auth/signup`,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					name,
					email,
					password
				}
			});

			if (response.status === 201) {
				goto('/');
			} else {
				errorMessage = response.data.err.message;
			}
		} catch (error: any) {
			errorMessage = error.message;
		}
	}
</script>

<main>
	<div class="signup-container">
		<h1>Inscription</h1>
		<form on:submit={handleSubmit}>
			{#if errorMessage}
				<!-- TODO : add a link to the forgot password page -->
				<ErrorDisplay message={errorMessage} severity="warning" />
			{/if}
			<div class="input-group">
				<label for="name">Nom d'utilisateur :</label>
				<input type="text" id="name" bind:value={name} required />
			</div>
			<div class="input-group">
				<label for="email">Email :</label>
				<input type="email" id="email" bind:value={email} required />
			</div>
			<div class="input-group">
				<label for="password">Mot de passe :</label>
				<input type="password" id="password" bind:value={password} required />
			</div>
			<div class="input-group">
				<label for="confirmed-password">Confirmation du mot de passe :</label>
				<input type="password" id="confirmed-password" bind:value={confirmedPassword} required />
			</div>
			<button type="submit">S'inscrire</button>
			<div class="login-link">
				<a href="/">Je suis déjà inscrit</a>
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

	.signup-container {
		max-width: 100%;
		padding: 1.25rem; /* 20px */
		box-sizing: border-box;
	}

	h1 {
		text-align: center;
		color: var(--color-primary);
		margin-bottom: 1.25rem; /* 20px */
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

	.login-link {
		text-align: center;
		margin-top: 0.9375rem; /* 15px */
	}

	.login-link a {
		color: var(--color-primary);
		text-decoration: none;
	}
</style>
