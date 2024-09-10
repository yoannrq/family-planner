<script lang="ts">
  // [ Package imports ]

  // [ Local imports ]
  import type { PageData } from './$types';
  import { getColorValueFromCSS } from '$lib/utils/getColorValueFromCSS';
  import { goto } from '$app/navigation';
  
  // [ Component imports ]
  import CategoryHeader from '$lib/components/CategoryHeader.svelte';
  import SvgDisplay from '$lib/components/SvgDisplay.svelte';
  import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';

  // [ Store imports ]
  import { clearError, errorStore } from '$lib/stores/errorStore';
	import { addUserToGroup } from '$lib/api/group';
  import { loading } from '$lib/stores/loadingStatus';


  export let data: PageData;

  let email: string;

  const secondaryColor = getColorValueFromCSS('--color-secondary');

  async function handleSubmit() {
    clearError();
    loading.set(true);

    try {
      const isAddedToGroup = await addUserToGroup(data.groupId, email);

      if (isAddedToGroup === null) {
        loading.set(false);
        return;
      }
      email = '';
      loading.set(false);

      goto(`/me/${data.groupId}/family`);
    } catch (error: any) {
      errorStore.set({ status: error.status, message: error.message });
    }
  }
</script>

<CategoryHeader user={data.user} groupId={data.groupId} currentPage="addFamily" />

<main>
  <img src="/add-member.png" alt="Members of a family" />
	<a class="attribute" href="https://storyset.com/people">Illustration by Storyset</a>
  <form on:submit|preventDefault={handleSubmit}>
    {#if $errorStore.status > 0}
			<ErrorDisplay message={$errorStore.message} severity="warning" />
		{/if}
    <div class="input-and-icon-block">
			<SvgDisplay
				pathToBeDrawn="M224 48H32a8 8 0 0 0-8 8v136a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a8 8 0 0 0-8-8m-96 85.15L52.57 64h150.86ZM98.71 128L40 181.81V74.19Zm11.84 10.85l12 11.05a8 8 0 0 0 10.82 0l12-11.05l58 53.15H52.57ZM157.29 128L216 74.18v107.64Z"
				size="1.8rem"
				color={secondaryColor}
				thisClass=""
			/>
			<div class="input-group">
				<input type="text" bind:value={email} placeholder="Email" />
			</div>
		</div>
    {#if $loading}
		<p class="loading-bloc"></p>
    {:else}
    <button type="submit">Ajouter au groupe</button>
    {/if}
  </form>
</main>

<style>
  main {
    margin-top: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
  }

  img {
		width: 10rem; /* 160px */
	}

  .attribute {
		font-size: 0.65rem;
		color: var(--color-primary);
		margin: 0.3 0rem;
	}

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin: auto;
  }

  .input-and-icon-block {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  input {
		width: 90%;
		padding: 0.625rem; /* 10px */
		border: 0.0625rem solid var(--color-secondary); /* 1px */
		border-radius: 0.3125rem; /* 5px */
		font-size: 1rem; /* 16px */
	}

  button {
    width: 100%;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    background-color: var(--color-secondary);
		color: white;
    font-size: 1.2rem;
  }

  @keyframes pulseColor {
		0% {
			color: var(--color-primary);
		}
		50% {
			color: var(--color-secondary);
		}
		100% {
			color: var(--color-primary);
		}
	}

	@keyframes loadingDots {
		0% {
			content: 'Chargement';
		}
		25% {
			content: 'Chargement.';
		}
		50% {
			content: 'Chargement..';
		}
		75% {
			content: 'Chargement...';
		}
	}

	.loading-bloc {
		font-size: 1.5rem; /* 16px */
		width: 70%;
		animation: pulseColor 2s infinite;
    margin:auto;
	}

	.loading-bloc::after {
		content: '';
		animation: loadingDots 1.5s steps(4, end) infinite;
	}
</style>