<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { CarouselSong } from "$lib/types";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { fade } from "svelte/transition";
	import { user } from "$lib/stores/user";
	import { recommendYouMightLike } from "$lib/services/recommendationService";
	import { displayToast } from "$lib/utils/toast";

	const dispatch = createEventDispatcher<{ toggleEvent: string }>();

	async function getYouMightLike() {
		const token = await $user!.getIdToken();
		const response = await recommendYouMightLike(token, 8);
		if (response.status !== 200) {
			displayToast({ message: "Error getting songs you might like", type: "error" });
			return [];
		}
		return response.data.tracks_info as CarouselSong[];
	}
</script>

<div class="flex flex-col w-full py-4">
	<h2 class="pb-4">Music you might like</h2>
	<div class="grid grid-cols-2 md:grid-cols-4 gap-2">
		{#await getYouMightLike()}
			{#each { length: 8 } as _}
				<div class="grid grid-cols-[auto,1fr] items-center rounded-lg">
					<Skeleton class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg" />
					<div class="text-sm pl-2">
						<Skeleton class="h-4 my-2 sm:my-3" />
						<Skeleton class="h-4 mb-2 sm:mb-4" />
					</div>
				</div>
			{/each}
		{:then data}
			{#if data.length === 0}
				<p class="text-center">No songs found</p>
			{:else}
				{#each data as song, index}
					<button
						in:fade|global={{ delay: index * 75 }}
						on:click={() => dispatch("toggleEvent", song.id)}
						class="grid grid-cols-[auto,1fr] items-center bg-zinc-800 hover:bg-zinc-700 transition ease-in-out delay-[25ms] rounded-lg p-1"
					>
						<img
							src={song.img_url}
							class="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg p-1"
							alt={song.name}
						/>
						<div class="pl-1 overflow-x-hidden text-start text-xs xsm:text-sm">
							<p class="font-semibold truncate">
								{song.name}
							</p>
							<p class="font-light truncate">
								{song.main_artist}
							</p>
						</div>
					</button>
				{/each}
			{/if}
		{/await}
	</div>
</div>
