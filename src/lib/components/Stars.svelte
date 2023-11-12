<script lang="ts">
	import { Star } from "lucide-svelte";

	export let rating: number;
	let hoverIndex = -1; // Initialize hover index
</script>

{#each { length: 5 } as _, index}
	<button
		class="transition duration-300 ease-in-out"
		on:click={() => (rating = index + 1)}
		on:mouseenter={() => (hoverIndex = index)}
		on:mouseleave={() => (hoverIndex = -1)}
	>
		<Star
			class="transition duration-300 ease-in-out w-6 h-6 hover:fill-[#FFFFFF]"
			fill={rating > index || (hoverIndex >= index && hoverIndex !== -1) ? "#FFFFFF" : ""}
		/>
	</button>
{/each}
