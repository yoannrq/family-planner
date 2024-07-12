<script lang="ts">
  import type { PageData } from './$types';

export let data: PageData;
</script>

<h1>Hello dashboard</h1>
<h2>Bienvenue, {data.user.name} !</h2>