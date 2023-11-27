<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import { CheckCircle2, XCircle, Trash2, Edit } from "lucide-svelte";
	import { displayToast } from "$lib/utils/toast";
	import Stars from "$lib/components/Stars.svelte";
	import { fade } from "svelte/transition";
	import { user } from "$lib/stores/user";
	import { getSongById } from "$lib/services/songService";
	import { placeholderImageUrl } from "$lib/constants";
	import Spinner from "$lib/components/Spinner.svelte";
	import type { Song } from "$lib/types";
	import { deleteUserSongRating, editUserSongRating } from "$lib/services/userService";
	import { deleteFromCache, songCache } from "$lib/utils/caches";

	export let dialogIsOpen: boolean;
	export let selectedSongId: string = "";
	export let refresh: boolean;

	let confirmDialogIsOpen = false;
	let rating = 0;
	let editMode = false;
	let song: Song | null = null;
	let loading = false;
	let songLoading = false;

	$: if (!dialogIsOpen) {
		selectedSongId = "";
		song = null;
	}

	$: getSong(selectedSongId);

	async function getSong(selectedSongId: string) {
		if (selectedSongId === "") return;
		songLoading = true;
		const token = await $user!.getIdToken();
		song = await getSongById(token, selectedSongId);
		console.log(song);
		songLoading = false;
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
		loading = false;
		editMode = false;
		dialogIsOpen = false;
	}

	async function deleteRating() {
		if (loading) return;
		loading = true;
		const token = await $user!.getIdToken();
		const response = await deleteUserSongRating(token, selectedSongId);
		if (response.status === 201) {
			displayToast({ message: "Rating deleted", type: "success" });
			deleteFromCache(songCache, selectedSongId);
			refresh = !refresh;
		} else if (response.status === 404) {
			displayToast({ message: "Rating not found", type: "error" });
			deleteFromCache(songCache, selectedSongId);
			refresh = !refresh;
		} else {
			displayToast({ message: "Error deleting rating", type: "error" });
		}
		confirmDialogIsOpen = false;
		dialogIsOpen = false;
		loading = false;
	}
</script>

<Dialog.Root bind:open={dialogIsOpen}>
	<Dialog.Content
		class="w-11/12 rounded-lg max-w-[90%] md:max-w-2xl h-[90vh] overflow-y-auto"
	>
		{#if dialogIsOpen}
			{#if songLoading}
				<div class="flex justify-center items-center min-h-[70vh]">
					<Spinner class="animate-spin" />
				</div>
			{:else if !song}
				<div class="flex justify-center items-center min-h-[70vh]">
					<p class="text-xl">No song selected</p>
				</div>
			{:else}
				<div class="flex flex-col items-center">
					<div
						class="flex flex-col w-full justify-center items-center text-start break-all"
					>
						<img
							src={song.img_url ? song.img_url : placeholderImageUrl}
							alt={`${song.name} Cover Art` ?? "Unknown Song Cover Art"}
							class="w-64 object-cover rounded-lg"
						/>
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
						<p class="w-full px-2 text-center">
							Average Rating: {song.average_rating ? song.average_rating : "Unrated"}
						</p>
						<div class="flex justify-center items-center gap-1">
							{#if !editMode}
								<p class="px-2 tabular-nums">Your Rating: {song.user_rating ?? 5}</p>
							{:else}
								<p class="px-2 tabular-nums">New Rating: {rating}</p>
							{/if}
							{#if !editMode}
								<Button
									variant="outline"
									on:click={() => (editMode = true)}
									class="w-6 h-6 p-0"
								>
									<Edit class="w-4 h-4" />
								</Button>
								<Button
									variant="outline"
									on:click={() => (confirmDialogIsOpen = true)}
									class="w-6 h-6 p-0"
								>
									<Trash2 class="w-4 h-4" />
								</Button>
							{/if}
						</div>
						{#if editMode}
							<div transition:fade class="flex justify-center items-center h-8">
								<Stars bind:rating />
								<Button
									variant="outline"
									on:click={updateRating}
									class={`w-6 h-6 p-0 ml-1 ${
										loading ? "bg-red-800 hover:bg-red-800" : ""
									}}`}
								>
									<CheckCircle2 class="w-4 h-4" />
								</Button>
								<Button
									variant="outline"
									on:click={() => {
										if (!loading) editMode = false;
									}}
									class={`w-6 h-6 p-0 ${loading ? "bg-red-800 hover:bg-red-800" : ""}}`}
								>
									<XCircle class="w-4 h-4" />
								</Button>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		{/if}
	</Dialog.Content>
</Dialog.Root>
<!-- Confirm modal for deleting song from user's library -->
<Dialog.Root bind:open={confirmDialogIsOpen}>
	<Dialog.Content class="rounded-lg max-w-[16rem] sm:max-w-xs md:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Are you sure?</Dialog.Title>
			<Dialog.Description
				>This action will delete this song from your library</Dialog.Description
			>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="destructive" class="w-full" on:click={deleteRating}
				>{loading ? "Deleting..." : "Delete"}</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
