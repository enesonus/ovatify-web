<script lang="ts">
	import { defaultImageUrl } from "$lib/constants";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { fade } from "svelte/transition";
	import { Button } from "$lib/components/ui/button";
	import DisplayPlaylistModal from "$lib/components/DisplayPlaylistModal.svelte";
	import { createEmptyPlaylist, getUserPlaylists } from "$lib/services/playlistService";
	import { user } from "$lib/stores/user";
	import { displayToast } from "$lib/utils/toast";
	import { cn } from "$lib/utils";
	import type { CarouselPlaylist } from "$lib/types";

	let selectedPlaylistId: string | null = null;
	let detailDialogOpen = false;
	let refreshCarousel = false;
	let loading = false;

	async function getPlaylists() {
		const token = await $user!.getIdToken();
		const response = await getUserPlaylists(token);
		console.log(response);
		if (response.status === 200) {
			return response.data.items as CarouselPlaylist[];
		} else {
			displayToast({ message: "Error fetching playlists", type: "error" });
		}
		return [];
	}

	async function openDetailDialog(selectedId: string | null) {
		if (!selectedId) return;
		selectedPlaylistId = selectedId;
		detailDialogOpen = true;
	}

	async function createNewPlaylist() {
		if (loading) return;
		const token = await $user!.getIdToken();
		loading = true;
		const response = await createEmptyPlaylist(token);
		if (response.status === 201) {
			displayToast({ message: "Playlist created", type: "success" });
			refreshCarousel = !refreshCarousel;
		} else {
			displayToast({ message: "Error creating playlist", type: "error" });
		}
		loading = false;
	}
</script>

{#key refreshCarousel}
	<div class="sm:max-w-[80vw] lg:max-w-[85vw] xl:max-w-[90vw]">
		{#await getPlaylists()}
			<div class="flex h-12 items-center justify-between">
				<h1 class="text-2xl font-bold">Playlists</h1>
			</div>
			<div in:fade|global class="flex gap-4 overflow-x-auto pb-4 rounded-lg">
				{#each { length: 10 } as _}
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
				<h1 class="text-2xl font-bold">Playlists</h1>
				<Button
					variant="outline"
					class={cn("py-0 px-0 h-8 min-w-[6rem]", { "opacity-50": loading })}
					on:click={createNewPlaylist}>{loading ? "Creating..." : "New"}</Button
				>
			</div>
			<div in:fade|global class="flex gap-4 overflow-x-auto pb-4 rounded-lg">
				{#if !data || data.length === 0}
					<div in:fade|global class="h-72">
						<p>No playlists found</p>
					</div>
				{:else}
					{#each data as playlist, index}
						<!-- Playlist Cards -->
						<button
							in:fade|global={{ delay: index * 75 }}
							on:click={() => openDetailDialog(playlist.id)}
							class="border-2 border-black p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition ease-in-out delay-[25ms]"
						>
							<!-- Render 4 images if available, else pick first one -->
							<div class="w-48 h-60 rounded-lg">
								{#if playlist.song_imgs.length < 4}
									<img
										class="object-cover rounded-lg aspect-square"
										src={playlist.song_imgs.at(0) || defaultImageUrl}
										alt={playlist.name}
									/>
								{:else}
									<div class="grid grid-cols-2">
										{#each playlist.song_imgs as song_img_url, index}
											<img
												class={cn("w-24 h-24 object-cover", {
													"rounded-tl-lg": index === 0,
													"rounded-tr-lg": index === 1,
													"rounded-bl-lg": index === 2,
													"rounded-br-lg": index === 3
												})}
												src={song_img_url || defaultImageUrl}
												alt={playlist.name}
											/>
										{/each}
									</div>
								{/if}
								<p class="py-4 truncate">
									{playlist.name}
								</p>
							</div>
						</button>
					{/each}
				{/if}
			</div>
		{/await}
	</div>
{/key}

<DisplayPlaylistModal
	bind:dialogOpen={detailDialogOpen}
	bind:selectedPlaylistId
	on:refresh={() => (refreshCarousel = !refreshCarousel)}
/>

<style lang="postcss">
	::-webkit-scrollbar-track:horizontal {
		@apply rounded-lg mx-16 sm:mx-32 lg:mx-48;
	}

	::-webkit-scrollbar-thumb:horizontal {
		@apply rounded-lg;
	}
</style>
