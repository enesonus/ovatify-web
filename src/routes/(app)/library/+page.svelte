<script lang="ts">
	import Carousel from "$lib/components/SongCarousel.svelte";
	import SongFileComboUpload from "./SongFileUploadModal.svelte";
	import { displayToast } from "$lib/utils/toast";
	import { user } from "$lib/stores/user";
	import { getRecentlyAddedSongs, getUserFavorites } from "$lib/services/userService";
	import type { CarouselSong } from "$lib/types";
	import { refresh } from "$lib/stores/refresh";
	import ExportModal from "./ExportModal.svelte";
	import PlaylistCarousel from "./PlaylistCarousel.svelte";
	import DisplaySongModal from "$lib/components/DisplaySongModal.svelte";

	let displaySongDialogOpen = false;
	let selectedSongId: string = "";

	// Gets data to fill the carousel with recent song additions by the user
	async function getRecentAdditions() {
		const token = await $user!.getIdToken();
		const response = await getRecentlyAddedSongs(token, 10);
		if (response.status !== 200) {
			displayToast({ message: "Error getting recent additions", type: "error" });
			return [];
		}
		return response.data.songs as CarouselSong[];
	}

	// Gets data to display all recent song additions by the user
	async function getAllRecentAdditions() {
		const token = await $user!.getIdToken();
		const response = await getRecentlyAddedSongs(token, null);
		if (response.status !== 200) {
			displayToast({ message: "Error getting recent additions", type: "error" });
			return [];
		}
		return response.data.songs as CarouselSong[];
	}

	// Gets data to fill the carousel with the user's favorite songs
	async function getYourFavorites() {
		const token = await $user!.getIdToken();
		const response = await getUserFavorites(token, 10);
		if (response.status !== 200) {
			displayToast({ message: "Error getting favorites", type: "error" });
			return [];
		}
		return response.data.songs as CarouselSong[];
	}

	// Gets data to display all of the user's favorite songs
	async function getAllYourFavorites() {
		const token = await $user!.getIdToken();
		const response = await getUserFavorites(token, null);
		if (response.status !== 200) {
			displayToast({ message: "Error getting favorites", type: "error" });
			return [];
		}
		return response.data.songs as CarouselSong[];
	}

	function toggleDialog(event: CustomEvent<string>) {
		selectedSongId = event.detail;
		displaySongDialogOpen = !displaySongDialogOpen;
	}
</script>

<section>
	<div class="flex flex-col gap-4">
		<div class="flex flex-col xsm:flex-row items-center justify-center">
			<h1 class="text-center sm:text-start text-2xl font-bold">Library</h1>
			<div class="mt-2 xsm:mt-0 xsm:ml-auto sm:pr-8">
				<SongFileComboUpload />
				<ExportModal />
			</div>
		</div>
		<!-- Recent Additions -->
		{#key $refresh}
			<Carousel
				on:toggleEvent={toggleDialog}
				title="Recent Additions"
				dataFunction={getRecentAdditions}
				viewAllFunction={getAllRecentAdditions}
			/>
			<!-- Favorites -->
			<Carousel
				on:toggleEvent={toggleDialog}
				title="Your Favorites"
				dataFunction={getYourFavorites}
				viewAllFunction={getAllYourFavorites}
			/>
			<!-- Playlists -->
			<PlaylistCarousel />
		{/key}
	</div>
</section>

<DisplaySongModal bind:dialogOpen={displaySongDialogOpen} bind:selectedSongId />
