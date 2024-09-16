<script lang="ts">
	// [ Package imports ]
	import { onMount } from 'svelte';

	// [ Local imports ]

	// [ Component imports ]
	import SvgDisplay from './SvgDisplay.svelte';

	// [ Store imports ]
	import { initializeColorStore, getHexCodeColor } from '$lib/stores/colorStore';

	export let user: App.User;
	export let groupId: string | undefined;
	export let currentPage:
		| 'family'
		| 'addFamily'
		| 'contact'
		| 'addContact'
		| 'editContact'
		| 'calendar';

	type ScopeTypes = 'display' | 'creation';
	type HeaderParamType = {
		categoryName: string;
		scope: ScopeTypes;
		paramUrl?: string;
	};

	let scope: ScopeTypes;
	let categoryName: string;
	let paramUrl: string | undefined;

	const userColor = getHexCodeColor(user.settingColorId);
	const headerParams: Record<typeof currentPage, HeaderParamType> = {
		family: {
			categoryName: 'Ma Famille',
			scope: 'display'
		},
		addFamily: {
			categoryName: 'Ajouter un membre',
			scope: 'creation',
			paramUrl: 'family'
		},
		contact: {
			categoryName: 'Contacts',
			scope: 'display'
		},
		addContact: {
			categoryName: 'Ajouter un contact',
			scope: 'creation',
			paramUrl: 'contact'
		},
		editContact: {
			categoryName: 'Modifier un contact',
			scope: 'creation' as ScopeTypes,
			paramUrl: 'contact'
		},
		calendar: {
			categoryName: 'Calendrier',
			scope: 'display'
		}
	};

	onMount(async () => {
		await initializeColorStore();
		// find all the params for the header with the current page value
		const headerParam = headerParams[currentPage];
		// set the category name, scope and param url based on the headerParam
		categoryName = headerParam.categoryName;
		scope = headerParam.scope;
		paramUrl = headerParam.paramUrl;
	});
</script>

<header>
	{#if scope === 'display'}
		<a href="/me/{groupId}/dashboard">
			<SvgDisplay
				pathToBeDrawn="M224 120v96a8 8 0 0 1-8 8h-56a8 8 0 0 1-8-8v-52a4 4 0 0 0-4-4h-40a4 4 0 0 0-4 4v52a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8v-96a16 16 0 0 1 4.69-11.31l80-80a16 16 0 0 1 22.62 0l80 80A16 16 0 0 1 224 120"
				thisClass=""
				size="1.8rem"
				color={userColor}
			/>
		</a>
	{:else if scope === 'creation'}
		<a href="/me/{groupId}/{paramUrl}">
			<SvgDisplay
				pathToBeDrawn="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"
				thisClass=""
				size="1.8rem"
				color={userColor}
			/>
		</a>
	{/if}
	<h1 style="color: {userColor}">{categoryName}</h1>
</header>

<style>
	header {
		display: flex;
		justify-content: left;
		align-items: center;
		padding: 0 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		position: relative;
		z-index: 100;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: 500;
		margin-left: 3rem;
	}

	a {
		text-decoration: none;
		color: inherit;
	}
</style>
