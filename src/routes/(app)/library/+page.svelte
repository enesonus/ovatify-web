<script lang="ts">
	import SongDetailsModal from "./EditSongModal.svelte";
	import Carousel from "$lib/components/Carousel.svelte";
	import SongFileComboUpload from "./SongFileUploadModal.svelte";
	import { displayToast } from "$lib/utils/toast";
	import { user } from "$lib/stores/user";
	import { getRecentlyAddedSongs, getUserFavorites } from "$lib/services/userService";
	import { sleep } from "$lib/utils/time";

	let dialogIsOpen = false;
	let refreshRecents = false;
	let selectedSongId: string = "";

	// Gets data to fill the carousel with recent song additions by the user
	async function getRecentAdditions() {
		const token = await $user!.getIdToken();
		const response = await getRecentlyAddedSongs(token);
		if (response.status !== 200) {
			displayToast({ message: "Error getting recent additions", type: "error" });
			return [];
		}
		return response.data.songs;
	}

	// Gets data to fill the carousel with the user's favorite songs
	async function getYourFavorites() {
		const token = await $user!.getIdToken();
		const response = await getUserFavorites(token);
		if (response.status !== 200) {
			displayToast({ message: "Error getting favorites", type: "error" });
			return [];
		}
		console.log("favorites", response.data.songs);
		return response.data.songs;
	}

	// Gets data to fill the carousel with songs from the user's friend groups - WIP
	async function getFriendGroups() {
		await sleep(1);
		return [];
	}

	function toggleDialog(event: CustomEvent<string>) {
		selectedSongId = event.detail;
		console.log("selected song id", selectedSongId);
		dialogIsOpen = !dialogIsOpen;
	}
</script>

<section class="min-h-screen">
	<div class="flex flex-col gap-4">
		<div class="ml-auto pr-8">
			<SongFileComboUpload bind:refresh={refreshRecents} />
		</div>
		<!-- Recent Additions -->
		{#key refreshRecents}
			<Carousel
				on:toggleEvent={toggleDialog}
				title="Recent Additions"
				functionToCall={getRecentAdditions}
			/>
			<!-- Favorites -->
			<Carousel
				on:toggleEvent={toggleDialog}
				title="Your Favorites"
				functionToCall={getYourFavorites}
			/>
		{/key}
		<!-- Friend Groups -->
		<Carousel
			on:toggleEvent={toggleDialog}
			title="Friend Groups"
			functionToCall={getFriendGroups}
		/>
	</div>
	<!-- Modal for detailed music information -->
	<SongDetailsModal bind:dialogIsOpen bind:selectedSongId bind:refresh={refreshRecents} />
</section>
