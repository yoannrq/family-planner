<script lang="ts">
	// [ Package imports ]

	// [ Local imports ]
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { clearPreferencesObject, setToken } from '$lib/auth.js';
	import { set } from 'zod';

	export let data: PageData;

	const firstTwoLetters = data.user.name.slice(0, 2);

	function goToDashboard() {
		goto(`/me/${data.groupId || data.groups[0].id}/dashboard`);
	}

	function goToEditProfile() {
		goto('/me/profile/edit');
	}

	async function logout() {
		await clearPreferencesObject();
		await setToken('access', '');
		await setToken('refresh', '');
		goto('/');
	}
</script>

<header>
	<button on:click={goToDashboard}>
		<img src="/home.png" alt="Back to Dashboard" class="icon" />
	</button>
	<h1>Profil de {data.user.name}</h1>
	<button on:click={goToEditProfile}>
		<img src="/edit.png" alt="Edit profil" class="icon" />
	</button>
</header>
<section>
	{#if data.user.profilePictureUrl}
		<!-- TODO gérer la gestion de l'image de profil -->
		<img src={data.user.profilePictureUrl} alt="Profile" />
	{:else}
		<div class="personal-avatar">{firstTwoLetters}</div>
	{/if}
	<h2>Informations personnelles</h2>
	<ul>
		<li>
			<img src="/user-circle.png" alt="User" />
			<p>{data.user.name}</p>
		</li>
		<li>
			<img src="/mail.png" alt="Email" />
			<p>{data.user.email}</p>
		</li>
	</ul>
	<button on:click={logout} class="logout">
		<img src="/logout.png" alt="Logout" class="icon" />
		<p>Se déconnecter</p>
	</button>
</section>

<style>
	header {
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 3rem;
		width: 100%;
		padding: 1rem 0;
		background-color: var(--color-primary);
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
		background-color: var(--color-primary);
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

	section h2 {
		font-size: 1.15rem;
		color: var(--color-text);
	}

	section img {
		width: 5rem; /* 80px */
		height: 5rem;
		border-radius: 50%;
	}

	section ul {
		list-style: none;
		padding: 0;
	}

	section li {
		display: flex;
		align-items: center;
		margin: 0.5rem;
	}

	section li img {
		width: 1.65rem;
		height: 1.65rem;
	}

	section li p {
		margin-left: 1rem;
		font-size: 1.1rem;
	}

	.logout {
		background-color: transparent;
		color: var(--color-error);
		padding: 0.5rem 1rem;
		border: none;
		display: flex;
		align-items: center;
		font-size: 1.1rem;
	}

	.logout img {
		width: 1.65rem;
		height: 1.65rem;
		margin-right: 1rem;
	}
</style>
