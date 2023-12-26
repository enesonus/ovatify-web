<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { placeholderImageUrl } from "$lib/constants";
	import type { CarouselSong } from "$lib/types";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { fade } from "svelte/transition";
	import { Button } from "$lib/components/ui/button";
	import ListSongsModal from "./ListSongsModal.svelte";
	import * as Dialog from "$lib/components/ui/dialog";
	import { spotify } from "$lib/utils/spotify";
	import { displayToast } from "$lib/utils/toast";
	import { Icons } from "$lib/icons";

	const dispatch = createEventDispatcher<{ toggleEvent: string }>();

	export let title: string;
	export let dataFunction: () => Promise<CarouselSong[]>;
	export let viewAllFunction: (() => Promise<CarouselSong[]>) | null = null;
	export let importToSpotifyVisible: boolean = true;

	let loading = false;
	let importPlaylistSpotifyDialogOpen = false;
	let detailDialogOpen = false;
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
			<div class="flex gap-2">
				{#if importToSpotifyVisible}
					<div in:fade|global>
						<Button
							variant="outline"
							class="py-0 px-2 h-8"
							on:click={async () => {
								if (loading) return;
								const spotifyToken = await spotify.getAccessToken();
								if (!spotifyToken) {
									await spotify.authenticate();
									return;
								}
								importPlaylistSpotifyDialogOpen = true;
							}}><Icons.spotify class="w-5 h-5" /></Button
						>
					</div>
					<!-- Import playlist to spotify modal -->
					<Dialog.Root bind:open={importPlaylistSpotifyDialogOpen}>
						<Dialog.Content class="rounded-lg max-w-[16rem] sm:max-w-xs md:max-w-md">
							<Dialog.Header>
								<Dialog.Title>Import these songs to Spotify?</Dialog.Title>
								<Dialog.Description
									>This action will import these songs as a playlist to your Spotify
									account.</Dialog.Description
								>
							</Dialog.Header>
							<Dialog.Footer>
								<form
									on:submit|preventDefault={async () => {
										if (loading) return;
										const spotifyToken = await spotify.getAccessToken();
										if (!spotifyToken) {
											await spotify.authenticate();
											return;
										}
										loading = true;
										const { id: user_id } = await spotify.currentUser.profile();
										const createdPlaylist = await spotify.playlists.createPlaylist(
											user_id,
											{ name: `Ovatify - ${title}` }
										);
										if (data.length > 0) {
											await spotify.playlists.addItemsToPlaylist(
												createdPlaylist.id,
												data.map((song) => `spotify:track:${song.id}`)
											);
										}
										displayToast({
											message: "Playlist imported to Spotify",
											type: "success"
										});
										importPlaylistSpotifyDialogOpen = false;
										loading = false;
									}}
									class="w-full"
								>
									<Button
										variant="outline"
										type="submit"
										class="w-full bg-emerald-800 hover:bg-emerald-700"
										>{loading ? "Importing..." : "Import"}</Button
									>
								</form>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Root>
				{/if}
				{#if viewAllFunction && data.length >= 10}
					<div in:fade|global>
						<Button
							variant="outline"
							class="py-0 h-8"
							on:click={() => (detailDialogOpen = !detailDialogOpen)}>View All</Button
						>
					</div>
					<ListSongsModal
						functionToCall={viewAllFunction}
						bind:dialogOpen={detailDialogOpen}
					/>
				{/if}
			</div>
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
