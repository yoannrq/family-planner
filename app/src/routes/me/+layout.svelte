<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	console.log(data);
</script>

<!-- TODO essayer le Header ici -->
<nav>
	<a href="/me">Tableau de bord</a>
	<a href="/me/profile">Profil</a>
	<a href="/me/settings">Paramètres</a>
</nav>

<h1>Bienvenue, {data.name} !</h1>

<slot />
