<script lang="ts">
	// [ Package imports ]

	// [ Local imports ]
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { clearPreferencesObjectAndSecureStorage, setToken } from '$lib/auth.js';
	import SvgDisplay from '$lib/components/SvgDisplay.svelte';
	import { getHexCodeColor } from '$lib/stores/colorStore';

	export let data: PageData;

	const userColor = getHexCodeColor(data.user.settingColorId);
	const firstTwoLetters = data.user.name.slice(0, 2);

	function goToDashboard() {
		goto(`/me/${data.groupId || data.groups[0].id}/dashboard`);
	}

	function goToEditProfile() {
		goto('/me/profile/edit');
	}

	async function logout() {
		await clearPreferencesObjectAndSecureStorage();
		goto('/');
	}
</script>

<header style="background-color: {userColor}">
	<button on:click={goToDashboard}>
		<SvgDisplay
			pathToBeDrawn="M224 120v96a8 8 0 0 1-8 8h-56a8 8 0 0 1-8-8v-52a4 4 0 0 0-4-4h-40a4 4 0 0 0-4 4v52a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8v-96a16 16 0 0 1 4.69-11.31l80-80a16 16 0 0 1 22.62 0l80 80A16 16 0 0 1 224 120"
			color={userColor}
			size="1.65rem"
			thisClass=""
		/>
	</button>
	<h1>Profil de {data.user.name}</h1>
	<button on:click={goToEditProfile}>
		<SvgDisplay
			pathToBeDrawn="M227.31 73.37l-44.68-44.69a16 16 0 0 0-22.63 0L36.69 152A15.86 15.86 0 0 0 32 163.31V208a16 16 0 0 0 16 16h44.69a15.86 15.86 0 0 0 11.31-4.69L227.31 96a16 16 0 0 0 0-22.63M51.31 160l90.35-90.35l16.68 16.69L68 176.68ZM48 179.31L76.69 208H48Zm48 25.38L79.31 188l90.35-90.35l16.68 16.69Z"
			color={userColor}
			size="1.65rem"
			thisClass=""
		/>
	</button>
</header>
<section>
	{#if data.user.profilePictureUrl}
		<!-- TODO gérer la gestion de l'image de profil -->
		<img src={data.user.profilePictureUrl} alt="Profile" />
	{:else}
		<div class="personal-avatar" style="background-color: {userColor}">{firstTwoLetters}</div>
	{/if}
	<h2>Informations personnelles</h2>
	<ul>
		<li>
			<SvgDisplay
				pathToBeDrawn="M172 120a44 44 0 1 1-44-44a44.05 44.05 0 0 1 44 44m60 8A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88.09 88.09 0 0 0-91.47-87.93C77.43 41.89 39.87 81.12 40 128.25a87.65 87.65 0 0 0 22.24 58.16A79.7 79.7 0 0 1 84 165.1a4 4 0 0 1 4.83.32a59.83 59.83 0 0 0 78.28 0a4 4 0 0 1 4.83-.32a79.7 79.7 0 0 1 21.79 21.31A87.62 87.62 0 0 0 216 128"
				color={userColor}
				size="1.8rem"
				thisClass=""
			/>
			<p>{data.user.name}</p>
		</li>
		<li>
			<SvgDisplay
				pathToBeDrawn="M104 152a8 8 0 0 1-8 8H56a8 8 0 0 1 0-16h40a8 8 0 0 1 8 8m64-120h24a8 8 0 0 0 0-16h-32a8 8 0 0 0-8 8v32h16Zm72 84v60a16 16 0 0 1-16 16h-88v32a8 8 0 0 1-16 0v-32H32a16 16 0 0 1-16-16v-60a60.07 60.07 0 0 1 60-60h76v88a8 8 0 0 0 16 0V56h12a60.07 60.07 0 0 1 60 60m-120 0a44 44 0 0 0-88 0v60h88Z"
				color={userColor}
				size="1.8rem"
				thisClass=""
			/>
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
