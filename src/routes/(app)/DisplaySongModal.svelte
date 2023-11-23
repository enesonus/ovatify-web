<script lang="ts">
	import { user } from "$lib/stores/user";
	import * as Dialog from "$lib/components/ui/dialog";
	import { getSongById } from "$lib/services/songService";
	import Spinner from "$lib/components/Spinner.svelte";
	import { placeholderImageUrl } from "$lib/constants";
	import type { Song } from "$lib/types";

	export let dialogIsOpen: boolean;
	export let selectedSongId: string;

	let song: Song | null = null;
	let loading = false;

	$: if (!dialogIsOpen) {
		selectedSongId = "";
	}

	$: getSong(selectedSongId);

	async function getSong(selectedSongId: string) {
		if (selectedSongId === "") return;
		loading = true;
		const token = await $user?.getIdToken();
		song = await getSongById(token!, selectedSongId);
		console.log(song);
		loading = false;
	}
</script>

<Dialog.Root bind:open={dialogIsOpen}>
	<Dialog.Content
		class="w-11/12 rounded-lg max-w-[90%] md:max-w-2xl h-[90vh] overflow-y-auto"
	>
		<div class="flex flex-col items-center">
			<div class="flex flex-col w-full justify-center items-center text-start break-all">
				{#if dialogIsOpen}
					{#if loading}
						<div class="flex justify-center items-center min-h-[80vh]">
							<Spinner class="animate-spin" />
						</div>
					{:else if !song}
						<div class="flex justify-center items-center min-h-[80vh]">
							<p class="text-center">Song not found</p>
						</div>
					{:else}
						<img
							src={song.img_url ? song.img_url : placeholderImageUrl}
							alt={`${song.name} Cover Art` ?? "Unknown Song Cover Art"}
							class="w-64 object-cover"
						/>
						<h1 class="font-bold text-xl px-2 w-full">
							{song.name ?? "Unknown Song"}
						</h1>
						<!-- <p class="w-full px-2">
					{song.id ? `ID: ${song.id}` : "ID: No Id"}
				</p> -->
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
					{/if}
				{/if}
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
