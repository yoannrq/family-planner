<script lang="ts">
  // [ Package imports ]

  // [ Local imports ]
  import type { PageData } from './$types';
  
  // [ Component imports ]
  import CategoryHeader from '$lib/components/CategoryHeader.svelte';

  // [ Store imports ]

  export let data: PageData;

</script>

<CategoryHeader user={data.user} groupId={data.groupId} currentPage="addFamily" />

<main>
  <h2>Test</h2>
</main>

<style>

</style>