<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import Spinner from "$lib/components/Spinner.svelte";
	import type { CarouselSong } from "$lib/types";
	import { createEventDispatcher } from "svelte";
	import { fade } from "svelte/transition";
	import DisplaySongModal from "./DisplaySongModal.svelte";

	export let dialogOpen: boolean;
	export let functionToCall: () => Promise<CarouselSong[]>;

	let selectedSongId: string | null = null;
	let songDetailDialogOpen = false;
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content
		class="w-11/12 rounded-lg max-w-[90%] md:max-w-2xl lg:max-w-4xl h-[90vh] max-h-[48rem] px-2 sm:px-4"
	>
		<div class="flex flex-col items-center mt-4 bg-zinc-900 rounded-lg overflow-y-auto">
			{#await functionToCall()}
				<div in:fade|global class="flex w-full h-full items-center justify-center">
					<Spinner class="animate-spin w-12 h-12" />
				</div>
			{:then songs}
				<div
					in:fade|global
					class="flex flex-col w-full items-center text-start break-all h-full"
				>
					{#if songs.length === 0}
						<!-- Highly unlikely, but just in case -->
						<p class="text-center text-lg">No songs found</p>
					{:else}
						<div
							class="hidden sm:grid grid-cols-[auto,1fr,1fr,1fr] items-center justify-center text-white gap-x-4 w-full p-1 pt-2"
						>
							<div class="w-12 h-4" />
							<p class="truncate">Name</p>
							<p class="truncate">Artist</p>
							<p class="truncate">Release Year</p>
						</div>
						<hr class="hidden sm:block border-white w-full mb-2" />
						{#each songs as song}
							<button
								on:click={() => {
									selectedSongId = song.id;
									songDetailDialogOpen = true;
								}}
								class="w-full p-1 rounded-lg hover:bg-zinc-800 transition ease-in-out delay-[25ms]"
							>
								<div class="grid grid-cols-[auto,1fr] items-center gap-2 sm:hidden">
									<img
										src={song.img_url}
										alt={song.name}
										class="inline-block w-16 h-16 object-cover rounded-lg"
									/>
									<div class="overflow-x-hidden text-start">
										<p class="truncate">
											{song.name}
										</p>
										<p class="truncate">
											{song.main_artist}
										</p>
									</div>
								</div>
								<div
									class="hidden sm:grid grid-cols-[auto,1fr,1fr,1fr] items-center justify-center gap-x-4 text-start"
								>
									<img
										src={song.img_url}
										alt={song.name}
										class="w-12 h-12 object-cover rounded-lg"
									/>
									<p class="truncate">
										{song.name}
									</p>
									<p class="truncate">
										{song.main_artist}
									</p>
									<p class="truncate">
										{song.release_year}
									</p>
								</div>
							</button>
						{/each}
					{/if}
				</div>
			{/await}
		</div>
	</Dialog.Content>
</Dialog.Root>

<DisplaySongModal bind:dialogOpen={songDetailDialogOpen} bind:selectedSongId />
