<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import { placeholderImageUrl } from "$lib/constants";
	import type { CarouselSong } from "$lib/types";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { fade } from "svelte/transition";
	import { sleep } from "$lib/utils/time";

	const dispatch = createEventDispatcher<{ toggleEvent: string }>();

	async function getMusicYouMightLike() {
		await sleep(Math.random() * 1);
		const musicInfo = {
			id: "4lQ0R8gZMc16khvAEWsZLG",
			img_url: "https://i.scdn.co/image/ab67616d0000b2735a11e6ccee5233eb49c64885",
			name: "Sanctuary in Dying Light",
			main_artist: "The Luna Sequence"
		};
		return Array.from({ length: 4 }, () => ({ ...musicInfo }));
	}
</script>

<div class="flex flex-col w-full sm:w-1/2 py-4">
	<h2 class="pb-4">Music you might like</h2>
	<div class="grid grid-cols-2 gap-2">
		{#await getMusicYouMightLike()}
			{#each { length: 4 } as _}
				<div class="flex justify-center items-center p-1">
					<Skeleton class="w-16 h-16 rounded-lg" />
					<div class="text-sm pl-2">
						<Skeleton class="w-48 h-5 my-2" />
						<Skeleton class="w-48 h-5 mb-2" />
					</div>
				</div>
			{/each}
		{:then data}
			{#each data as song, index}
				<button
					in:fade|global={{ delay: index * 75 }}
					on:click={() => dispatch("toggleEvent", song.id)}
					class="flex min-w-[10rem] items-center bg-zinc-800 hover:bg-zinc-700 transition ease-in-out delay-[25ms] rounded-lg p-1"
				>
					<img
						src={song.img_url}
						class="w-16 h-16 object-cover rounded-lg p-1"
						alt={song.name}
					/>
					<div class="text-sm pl-1 flex-grow">
						<p class="font-semibold truncate text-start">
							{song.name}
						</p>
						<p class="font-light truncate text-start">
							{song.main_artist}
						</p>
					</div>
				</button>
			{/each}
		{:catch}
			<div>Error fetching data</div>
		{/await}
	</div>
</div>
