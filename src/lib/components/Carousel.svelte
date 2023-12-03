<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import { placeholderImageUrl } from "$lib/constants";
	import type { CarouselSong } from "$lib/types";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { fade } from "svelte/transition";

	const dispatch = createEventDispatcher<{ toggleEvent: string }>();

	export let title: string;
	export let functionToCall: () => Promise<CarouselSong[]>;
</script>

<div class="max-w-[90vw]">
	<div class="flex h-12 items-center">
		<h1 class="text-lg font-semibold">{title}</h1>
	</div>
	<div>
		{#await functionToCall()}
			<div in:fade|global class="flex gap-4 overflow-x-auto pb-4 rounded-lg">
				{#each { length: 5 } as _}
					<div class="border-2 border-black p-2 rounded-lg bg-zinc-900">
						<div class="w-48 h-72 rounded-lg">
							<Skeleton class="h-48 w-48 rounded-lg" />
							<Skeleton class="w-full h-5 mt-2" />
							<Skeleton class="w-full h-5 mt-2" />
							<Skeleton class="w-full h-5 mt-2" />
						</div>
					</div>
				{/each}
			</div>
		{:then data}
			<div class="flex gap-4 overflow-x-auto pb-4 rounded-lg">
				{#if !data || data.length === 0}
					<div>
						<p>No songs</p>
					</div>
				{:else}
					{#each data as song, index}
						<!-- Song Cards -->
						<button
							in:fade|global={{ delay: index * 75 }}
							on:click={() => dispatch("toggleEvent", song.id)}
							class="border-2 border-black p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition ease-in-out delay-[25ms]"
						>
							<div class="w-48 h-72 rounded-lg">
								<img
									src={song.img_url ? song.img_url : placeholderImageUrl}
									alt={song.name}
									class="object-cover rounded-lg"
								/>
								<p class="pt-2 whitespace-nowrap overflow-hidden text-ellipsis">
									{song.name}
								</p>
								<p class="whitespace-nowrap overflow-hidden text-ellipsis">
									{song.release_year}
								</p>
								<p class="whitespace-nowrap overflow-hidden text-ellipsis">
									{song.main_artist}
								</p>
							</div>
						</button>
					{/each}
				{/if}
			</div>
		{/await}
	</div>
</div>
