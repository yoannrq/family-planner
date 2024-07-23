<script lang="ts">
	// [ Package imports ]
	import { page } from '$app/stores';

	// [ Local imports ]
	import DashboardBlock from '$lib/components/DashboardBlock.svelte';
	import type { PageData } from './$types';
	import { getHexCodeColor, initializeColorStore } from '$lib/stores/colorStore';

	export let data: PageData;

	$: groupId = $page.params.groupId;
	const userColor = getHexCodeColor(data.user.settingColorId);

	const dashboardItems = [
		{
			title: 'Listes',
			attribute: 'list',
			description: 'Simplifiez votre quotidien en gérant vos courses et tâches en famille.',
			svgPathToBeDraw:
				'M208 32H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16m-90.34 117.66l-32 32a8 8 0 0 1-11.32 0l-16-16a8 8 0 0 1 11.32-11.32L80 164.69l26.34-26.35a8 8 0 0 1 11.32 11.32m0-64l-32 32a8 8 0 0 1-11.32 0l-16-16a8 8 0 0 1 11.32-11.32L80 100.69l26.34-26.35a8 8 0 0 1 11.32 11.32M192 168h-48a8 8 0 0 1 0-16h48a8 8 0 0 1 0 16m0-64h-48a8 8 0 0 1 0-16h48a8 8 0 0 1 0 16'
		},
		{
			title: 'Calendrier',
			attribute: 'calendar',
			description: "Synchronisez les agendas familiaux pour ne rien manquer d'important.",
			svgPathToBeDraw:
				'M208 32h-24v-8a8 8 0 0 0-16 0v8H88v-8a8 8 0 0 0-16 0v8H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M84 184a12 12 0 1 1 12-12a12 12 0 0 1-12 12m44 0a12 12 0 1 1 12-12a12 12 0 0 1-12 12m0-40a12 12 0 1 1 12-12a12 12 0 0 1-12 12m44 40a12 12 0 1 1 12-12a12 12 0 0 1-12 12m0-40a12 12 0 1 1 12-12a12 12 0 0 1-12 12m36-64H48V48h24v8a8 8 0 0 0 16 0v-8h80v8a8 8 0 0 0 16 0v-8h24Z'
		},
		{
			title: 'Messages',
			attribute: 'message',
			description: 'Communiquez facilement avec tous les membres de votre famille.',
			svgPathToBeDraw:
				'M232.07 186.76a80 80 0 0 0-62.5-114.17a80 80 0 1 0-145.64 66.17l-7.27 24.71a16 16 0 0 0 19.87 19.87l24.71-7.27a80.4 80.4 0 0 0 25.18 7.35a80 80 0 0 0 108.34 40.65l24.71 7.27a16 16 0 0 0 19.87-19.86Zm-16.25 1.47L224 216l-27.76-8.17a8 8 0 0 0-6 .63a64.05 64.05 0 0 1-85.87-24.88a79.93 79.93 0 0 0 70.33-93.87a64 64 0 0 1 41.75 92.48a8 8 0 0 0-.63 6.04'
		},
		{
			title: 'Emploi du temps',
			attribute: 'schedule',
			description: 'Coordonnez vos activités en partageant vos plannings.',
			svgPathToBeDraw:
				'M232 48h-72a40 40 0 0 0-32 16a40 40 0 0 0-32-16H24a8 8 0 0 0-8 8v144a8 8 0 0 0 8 8h72a24 24 0 0 1 24 24a8 8 0 0 0 16 0a24 24 0 0 1 24-24h72a8 8 0 0 0 8-8V56a8 8 0 0 0-8-8M96 192H32V64h64a24 24 0 0 1 24 24v112a39.8 39.8 0 0 0-24-8m128 0h-64a39.8 39.8 0 0 0-24 8V88a24 24 0 0 1 24-24h64ZM160 88h40a8 8 0 0 1 0 16h-40a8 8 0 0 1 0-16m48 40a8 8 0 0 1-8 8h-40a8 8 0 0 1 0-16h40a8 8 0 0 1 8 8m0 32a8 8 0 0 1-8 8h-40a8 8 0 0 1 0-16h40a8 8 0 0 1 8 8'
		},
		{
			title: 'Contacts',
			attribute: 'contact',
			description: 'Accédez rapidement aux coordonnées importantes pour toute la famille.',
			svgPathToBeDraw:
				'M172 120a44 44 0 1 1-44-44a44 44 0 0 1 44 44m52-72v160a16 16 0 0 1-16 16H48a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16m-16 160V48H48v160h3.67a80.6 80.6 0 0 1 26.07-38.25q3.08-2.48 6.36-4.62a4 4 0 0 1 4.81.33a59.82 59.82 0 0 0 78.18 0a4 4 0 0 1 4.81-.33q3.28 2.15 6.36 4.62A80.6 80.6 0 0 1 204.33 208z'
		},
		{
			title: 'Ma Famille',
			attribute: 'family',
			description: 'Gérez les profils de chaque membre de votre famille.',
			svgPathToBeDraw:
				'M230.4 219.19A8 8 0 0 1 224 232H32a8 8 0 0 1-6.4-12.8A67.9 67.9 0 0 1 53 197.51a40 40 0 1 1 53.93 0a67.4 67.4 0 0 1 21 14.29a67.4 67.4 0 0 1 21-14.29a40 40 0 1 1 53.93 0a67.85 67.85 0 0 1 27.54 21.68M27.2 126.4a8 8 0 0 0 11.2-1.6a52 52 0 0 1 83.2 0a8 8 0 0 0 12.8 0a52 52 0 0 1 83.2 0a8 8 0 0 0 12.8-9.61A67.85 67.85 0 0 0 203 93.51a40 40 0 1 0-53.93 0a67.4 67.4 0 0 0-21 14.29a67.4 67.4 0 0 0-21-14.29a40 40 0 1 0-53.93 0A67.9 67.9 0 0 0 25.6 115.2a8 8 0 0 0 1.6 11.2'
		}
	];
</script>

<main>
	<section class="information-container">
		<h1>Bienvenue sur votre tableau de bord</h1>
	</section>
	<section class="block-list-container">
		{#key groupId}
		{#each dashboardItems as block}
			<DashboardBlock
				pathToBeDrawn={block.svgPathToBeDraw}
				color={userColor}
				size="3rem"
				thisClass=""
				blockTitle={block.title}
				blockAttribute={block.attribute}
				{groupId}
			/>
		{/each}
		{/key}
	</section>
</main>

<style>
	.information-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 12rem;
		padding: 0.6rem;
		margin: 0.6rem;
		border-radius: 0.5rem;
		background-color: var(--color-tertiary);
		box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
	}

	.block-list-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto;
		grid-gap: 0.6rem;
		padding: 0.6rem;
	}
</style>
