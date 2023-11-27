<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import { placeholderImageUrl } from "$lib/constants";
	import type { CarouselSong } from "$lib/types";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { fade } from "svelte/transition";
	import { sleep } from "$lib/utils/time";

	async function getMusicYouMightLike() {
		await sleep(Math.random() * 1);
		const musicInfo = {
			img_url: placeholderImageUrl,
			name: "Sanctuary in Dying Light",
			main_artist: "The Luna Sequence"
		};
		return Array.from({ length: 4 }, () => ({ ...musicInfo }));
	}
</script>

<div class="flex flex-col py-4 pr-4">
	<h2 class="pb-4">Music you might like</h2>
	<div class="grid grid-cols-2 gap-x-8 gap-y-4">
		{#await getMusicYouMightLike()}
			{#each { length: 4 } as _}
				<div class="flex justify-center items-center">
					<Skeleton class="w-16 h-16" />
					<div class="text-sm pl-2">
						<Skeleton class="w-48 h-5 my-2" />
						<Skeleton class="w-48 h-5 mb-2" />
					</div>
				</div>
			{/each}
		{:then data}
			{#each data as song, index}
				<div
					in:fade|global={{ delay: index * 75 }}
					class="flex justify-center items-center"
				>
					<img src={song.img_url} class="w-16 h-16 object-cover" alt="" />
					<div class="text-sm pl-2 w-32">
						<p class="font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
							{song.name}
						</p>
						<p class="font-light whitespace-nowrap overflow-hidden text-ellipsis">
							{song.main_artist}
						</p>
					</div>
				</div>
			{/each}
		{:catch}
			<div>Error fetching data</div>
		{/await}
	</div>
</div>
