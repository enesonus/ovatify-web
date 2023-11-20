<script lang="ts">
	import { user } from "$lib/stores/user";
	import * as Dialog from "$lib/components/ui/dialog";
	import { getSongById } from "$lib/services/songService";
	import Spinner from "$lib/components/Spinner.svelte";
	import { placeholderImageUrl } from "$lib/constants";

	export let dialogIsOpen: boolean;
	export let selectedSongId: string = "";

	let selectedSong: any;
	let loading = false;

	$: if (!dialogIsOpen) {
		selectedSongId = "";
	}

	$: getSong(selectedSongId);

	async function getSong(selectedSongId: string) {
		if (selectedSongId === "") return;
		loading = true;
		const token = await $user?.getIdToken();
		const response = await getSongById(token!, selectedSongId);
		selectedSong = response.data;
		loading = false;
	}
</script>

<Dialog.Root bind:open={dialogIsOpen}>
	<Dialog.Content
		class="w-11/12 rounded-lg max-w-[90%] md:max-w-2xl h-[90vh] overflow-y-auto"
	>
		<div class=" relative flex flex-col items-center">
			<div class="flex flex-col w-full justify-center items-center text-start break-all">
				{#if dialogIsOpen}
					{#if loading}
						<div class="flex justify-center items-center min-h-[70vh]">
							<Spinner class="animate-spin" />
						</div>
					{:else}
						<img src={placeholderImageUrl} alt="" class="w-64 object-cover" />
						<h1 class="font-bold text-xl px-2 w-full">{selectedSong.name ?? "Name"}</h1>
						<h2 class="w-full px-2">
							{selectedSong.artists ? selectedSong.artists.join(", ") : "Artists"}
						</h2>
						<p class="w-full px-2">
							Album: {selectedSong.album ?? "Album"}
						</p>
						<p class="w-full px-2">
							Release Year: {selectedSong.release_year ?? "Release Year"}
						</p>
						<p class="w-full px-2">
							Genres: {selectedSong.genres ? selectedSong.genres.join(", ") : "Genres"}
						</p>
						<p class="w-full px-2">
							Instruments: {selectedSong.instruments
								? selectedSong.instruments.join(", ")
								: "Instruments"}
						</p>
						<p class="w-full px-2">Mood: {selectedSong.mood ?? "Mood"}</p>
						<p class="w-full px-2 text-center">
							Average Rating: {selectedSong.avgRating ?? 3.5}
						</p>
						<div class="flex justify-center items-center gap-1">
							<p class="px-2 tabular-nums">Your Rating: {selectedSong.rating ?? 5}</p>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
