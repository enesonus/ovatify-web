<script lang="ts">
	import { defaultImageUrl } from "$lib/constants";
	import type { CarouselGenre } from "$lib/types";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { fade } from "svelte/transition";
	import ListSongsModal from "./ListSongsModal.svelte";
	import { user } from "$lib/stores/user";
	import { getSongsByGenreName } from "$lib/services/genreService";

	export let title: string;
	export let dataFunction: () => Promise<CarouselGenre[]>;

	let selectedGenreName: string = "";

	async function getSongsByGenreId() {
		const token = await $user!.getIdToken();
		const response = await getSongsByGenreName(token, 10, selectedGenreName);
		return response;
	}

	let detailDialogOpen = false;
</script>

<div class="sm:max-w-[80vw] lg:max-w-[85vw] xl:max-w-[90vw]">
	<div class="flex h-12 items-center justify-between pr-4">
		<h1 class="text-lg font-semibold">{title}</h1>
	</div>
	<div>
		{#await dataFunction()}
			<div in:fade|global class="flex gap-4 overflow-x-auto pb-4 rounded-lg">
				{#each { length: 10 } as _}
					<div class="border-2 border-black p-2 rounded-lg bg-zinc-900">
						<div class="w-48 h-60 rounded-lg">
							<Skeleton class="h-48 w-48 rounded-lg" />
							<Skeleton class="w-full h-5 mt-4" />
						</div>
					</div>
				{/each}
			</div>
		{:then data}
			<div in:fade|global class="flex gap-4 overflow-x-auto pb-4 rounded-lg">
				{#if !data || data.length === 0}
					<div in:fade|global class="h-60 text-xl flex justify-center items-center">
						<p>No songs</p>
					</div>
				{:else}
					{#each data as genre, index}
						<!-- Genre Cards -->
						<button
							in:fade|global={{ delay: index * 75 }}
							on:click={() => {
								selectedGenreName = genre.name;
								detailDialogOpen = true;
							}}
							class="border-2 border-black p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition ease-in-out delay-[25ms]"
						>
							<div class="w-48 h-60 rounded-lg">
								<img
									src={genre.img_url || defaultImageUrl}
									alt={genre.name}
									class="object-cover rounded-lg aspect-square"
								/>
								<p class="py-4 truncate">
									{genre.name}
								</p>
							</div>
						</button>
					{/each}
				{/if}
			</div>
		{/await}
	</div>
</div>
<ListSongsModal functionToCall={getSongsByGenreId} bind:dialogOpen={detailDialogOpen} />

<style lang="postcss">
	::-webkit-scrollbar-track:horizontal {
		@apply rounded-lg mx-16 sm:mx-32 lg:mx-48;
	}

	::-webkit-scrollbar-thumb:horizontal {
		@apply rounded-lg;
	}
</style>
