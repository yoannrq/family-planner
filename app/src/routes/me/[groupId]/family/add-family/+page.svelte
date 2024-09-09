<script lang="ts">
  // [ Package imports ]

  // [ Local imports ]
  import type { PageData } from './$types';

  
  // [ Component imports ]
  import CategoryHeader from '$lib/components/CategoryHeader.svelte';
  import SvgDisplay from '$lib/components/SvgDisplay.svelte';
  import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';

  // [ Store imports ]
  import { getHexCodeColor } from '$lib/stores/colorStore';
  import { clearError, errorStore } from '$lib/stores/errorStore';

  export let data: PageData;

  let email: string;

  const userColor = getHexCodeColor(data.user.settingColorId);

  async function handleSubmit() {
    clearError();

    try {
      // Add the user to the group
      // await addFamilyMember(data.groupId, email);
      // Clear the email input
      email = '';
    } catch (error: any) {
      errorStore.set({ status: error.status, message: error.message });
    }
  }
</script>

<CategoryHeader user={data.user} groupId={data.groupId} currentPage="addFamily" />

<main>
  <form on:submit|preventDefault={handleSubmit}>
    {#if $errorStore.status > 0}
			<ErrorDisplay message={$errorStore.message} severity="warning" />
		{/if}
    <div class="input-and-icon-block">
			<SvgDisplay
				pathToBeDrawn="M224 48H32a8 8 0 0 0-8 8v136a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a8 8 0 0 0-8-8m-96 85.15L52.57 64h150.86ZM98.71 128L40 181.81V74.19Zm11.84 10.85l12 11.05a8 8 0 0 0 10.82 0l12-11.05l58 53.15H52.57ZM157.29 128L216 74.18v107.64Z"
				size="1.8rem"
				color={userColor}
				thisClass=""
			/>
			<div class="input-group">
				<input type="text" bind:value={email} placeholder="Email" />
			</div>
		</div>

    <button type="submit">Ajouter au groupe</button>
  </form>
</main>

<style>
  main {
    margin-top: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
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
    padding: 0.5rem;
    border: 1px solid var(--color-light-text);
    border-radius: 0.5rem;
    background-color: var(--color-deep-background);
    color: var(--color-light-text);
  }

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    background-color: var(--color-light-text);
    color: var(--color-deep-background);
    font-weight: bold;
  }
</style>