<script lang="ts">
	// [ Package imports ]
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';

	// [ Local imports ]
	import type { PageData } from './$types';
	import { getPreferencesObject, setPreferencesObject } from '$lib/auth';
	import { getColors } from '$lib/api/color';

	// [ Component imports ]
	import CategoryHeader from '$lib/components/CategoryHeader.svelte';
	import SvgDisplay from '$lib/components/SvgDisplay.svelte';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';

	// [ Store imports ]
	import { getHexCodeColor } from '$lib/stores/colorStore';
	import { clearError, errorStore } from '$lib/stores/errorStore';
	import { calendarSelectedDateStore } from '$lib/stores/calendarSelectedDateStore';

	export let data: PageData;

	let error: App.ErrorInfo;
	let colors: App.Color[] | null = [];
	let title: App.CalendarEntry['title'];
	let description: App.CalendarEntry['description'];
	let date: App.CalendarEntry['date'];
	let endDate: typeof date;
	let startTime: App.CalendarEntry['startTime'] = dayjs().format('HH:mm');
	let endTime: App.CalendarEntry['endTime'] = dayjs().add(1, 'hour').format('HH:mm');
	let entireDay: App.CalendarEntry['entireDay'] = false;
	let location: App.CalendarEntry['location'];
	let colorId: App.CalendarEntry['colorId'] = 1;

	const userColor = getHexCodeColor(data.user.settingColorId);

	errorStore.subscribe((value) => {
		error = value;
	});

	async function handleSubmit() {
		clearError();
	}

	onMount(async () => {
		clearError();
		// Get colors from Preferences storage, if not found, get them from the API
		let response: App.Color[] | null = await getPreferencesObject('colors');
		if (!response) {
			const colorsFromApi = await getColors();
			setPreferencesObject('colors', colorsFromApi);
			response = colorsFromApi;
		}
		colors = response;

		// Get the selected date from the store
		if ($calendarSelectedDateStore) {
			date = dayjs($calendarSelectedDateStore.date).format('YYYY-MM-DD');
		} else {
			date = dayjs().format('YYYY-MM-DD');
		}
		endDate = date;

		// Set the user color to the css variable
		const root = document.documentElement;
		root.style.setProperty('--color-user-color', userColor);
	});
</script>

<CategoryHeader user={data.user} groupId={data.groupId} currentPage="addCalendar" />

<main>
	<form on:submit|preventDefault={handleSubmit}>
		{#if $errorStore.status > 0}
			<ErrorDisplay message={$errorStore.message} severity="warning" />
		{/if}
		<div class="input-and-icon-block">
			<SvgDisplay
				pathToBeDrawn="M200.77 53.89A103.27 103.27 0 0 0 128 24h-1.07A104 104 0 0 0 24 128c0 43 26.58 79.06 69.36 94.17A32 32 0 0 0 136 192a16 16 0 0 1 16-16h46.21a31.81 31.81 0 0 0 31.2-24.88a104.4 104.4 0 0 0 2.59-24a103.28 103.28 0 0 0-31.23-73.23M84 168a12 12 0 1 1 12-12a12 12 0 0 1-12 12m0-56a12 12 0 1 1 12-12a12 12 0 0 1-12 12m44-24a12 12 0 1 1 12-12a12 12 0 0 1-12 12m44 24a12 12 0 1 1 12-12a12 12 0 0 1-12 12"
				size="1.8rem"
				color={userColor}
				thisClass=""
			/>
			<div class="input-group">
				<label for="color">Couleur :</label>
				<div class="color-picker">
					{#if colors}
						{#each colors as color}
							{#if color.id === colorId}
								<button
									class="color-to-pick"
									style="background-color: {color.hexCode};border: 0.25rem solid {color.hexCode}"
									on:click={() => (colorId = color.id)}
								></button>
							{:else}
								<button
									class="color-to-pick"
									style="background-color: var(--color-background);border: 0.25rem solid {color.hexCode}"
									on:click={() => (colorId = color.id)}
								></button>
							{/if}
						{/each}
					{/if}
				</div>
				<input class="input-color-picker" type="text" id="color" bind:value={colorId} required />
			</div>
		</div>
		<div class="input-and-icon-block">
			<SvgDisplay
				pathToBeDrawn="M248 92.68a15.86 15.86 0 0 0-4.69-11.31l-68.68-68.69a16 16 0 0 0-22.63 0l-28.43 28.43l-58 21.77a16.06 16.06 0 0 0-10.22 12.35L32.11 214.68A8 8 0 0 0 40 224a8.4 8.4 0 0 0 1.32-.11l139.44-23.24a16 16 0 0 0 12.35-10.17l21.77-58L243.31 104A15.87 15.87 0 0 0 248 92.68m-69.87 92.19L63.32 204l47.37-47.37a28 28 0 1 0-11.32-11.32L52 192.7L71.13 77.86L126 57.29L198.7 130ZM112 132a12 12 0 1 1 12 12a12 12 0 0 1-12-12m96-15.32L139.31 48l24-24L232 92.68Z"
				size="1.8rem"
				color={userColor}
				thisClass=""
			/>
			<div class="input-group">
				<input type="text" bind:value={title} placeholder="Titre" required />
			</div>
		</div>
		<div class="input-and-icon-block">
			<SvgDisplay
				pathToBeDrawn="M224 48H32a16 16 0 0 0-16 16v128a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16m0 144H32V64h192zM48 136a8 8 0 0 1 8-8h16a8 8 0 0 1 0 16H56a8 8 0 0 1-8-8m160 0a8 8 0 0 1-8 8h-96a8 8 0 0 1 0-16h96a8 8 0 0 1 8 8m-48 32a8 8 0 0 1-8 8H56a8 8 0 0 1 0-16h96a8 8 0 0 1 8 8m48 0a8 8 0 0 1-8 8h-16a8 8 0 0 1 0-16h16a8 8 0 0 1 8 8"
				size="1.8rem"
				color={userColor}
				thisClass=""
			/>
			<div class="input-group">
				<input type="text" bind:value={description} placeholder="Description" />
			</div>
		</div>
		<div class="input-and-icon-block">
			<div class="input-group">
				<label for="entireDay" class="toggle-container">
					Journée entière
					<input type="checkbox" id="entireDay" bind:value={entireDay} />
					<span class="toggle"></span>
				</label>
			</div>
		</div>
		<div class="input-and-icon-block">
			<SvgDisplay
				pathToBeDrawn="M200 224h-49.46A267 267 0 0 0 174 200.25c27.45-31.57 42-64.85 42-96.25a88 88 0 0 0-176 0c0 31.4 14.51 64.68 42 96.25A267 267 0 0 0 105.46 224H56a8 8 0 0 0 0 16h144a8 8 0 0 0 0-16M56 104a72 72 0 0 1 144 0c0 57.23-55.47 105-72 118c-16.53-13-72-60.77-72-118m112 0a40 40 0 1 0-40 40a40 40 0 0 0 40-40m-64 0a24 24 0 1 1 24 24a24 24 0 0 1-24-24"
				size="1.8rem"
				color={userColor}
				thisClass=""
			/>
			<div class="input-group">
				<input type="text" bind:value={location} placeholder="Emplacement" />
			</div>
		</div>
		<div class="input-and-icon-block">
			<div class="input-group">
				<div class="same-line-input">
					<input type="date" bind:value={date} required />
					<input type="time" bind:value={startTime} />
				</div>
				<div class="same-line-input">
					<input type="date" bind:value={endDate} />
					<input type="time" bind:value={endTime} />
				</div>
			</div>
		</div>
		<button type="submit">Ajouter</button>
	</form>
</main>

<style>
	main {
		margin-top: 2.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: auto;
	}

	.input-and-icon-block {
		display: flex;
		align-items: center;
	}

	.input-group {
		margin-left: 1rem;
	}

	.same-line-input {
		display: flex;
		align-items: center;
		white-space: nowrap;
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

	input[type='date'],
	input[type='time'] {
		border: none;
		background: transparent;
		color: inherit;
		font-size: 1rem;
		padding: 0.625rem;
	}

	.color-picker {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.5rem;
	}

	.color-to-pick {
		width: 2rem; /* 32px */
		height: 2rem;
		border-radius: 50%;
	}

	.input-color-picker {
		display: none;
	}

	button {
		border: none;
		background-color: var(--color-secondary);
		color: var(--color-background);
		padding: 0.625rem; /* 10px */
		border-radius: 0.3125rem; /* 5px */
		font-size: 1.2rem;
	}

	/* Toggle Style */
	#entireDay {
		display: none;
	}

	.toggle-container {
		display: flex;
		align-items: center;
	}

	.toggle {
		position: relative;
		width: 50px;
		height: 25px;
		background: var(--color-light-text);
		border-radius: 25px;
		transition: background 0.3s;
		margin-left: 10px;
	}

	.toggle:before {
		content: '';
		position: absolute;
		width: 20px;
		height: 20px;
		background: white;
		border-radius: 50%;
		transition: transform 0.3s;
		transform: translateX(2.1px);
		top: 50%;
		margin-top: -10px;
	}

	#entireDay:checked + .toggle {
		background: var(--color-user-color);
	}

	#entireDay:checked + .toggle:before {
		transform: translateX(25px);
	}
</style>
