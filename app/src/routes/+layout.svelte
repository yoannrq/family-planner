<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		refreshAccessToken,
		getRefreshToken,
		clearTokens,
		isTokenExpired,
		accessToken
	} from '$lib/auth.js';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	let isLogged: boolean = false;

	// [ Function ] - Check if both tokens are still valid
	async function checkAndRefreshTokens() {
		const currentAccessToken = get(accessToken);
		const refreshToken = await getRefreshToken();

		if (isTokenExpired(currentAccessToken)) {
			if (refreshToken && !isTokenExpired(refreshToken)) {
				// Only access token is expired, we can get another one
				const success = await refreshAccessToken();

				if (!success) {
					// Failed to get a new access token
					await clearTokens();
					goto('/');
				}
			} else {
				// Both tokens are expired
				await clearTokens();
				goto('/');
			}
		}

		isLogged = !!$accessToken;
	}

	function checkAuth() {
		const currentPath = $page.url.pathname;

		if (!isLogged && !['/', '/inscription'].includes(currentPath)) {
			goto('/');
		} else if (isLogged && ['/', '/inscription'].includes(currentPath)) {
			goto('/dashboard');
		}
	}

	onMount(() => {
		const unsubscribe = accessToken.subscribe(async () => {
			await checkAndRefreshTokens();
			checkAuth();
		});

		return unsubscribe;
	});
</script>

<slot />

<style>
	:global(:root) {
		--color-primary: #8aaae5;
		--color-deep-primary: #2f3c7e;
		--color-secondary: #a7beae;
		--color-tertiary: #f98866;
		--color-text: #333333;
		--color-background: #fcf6f5;

		font-family: Arial, sans-serif;
		margin: 0;
		padding: 0;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family: Arial, sans-serif;
		background-color: var(--color-background);
		color: var(--color-text);
	}
</style>
