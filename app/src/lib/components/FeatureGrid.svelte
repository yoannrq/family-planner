<script lang="ts">
	const features = [
		{ name: 'Listes', icon: '📋', count: '4 listes' },
		{ name: 'Calendrier', icon: '📅', count: '4 événements ce mois-ci' },
		{ name: 'Documents', icon: '📁', description: 'Stockez vos documents importants' },
		{ name: 'Repas', icon: '🍽️', description: 'Planifiez vos repas' },
		{ name: 'Emploi du Temps', icon: '⏰', description: 'Partagez vos plannings' },
		{ name: 'Recettes', icon: '🍳', description: 'Aucune recette' },
		{ name: 'Localisation', icon: '📍', description: '' },
		{ name: 'Messages', icon: '💬', description: 'Aucun nouveau' }
	];
</script>

<div class="feature-grid">
	{#each features as feature}
		<div class="feature-item">
			<span class="icon">{feature.icon}</span>
			<h3>{feature.name}</h3>
			<p>{feature.count || feature.description}</p>
		</div>
	{/each}
</div>

<style>
	.feature-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	.feature-item {
		background-color: #f0f0f0;
		padding: 16px;
		border-radius: 8px;
		text-align: center;
	}

	.icon {
		font-size: 24px;
	}
</style>
