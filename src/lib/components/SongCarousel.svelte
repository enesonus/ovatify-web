<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { placeholderImageUrl } from "$lib/constants";
	import type { CarouselSong } from "$lib/types";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { fade } from "svelte/transition";
	import { Button } from "$lib/components/ui/button";
	import ListSongsModal from "./ListSongsModal.svelte";

	const dispatch = createEventDispatcher<{ toggleEvent: string }>();

	export let title: string;
	export let dataFunction: () => Promise<CarouselSong[]>;
	export let viewAllFunction: (() => Promise<CarouselSong[]>) | null = null;

	let detailDialogIsOpen = false;
</script>

<div class="sm:max-w-[80vw] lg:max-w-[85vw]">
	{#await dataFunction()}
		<div class="flex h-12 items-center justify-between">
			<h1 class="text-lg font-semibold">{title}</h1>
		</div>
		<div in:fade|global class="flex gap-4 overflow-x-auto pb-4 rounded-lg">
			{#each { length: 5 } as _}
				<div class="border-2 border-black p-2 rounded-lg bg-zinc-900">
					<div class="w-48 h-72 rounded-lg">
						<Skeleton class="h-48 w-48 rounded-lg" />
						<Skeleton class="w-full h-5 mt-4" />
						<Skeleton class="w-full h-5 mt-2" />
						<Skeleton class="w-full h-5 mt-2" />
					</div>
				</div>
			{/each}
		</div>
	{:then data}
		<div class="flex h-12 items-center justify-between">
			<h1 class="text-lg font-semibold">{title}</h1>
			{#if viewAllFunction && data.length >= 10}
				<div in:fade|global>
					<Button
						variant="outline"
						class="py-0 h-8"
						on:click={() => (detailDialogIsOpen = !detailDialogIsOpen)}>View All</Button
					>
				</div>
				<ListSongsModal
					functionToCall={viewAllFunction}
					bind:dialogIsOpen={detailDialogIsOpen}
					on:toggleEvent
				/>
			{/if}
		</div>
		<div in:fade|global class="flex gap-4 overflow-x-auto pb-4 rounded-lg">
			{#if !data || data.length === 0}
				<div in:fade|global class="h-72">
					<p>No songs found</p>
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
							<p class="pt-4 truncate">
								{song.name}
							</p>
							<p class="truncate">
								{song.release_year}
							</p>
							<p class="truncate">
								{song.main_artist}
							</p>
						</div>
					</button>
				{/each}
			{/if}
		</div>
	{/await}
</div>
