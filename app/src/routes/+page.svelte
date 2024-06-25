<script lang="ts">
	import { PUBLIC_URL_API } from '$env/static/public';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let errorMessage = '';

	function handleSubmit(event) {
		event.preventDefault();

		fetch(`${PUBLIC_URL_API}/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		})
			.then((response) => response.json())
			.then((data) => {
				goto('/dashboard');
			})
			.catch((error) => {
				errorMessage = error.message || 'An error occurred';
			});
	}

	onMount(() => {
		// Code to run when the component is mounted
	});
</script>

<main>
	<div class="login-container">
		<h1>Family Planner</h1>
		<p>Votre outil de gestion familiale</p>
		<img src="/family_logo.png" alt="Family Planner" />
		<form on:submit={handleSubmit}>
			{#if errorMessage}
				<div class="error-message">
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
