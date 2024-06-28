<script lang="ts">
</script>

<main>
	<div class="login-container">
		<h1>Family Planner</h1>
		<p>Votre outil de gestion familial</p>
		<img src="/family_logo.png" alt="Family Planner" />
		<div class="login-link">
			<a href="/login">Se connecter</a>
		</div>
		<div class="signup-link">
			<a href="/signup">S'inscrire</a>
		</div>
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
		display: flex;
		flex-direction: column;
		align-items: center;
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

	.login-link {
		background-color: var(--color-primary);
		color: white;
		border: none;
		padding: 0.75rem; /* 12px */
		border-radius: 0.3125rem; /* 5px */
		font-size: 1rem; /* 16px */
		cursor: pointer;
		transition: background-color 0.3s;
		width: 70%;
		text-align: center;
	}

	.login-link a {
		text-decoration: none;
		color: white;
	}

	.login-link:hover {
		background-color: var(--color-secondary);
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
