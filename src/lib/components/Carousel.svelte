<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import { placeholderImageUrl } from "$lib/constants";
	import type { CarouselSong } from "$lib/types";

	const dispatch = createEventDispatcher<{ toggleEvent: string }>();

	export let title: string;
	export let data: CarouselSong[];

	// Handle resizing of carousel
	onMount(() => {
		console.log("Carousel mounted, data", data);
	});
</script>

<div class="max-w-[90vw]">
	<div class="flex h-12 items-center">
		<h1 class="text-lg font-semibold">{title}</h1>
		<!-- <div class="ml-auto pr-4"> maybe later
			<button
				on:click={() => displayToast({ message: "Not implemented yet", type: "error" })}
				><ChevronLeftCircle class="h-8 w-8" /></button
			>
			<button
				on:click={() => displayToast({ message: "Not implemented yet", type: "error" })}
				><ChevronRightCircle class="h-8 w-8" /></button
			>
		</div> -->
	</div>
	<div class="flex gap-4 overflow-x-auto rounded-lg">
		{#if !data || data.length === 0}
			<div>
				<p>No songs</p>
			</div>
		{:else}
			{#each data as song}
				<!-- Song Cards -->
				<button
					on:click={() => dispatch("toggleEvent", song.id)}
					class="border-[2px] border-black p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800"
				>
					<div class="w-48 rounded-lg">
						<img
							src={song.img_url ? song.img_url : placeholderImageUrl}
							alt={song.name}
							class="object-cover"
						/>
						<p class="py-2">{song.name}</p>
						<p>{song.release_year} • {song.main_artist}</p>
					</div>
				</button>
			{/each}
		{/if}
	</div>
</div>
