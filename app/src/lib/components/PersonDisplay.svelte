<script lang="ts">
	// [ Package imports ]
	import { onMount } from 'svelte';

	// [ Local imports ]
	import SvgDisplay from './SvgDisplay.svelte';
	import { getColorValueFromCSS } from '$lib/utils/getColorValueFromCSS';

	// [ Store imports ]
	import { initializeColorStore, getHexCodeColor } from '$lib/stores/colorStore';

	export let person: App.Person;
	let firstTwoLetters: string | undefined;
	let personColor: string;
	let personPhone: string | undefined;
	let personName: string | undefined;

	onMount(async () => {
		await initializeColorStore();
		firstTwoLetters = person.firstname ? person.firstname.slice(0, 2) : person.name?.slice(0, 2);
		personPhone = person.phone?.replace(/\B(?=(\d{2})+(?!\d))/g, ' ');
		personName = person.firstname ? `${person.firstname} ${person.lastname}` : person.name;

		if (person.colorId) {
			personColor = getHexCodeColor(person.colorId);
		} else if (person.settingColorId) {
			personColor = getHexCodeColor(person.settingColorId);
		} else {
			personColor = getColorValueFromCSS('--color-primary');
		}
	});
</script>

<div class="person-container">
	<div class="person-avatar" style="background-color: {personColor}">{firstTwoLetters}</div>
	<div class="person-info">
		<h2 style="color: {personColor}">{personName}</h2>
		{#if person.type}
			<div class="information-container">
				<SvgDisplay
					pathToBeDrawn="M241.91 137.42L142.59 38.1a13.94 13.94 0 0 0-9.9-4.1H40a6 6 0 0 0-6 6v92.69a13.94 13.94 0 0 0 4.1 9.9l99.32 99.32a14 14 0 0 0 19.8 0l84.69-84.69a14 14 0 0 0 0-19.8m-8.49 11.31l-84.69 84.69a2 2 0 0 1-2.83 0L46.59 134.1a2 2 0 0 1-.59-1.41V46h86.69a2 2 0 0 1 1.41.59l99.32 99.31a2 2 0 0 1 0 2.83M94 84a10 10 0 1 1-10-10a10 10 0 0 1 10 10"
					thisClass=""
					color={personColor}
					size="1rem"
				/>
				<p>{person.type}</p>
			</div>
		{/if}
		{#if person.phone}
			<div class="information-container">
				<SvgDisplay
					pathToBeDrawn="m221.59 160.3l-47.24-21.17a14 14 0 0 0-13.28 1.22a5 5 0 0 0-.56.42l-24.69 21a1.88 1.88 0 0 1-1.68.06c-15.87-7.66-32.31-24-40-39.65a1.91 1.91 0 0 1 0-1.68l21.07-25a6 6 0 0 0 .42-.58a14 14 0 0 0 1.12-13.27L95.73 34.49a14 14 0 0 0-14.56-8.38A54.24 54.24 0 0 0 34 80c0 78.3 63.7 142 142 142a54.25 54.25 0 0 0 53.89-47.17a14 14 0 0 0-8.3-14.53M176 210c-71.68 0-130-58.32-130-130a42.23 42.23 0 0 1 36.67-42h.23a2 2 0 0 1 1.84 1.31l21.1 47.11a2 2 0 0 1 0 1.67l-21.11 25.06a5 5 0 0 0-.43.57a14 14 0 0 0-.91 13.73c8.87 18.16 27.17 36.32 45.53 45.19a14 14 0 0 0 13.77-1c.19-.13.38-.27.56-.42l24.68-21a1.92 1.92 0 0 1 1.6-.1l47.25 21.17a2 2 0 0 1 1.21 2A42.24 42.24 0 0 1 176 210"
					thisClass=""
					color={personColor}
					size="1rem"
				/>
				<p>{personPhone}</p>
			</div>
		{/if}
		{#if person.email}
			<div class="information-container">
				<SvgDisplay
					pathToBeDrawn="M224 48H32a8 8 0 0 0-8 8v136a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a8 8 0 0 0-8-8m-96 85.15L52.57 64h150.86ZM98.71 128L40 181.81V74.19Zm11.84 10.85l12 11.05a8 8 0 0 0 10.82 0l12-11.05l58 53.15H52.57ZM157.29 128L216 74.18v107.64Z"
					thisClass=""
					color={personColor}
					size="1rem"
				/>
				<p>{person.email}</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.person-container {
		display: flex;
		align-items: center;
		gap: 2rem;
		width: 100vw;
		margin: 0.5rem 0;
	}

	.person-avatar {
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 50%;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 1rem;
	}

	.person-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 70%;
	}

	h2 {
		font-size: 1.2rem;
		color: var(--color-text);
		margin: 0;
	}

	.information-container {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	p {
		font-size: 0.8rem;
		color: var(--color-light-text);
		margin: 0;
	}
</style>
