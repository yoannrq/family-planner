<script lang="ts">
	// Logique pour gérer le clic sur le bouton premium
	function handlePremiumClick() {
		// Implémenter la logique pour passer au premium
		console.log('Passer au premium');
	}
</script>

<div class="premium-banner">
	<h2>Passez au Premium, le parfait coup de pouce pour votre famille</h2>
	<button on:click={handlePremiumClick}>En savoir plus</button>
</div>

<style>
	.premium-banner {
		background-color: #9370db;
		color: white;
		padding: 16px;
		border-radius: 8px;
		text-align: center;
		margin-bottom: 16px;
	}
</style>
