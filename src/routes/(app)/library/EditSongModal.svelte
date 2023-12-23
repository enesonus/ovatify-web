<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import { Trash2, Edit } from "lucide-svelte";
	import { displayToast } from "$lib/utils/toast";
	import Stars from "$lib/components/Stars.svelte";
	import { user } from "$lib/stores/user";
	import { getSongById } from "$lib/services/songService";
	import { placeholderImageUrl } from "$lib/constants";
	import Spinner from "$lib/components/Spinner.svelte";
	import type { Song } from "$lib/types";
	import { deleteUserSongRating, editUserSongRating } from "$lib/services/userService";
	import { deleteFromCache, songCache } from "$lib/utils/caches";
	import { cn } from "$lib/utils";
	import { getRatingColor } from "$lib/utils/colors";
	import { fade } from "svelte/transition";
	import { refresh } from "$lib/stores/refresh";

	export let dialogOpen: boolean;
	export let selectedSongId: string = "";

	let confirmDialogOpen = false;
	let updateRatingDialogOpen = false;
	let rating = 0;
	let song: Song | null = null;
	let loading = false;
	let loadingSong = false;

	$: if (!dialogOpen) {
		selectedSongId = "";
		song = null;
	}

	$: if (!updateRatingDialogOpen) {
		rating = 0;
	}

	$: getSong(selectedSongId);

	async function getSong(selectedSongId: string) {
		if (selectedSongId === "") return;
		loadingSong = true;
		const token = await $user!.getIdToken();
		song = await getSongById(token, selectedSongId);
		console.log(song);
		loadingSong = false;
	}

	async function updateRating() {
		if (loading) return;
		loading = true;
		const token = await $user!.getIdToken();
		const response = await editUserSongRating(token, selectedSongId, rating);
		if (response.status === 201) {
			displayToast({ message: "Rating updated", type: "success" });
			deleteFromCache(songCache, selectedSongId);
		} else {
			displayToast({ message: "Error updating rating", type: "error" });
		}
		updateRatingDialogOpen = false;
		dialogOpen = false;
		loading = false;
	}

	async function deleteRating() {
		if (loading) return;
		loading = true;
		const token = await $user!.getIdToken();
		const response = await deleteUserSongRating(token, selectedSongId);
		console.log(response);
		if (response.status === 204) {
			displayToast({ message: "Rating deleted", type: "success" });
			deleteFromCache(songCache, selectedSongId);
			$refresh = !$refresh;
		} else if (response.status === 404) {
			displayToast({ message: "Rating not found", type: "error" });
			deleteFromCache(songCache, selectedSongId);
			$refresh = !$refresh;
		} else {
			displayToast({ message: "Error deleting rating", type: "error" });
		}
		confirmDialogOpen = false;
		dialogOpen = false;
		loading = false;
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content
		class="w-11/12 rounded-lg max-w-[90%] md:max-w-2xl lg:max-w-4xl h-[90vh] max-h-[48rem] overflow-y-auto"
	>
		<div class="flex flex-col items-center justify-center h-full py-2">
			{#if dialogOpen}
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
						<div class="grid w-full max-w-xs md:max-w-1/2">
							<div
								class={cn(
									"mt-2 min-w-[12rem] tabular-nums px-4 py-2 rounded-md border-2 text-center font-medium text-sm h-10 select-none bg-primary-foreground",
									getRatingColor(song.average_rating)
								)}
							>
								AVG: {song.average_rating ? song.average_rating : "Unrated"}
							</div>
							<div
								class={cn(
									"mt-2 min-w-[12rem] tabular-nums px-4 py-2 rounded-md border-2 text-center font-medium text-sm h-10 select-none bg-primary-foreground",
									getRatingColor(song.user_rating)
								)}
							>
								User: {song.user_rating}
							</div>
							<div class="flex pt-1 gap-1">
								<Button
									class="flex-grow md:w-10 md:h-10 md:p-0"
									variant="secondary"
									on:click={() => (updateRatingDialogOpen = true)}
								>
									<Edit class="w-5 h-5" />
								</Button>
								<Button
									class="flex-grow md:w-10 md:h-10 md:p-0 "
									variant="secondary"
									on:click={() => (confirmDialogOpen = true)}
								>
									<Trash2 class="w-5 h-5" />
								</Button>
							</div>
						</div>
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
<!-- Update rating modal -->
<Dialog.Root bind:open={updateRatingDialogOpen}>
	<Dialog.Content
		class="w-11/12 rounded-lg max-w-[90%] md:max-w-xl overflow-y-auto min-h-[24rem]"
	>
		<div class="pt-4 w-full flex flex-col justify-center items-center gap-4">
			<h2 class="text-lg">Choose new rating</h2>
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
				on:click={updateRating}>{loading ? "Updating..." : "Update Rating"}</Button
			>
		</div>
	</Dialog.Content>
</Dialog.Root>
<!-- Confirm modal for deleting song from user's library -->
<Dialog.Root bind:open={confirmDialogOpen}>
	<Dialog.Content class="rounded-lg max-w-[16rem] sm:max-w-xs md:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Are you sure?</Dialog.Title>
			<Dialog.Description
				>This action will delete this song from your library!</Dialog.Description
			>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="destructive" class="w-full" on:click={deleteRating}
				>{loading ? "Deleting..." : "Delete"}</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
