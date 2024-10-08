<script lang="ts">
	// [ Package imports ]
	import { onMount } from 'svelte';

	// [ Local imports ]
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { getPreferencesObject, setPreferencesObject } from '$lib/auth';
	import { getColors } from '$lib/api/color';
	import { updateContact } from '$lib/api/contact';
	import { getColorValueFromCSS } from '$lib/utils/getColorValueFromCSS';

	// [ Component imports ]
	import SvgDisplay from '$lib/components/SvgDisplay.svelte';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import CategoryHeader from '$lib/components/CategoryHeader.svelte';

	// [ Store imports ]
	import { contactStore } from '$lib/stores/contactStore';
	import { errorStore, clearError } from '$lib/stores/errorStore';

	export let data: PageData;

	let error: App.ErrorInfo;
	let editColor: App.Color['hexCode'] = '';
	let colors: App.Color[] | null = [];
	let colorId: App.Contact['colorId'] = $contactStore.colorId;
	let firstname: App.Contact['firstname'] = $contactStore.firstname;
	let lastname: App.Contact['lastname'] = $contactStore.lastname;
	let phone: App.Contact['phone'] = $contactStore.phone;
	let email: App.Contact['email'] = $contactStore.email;
	let address: App.Contact['address'] = $contactStore.address;
	let type: App.Contact['type'] = $contactStore.type;
	let content: App.Contact['content'] = $contactStore.content;

	const firstTwoLetters = $contactStore.firstname.slice(0, 2);

	errorStore.subscribe((value) => {
		error = value;
	});

	function goToContactList() {
		clearError();
		goto(`/me/${data.groupId}/contact`);
	}

	async function handleSubmit() {
		clearError();

		if (data.groupId !== $contactStore.groupId.toString()) {
			errorStore.set({
				status: 403,
				message: "You don't have the permission to update this contact"
			});
			return;
		}

		try {
			const updatedContact: App.Contact | null = await updateContact({
				id: $contactStore.id,
				firstname,
				lastname,
				phone,
				email,
				address,
				type,
				content,
				colorId,
				groupId: $contactStore.groupId,
				createdAt: $contactStore.createdAt
			});

			if (updatedContact === null) {
				return;
			}

			goToContactList();
			return;
		} catch (error: any) {
			errorStore.set({ status: error.status, message: error.message });
		}
	}

	onMount(async () => {
		clearError();
		let response: App.Color[] | null = await getPreferencesObject('colors');

		if (!response) {
			const colorsFromApi = await getColors();
			setPreferencesObject('colors', colorsFromApi);
			response = colorsFromApi;
		}

		colors = response;
		editColor = getColorValueFromCSS('--color-tertiary');
	});
</script>

<CategoryHeader user={data.user} groupId={data.groupId} currentPage="editContact" />

<main>
	{#if $contactStore.profilePictureUrl}
		<!-- TODO gérer la gestion de l'image de profil -->
		<img src={$contactStore.profilePictureUrl} alt="Profile" />
	{:else}
		<div class="personal-avatar">{firstTwoLetters}</div>
	{/if}
	<form on:submit|preventDefault={handleSubmit} id="edit-contact">
		{#if $errorStore.status > 0}
			<ErrorDisplay message={$errorStore.message} severity="warning" />
		{/if}
		<div class="input-and-icon-block">
			<SvgDisplay
				pathToBeDrawn="M200.77 53.89A103.27 103.27 0 0 0 128 24h-1.07A104 104 0 0 0 24 128c0 43 26.58 79.06 69.36 94.17A32 32 0 0 0 136 192a16 16 0 0 1 16-16h46.21a31.81 31.81 0 0 0 31.2-24.88a104.4 104.4 0 0 0 2.59-24a103.28 103.28 0 0 0-31.23-73.23M84 168a12 12 0 1 1 12-12a12 12 0 0 1-12 12m0-56a12 12 0 1 1 12-12a12 12 0 0 1-12 12m44-24a12 12 0 1 1 12-12a12 12 0 0 1-12 12m44 24a12 12 0 1 1 12-12a12 12 0 0 1-12 12"
				size="1.8rem"
				color={editColor}
				thisClass=""
			/>
			<div class="input-group">
				<label for="color">Couleur du contact :</label>
				<div class="color-picker">
					{#if colors}
						{#each colors as color}
							{#if color.id === colorId}
								<button
									class="color-to-pick"
									style="background-color: {color.hexCode};border: 0.25rem solid {color.hexCode}"
									on:click|preventDefault={() => (colorId = color.id)}
								></button>
							{:else}
								<button
									class="color-to-pick"
									style="background-color: var(--color-background);border: 0.25rem solid {color.hexCode}"
									on:click|preventDefault={() => (colorId = color.id)}
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
				pathToBeDrawn="M172 120a44 44 0 1 1-44-44a44 44 0 0 1 44 44m60 8A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88.09 88.09 0 0 0-91.47-87.93C77.43 41.89 39.87 81.12 40 128.25a87.65 87.65 0 0 0 22.24 58.16A79.7 79.7 0 0 1 84 165.1a4 4 0 0 1 4.83.32a59.83 59.83 0 0 0 78.28 0a4 4 0 0 1 4.83-.32a79.7 79.7 0 0 1 21.79 21.31A87.62 87.62 0 0 0 216 128"
				size="1.8rem"
				color={editColor}
				thisClass=""
			/>
			<div class="input-group">
				<input type="text" id="firstname" bind:value={firstname} placeholder="Prénom" required />
			</div>
		</div>
		<div class="input-and-icon-block">
			<SvgDisplay
				pathToBeDrawn="M172 120a44 44 0 1 1-44-44a44 44 0 0 1 44 44m60-64v144a16 16 0 0 1-16 16H40a16 16 0 0 1-16-16V56a16 16 0 0 1 16-16h176a16 16 0 0 1 16 16m-16 144V56H40v144h14.68a80 80 0 0 1 29.41-34.84a4 4 0 0 1 4.83.31a59.82 59.82 0 0 0 78.16 0a4 4 0 0 1 4.83-.31A80 80 0 0 1 201.32 200z"
				size="1.8rem"
				color={editColor}
				thisClass=""
			/>
			<div class="input-group">
				<input type="text" id="lastname" bind:value={lastname} placeholder="Nom" required />
			</div>
		</div>
		<div class="input-and-icon-block">
			<SvgDisplay
				pathToBeDrawn="M231.88 175.08A56.26 56.26 0 0 1 176 224C96.6 224 32 159.4 32 80a56.26 56.26 0 0 1 48.92-55.88a16 16 0 0 1 16.62 9.52l21.12 47.15v.12A16 16 0 0 1 117.39 96c-.18.27-.37.52-.57.77L96 121.45c7.49 15.22 23.41 31 38.83 38.51l24.34-20.71a8 8 0 0 1 .75-.56a16 16 0 0 1 15.17-1.4l.13.06l47.11 21.11a16 16 0 0 1 9.55 16.62"
				size="1.8rem"
				color={editColor}
				thisClass=""
			/>
			<div class="input-group">
				<input type="text" id="phone" bind:value={phone} placeholder="Téléphone" required />
			</div>
		</div>
		<div class="input-and-icon-block">
			<SvgDisplay
				pathToBeDrawn="M224 48H32a8 8 0 0 0-8 8v136a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a8 8 0 0 0-8-8m-96 85.15L52.57 64h150.86ZM98.71 128L40 181.81V74.19Zm11.84 10.85l12 11.05a8 8 0 0 0 10.82 0l12-11.05l58 53.15H52.57ZM157.29 128L216 74.18v107.64Z"
				size="1.8rem"
				color={editColor}
				thisClass=""
			/>
			<div class="input-group">
				<input type="text" id="email" bind:value={email} placeholder="Email" required />
			</div>
		</div>
		<div class="input-and-icon-block">
			<SvgDisplay
				pathToBeDrawn="M240 208h-16v-72l2.34 2.34A8 8 0 0 0 237.66 127l-98.35-98.32a16 16 0 0 0-22.62 0L18.34 127a8 8 0 0 0 11.32 11.31L32 136v72H16a8 8 0 0 0 0 16h224a8 8 0 0 0 0-16m-88 0h-48v-48a4 4 0 0 1 4-4h40a4 4 0 0 1 4 4Z"
				size="1.8rem"
				color={editColor}
				thisClass=""
			/>
			<div class="input-group">
				<input type="text" id="address" bind:value={address} placeholder="Adresse" required />
			</div>
		</div>
		<div class="input-and-icon-block">
			<SvgDisplay
				pathToBeDrawn="M241.91 137.42L142.59 38.1a13.94 13.94 0 0 0-9.9-4.1H40a6 6 0 0 0-6 6v92.69a13.94 13.94 0 0 0 4.1 9.9l99.32 99.32a14 14 0 0 0 19.8 0l84.69-84.69a14 14 0 0 0 0-19.8m-8.49 11.31l-84.69 84.69a2 2 0 0 1-2.83 0L46.59 134.1a2 2 0 0 1-.59-1.41V46h86.69a2 2 0 0 1 1.41.59l99.32 99.31a2 2 0 0 1 0 2.83M94 84a10 10 0 1 1-10-10a10 10 0 0 1 10 10"
				size="1.8rem"
				color={editColor}
				thisClass=""
			/>
			<div class="input-group">
				<input type="text" id="type" bind:value={type} placeholder="Étiquette" required />
			</div>
		</div>
		<div class="input-and-icon-block">
			<SvgDisplay
				pathToBeDrawn="m211.84 134.81l-59.79 60.47a15.75 15.75 0 0 1-11.2 4.68H75.32l-29.66 29.7a8 8 0 0 1-11.32-11.32l22.59-22.58L124.7 128H209a4 4 0 0 1 2.84 6.81m4.86-104.24a64 64 0 0 0-85.9 4.14l-9.6 9.48A4 4 0 0 0 120 47v63l55-55a8 8 0 0 1 11.31 11.31L140.71 112h88.38a4 4 0 0 0 3.56-2.16a64.08 64.08 0 0 0-15.95-79.27M62.83 167.23L104 126.06v-55.3a4 4 0 0 0-6.81-2.84L60.69 104A15.9 15.9 0 0 0 56 115.31v49.09a4 4 0 0 0 6.83 2.83"
				size="1.8rem"
				color={editColor}
				thisClass=""
			/>
			<div class="input-group">
				<input type="text" id="content" bind:value={content} placeholder="Note" required />
			</div>
		</div>
		<button type="submit">Modifier</button>
	</form>
</main>

<style>
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
		margin: 1rem auto;
		background-color: var(--color-tertiary);
	}

	main {
		margin-top: 1rem;
		margin-bottom: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	main img {
		width: 5rem; /* 80px */
		height: 5rem;
		border-radius: 50%;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 0 auto;
	}

	.input-and-icon-block {
		display: flex;
		align-items: center;
	}

	.input-group {
		margin-left: 1rem;
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
		background-color: var(--color-primary);
		color: var(--color-background);
		padding: 0.625rem; /* 10px */
		border-radius: 0.3125rem; /* 5px */
		font-size: 1.2rem;
	}
</style>
