<script lang="ts">
	import SongDetailsModal from "./EditSongModal.svelte";
	import Carousel from "$lib/components/Carousel.svelte";
	import { Button } from "$lib/components/ui/button";
	import SongFileComboUpload from "./SongFileUploadModal.svelte";
	import { displayToast } from "$lib/utils/toast";
	import { user } from "$lib/stores/user";
	import Spinner from "$lib/components/Spinner.svelte";
	import { getRecentlyAddedSongs, getUserFavorites } from "$lib/services/userService";
	import { sleep } from "$lib/utils/time";

	let dialogIsOpen = false;
	let activeTab: string = "Playlists";
	let refreshRecents = false;
	let selectedSongId: string = "";

	// Gets data to fill the carousel with recent song additions by the user
	async function getRecentAdditions() {
		const token = await $user?.getIdToken();
		if (!token) {
			console.log("No token");
			return [];
		}
		const response = await getRecentlyAddedSongs(token);
		if (response.status !== 200) {
			displayToast({ message: "Error getting recent additions", type: "error" });
			return [];
		}
		return response.data.songs;
	}

	// Gets data to fill the carousel with the user's favorite songs
	async function getYourFavorites() {
		const token = await $user?.getIdToken();
		if (!token) {
			console.log("No token");
			return [];
		}
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
		<!-- Buttons to tab through different sections, do nothing for now -->
		<div class="flex gap-2">
			{#each ["Playlists", "Songs", "Albums", "Artists"] as item}
				<Button
					variant="outline"
					on:click={() => (activeTab = item)}
					class={`rounded-lg hover:bg-slate-600 ${
						item === activeTab ? "bg-slate-600" : "bg-[#292929]"
					}`}>{item}</Button
				>
			{/each}
			<div class="ml-auto">
				<SongFileComboUpload bind:refresh={refreshRecents} />
			</div>
		</div>
		<!-- Recent Additions -->
		{#key refreshRecents}
			<div>
				{#await getRecentAdditions()}
					<!-- Show skeleton state -->
					<div>
						<Spinner class="animate-spin" />
					</div>
				{:then data}
					<Carousel on:toggleEvent={toggleDialog} title="Recent Additions" {data} />
				{:catch}
					<div>Error fetching data</div>
				{/await}
			</div>
		{/key}
		<!-- Favorites -->
		{#key refreshRecents}
			<div>
				{#await getYourFavorites()}
					<!-- Show skeleton state -->
					<div>
						<Spinner class="animate-spin" />
					</div>
				{:then data}
					<Carousel on:toggleEvent={toggleDialog} title="Your Favorites" {data} />
				{:catch}
					<div>Error fetching data</div>
				{/await}
			</div>
		{/key}
		<!-- Friend Groups -->
		<div>
			{#await getFriendGroups()}
				<!-- Show skeleton state -->
				<div>
					<Spinner class="animate-spin" />
				</div>
			{:then data}
				<Carousel on:toggleEvent={toggleDialog} title="Friend Groups" {data} />
			{:catch}
				<div>Error fetching data</div>
			{/await}
		</div>
	</div>
	<!-- Modal for detailed music information -->
	<SongDetailsModal bind:dialogIsOpen bind:selectedSongId />
</section>
