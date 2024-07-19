<script lang="ts">
	export let color: string;
	export let size: string;
	export let pathToBeDrawn: string;
	export let thisClass: string | undefined;
</script>

<svg class={thisClass} width={size} height={size} viewBox="0 0 256 256">
	<path fill={color} d={pathToBeDrawn} />
</svg>
