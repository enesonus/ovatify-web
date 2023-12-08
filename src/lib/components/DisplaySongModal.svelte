<script lang="ts">
	import { user } from "$lib/stores/user";
	import * as Dialog from "$lib/components/ui/dialog";
	import { addSong, getSongById } from "$lib/services/songService";
	import Spinner from "$lib/components/Spinner.svelte";
	import { placeholderImageUrl } from "$lib/constants";
	import type { Song } from "$lib/types";
	import { Button } from "$lib/components/ui/button";
	import { BookmarkPlus } from "lucide-svelte";
	import { displayToast } from "$lib/utils/toast";
	import Stars from "$lib/components/Stars.svelte";
	import { cn } from "$lib/utils";
	import { getRatingColor } from "$lib/utils/colors";
	import { deleteFromCache, songCache } from "$lib/utils/caches";
	import { fade } from "svelte/transition";
	import { refresh } from "$lib/stores/refresh";
	import { createEventDispatcher, onDestroy } from "svelte";
	import { goto } from "$app/navigation";

	export let dialogIsOpen: boolean;
	export let selectedSongId: string | null;

	const dispatch = createEventDispatcher();

	let song: Song | null = null;
	let loadingSong = false;
	let loading = false;
	let rating = 0;
	let addRatingDialogIsOpen = false;

	$: if (!dialogIsOpen) {
		selectedSongId = null;
		song = null;
		rating = 0;
	}

	$: if (!addRatingDialogIsOpen) {
		rating = 0;
	}

	$: getSong(selectedSongId);

	async function getSong(selectedSongId: string | null) {
		if (!selectedSongId) return;
		loadingSong = true;
		const token = await $user!.getIdToken();
		song = await getSongById(token, selectedSongId);
		console.log(song);
		loadingSong = false;
	}

	async function addSongToLibrary() {
		if (loading) return;
		if (rating == 0) {
			displayToast({ type: "error", message: "Please select a rating" });
			return;
		}
		if (!selectedSongId) {
			displayToast({ type: "error", message: "Please select a song" });
			return;
		}
		loading = true;
		const token = await $user!.getIdToken();
		const response = await addSong(token, selectedSongId, rating);
		console.log(response);
		if (response.status >= 200 && response.status < 300) {
			displayToast({ type: "success", message: "Rating added successfully" });
			deleteFromCache(songCache, selectedSongId);
			$refresh = !$refresh;
			dispatch("songAdded", selectedSongId);
			goto("/library");
		} else if (response.status === 400) {
			displayToast({ type: "error", message: "This song is already in your library" });
		} else {
			displayToast({ type: "error", message: "Error adding song" });
		}
		addRatingDialogIsOpen = false;
		dialogIsOpen = false;
		loading = false;
	}
</script>

<Dialog.Root bind:open={dialogIsOpen}>
	<Dialog.Content
		class="w-11/12 rounded-lg max-w-[90%] md:max-w-2xl lg:max-w-4xl h-[90vh] max-h-[48rem] overflow-y-auto"
	>
		<div class="flex flex-col items-center justify-center h-full py-2">
			{#if dialogIsOpen}
				{#if loadingSong}
					<div in:fade|global class="flex justify-center items-center">
						<Spinner class="animate-spin w-10 h-10" />
					</div>
				{:else if !song}
					<div in:fade|global class="flex justify-center items-center">
						<p class="text-center text-xl">Song not found</p>
					</div>
				{:else}
					<div
						in:fade|global
						class="flex flex-col w-full h-full justify-center items-center text-start break-all"
					>
						<img
							src={song.img_url ? song.img_url : placeholderImageUrl}
							alt={`${song.name} Cover Art` ?? "Unknown Song Cover Art"}
							class="w-64 object-cover rounded-lg"
						/>
						<div
							class={cn(
								"mt-2 min-w-[12rem] tabular-nums px-4 py-2 rounded-md border-2 text-center font-medium text-sm h-10 select-none bg-primary-foreground",
								getRatingColor(song.average_rating)
							)}
						>
							AVG: {song.average_rating ? song.average_rating : "Unrated"}
						</div>
						{#if !song.user_rating}
							<Button
								class="mt-1 min-w-[12rem] tabular-nums bg-emerald-800 hover:bg-emerald-700"
								variant="secondary"
								on:click={() => (addRatingDialogIsOpen = true)}
								>Add to Library<BookmarkPlus class="ml-2" /></Button
							>
						{:else}
							<div
								class={cn(
									"mt-2 min-w-[12rem] tabular-nums px-4 py-2 rounded-md border-2 text-center font-medium text-sm h-10 select-none bg-primary-foreground",
									getRatingColor(song.user_rating)
								)}
							>
								User: {song.user_rating}
							</div>
						{/if}
						<h1 class="pt-4 font-bold text-xl px-2 w-full">
							{song.name ?? "Unknown Song"}
						</h1>
						<h2 class="w-full px-2">
							By: {song.artists && song.artists.length > 0
								? song.artists.join(", ")
								: "Unknown"}
						</h2>
						<p class="w-full px-2">
							Album: {song.albums && song.albums.length > 0 ? song.albums[0] : "Unknown"}
						</p>
						<p class="w-full px-2">
							Genres: {song.genres && song.genres.length > 0
								? song.genres.join(", ")
								: "Unknown"}
						</p>
						<p class="w-full px-2">Mood: {song.mood ?? "Unknown"}</p>
						<p class="w-full px-2">Tempo: {song.tempo ?? "Unknown"}</p>
						<p class="w-full px-2">Release Year: {song.release_year ?? "Unknown"}</p>
						<p class="w-full px-2">
							Duration: {song.duration ? `${song.duration} seconds` : "Unknown"}
						</p>
						<p class="w-full px-2">
							Recorded Environment: {song.recorded_environment ?? "Unknown"}
						</p>
					</div>
				{/if}
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
<Dialog.Root bind:open={addRatingDialogIsOpen}>
	<Dialog.Content
		class="w-11/12 rounded-lg max-w-[90%] md:max-w-xl overflow-y-auto min-h-[24rem]"
	>
		<div class="pt-4 w-full flex flex-col justify-center items-center gap-4">
			<h2 class="text-lg">Choose rating</h2>
			<div class="flex">
				<Stars bind:rating />
			</div>
			<Button
				variant="outline"
				class={`min-w-[12rem] ${
					loading || rating == 0
						? "bg-red-800 hover:bg-red-700"
						: "bg-emerald-800 hover:bg-emerald-700"
				}`}
				on:click={addSongToLibrary}>{loading ? "Adding..." : "Add Song"}</Button
			>
			<!-- <Button
				on:click={() => {
					displayToast({ type: "success", message: "Rating added successfully" });
					$refresh = !$refresh;
					addRatingDialogIsOpen = false;
					dialogIsOpen = false;
					loading = false;
					dispatch("songAdded", selectedSongId);
				}}>Test</Button
			> -->
		</div>
	</Dialog.Content>
</Dialog.Root>
