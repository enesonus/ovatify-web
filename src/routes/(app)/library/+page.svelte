<script lang="ts">
	import Carousel from "../Carousel.svelte";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import { getFriendGroups, getRecentAdditions } from "./getData";
	import SongFileComboUpload from "./SongFileComboUpload.svelte";
	import { CheckCircle2, XCircle, Trash2, Edit } from "lucide-svelte";
	import { displayToast } from "$lib/utils/toast";
	import Stars from "$lib/components/Stars.svelte";
	import { fade } from "svelte/transition";
	import { user } from "$lib/stores/user";
	import { goto } from "$app/navigation";
	import { updateSong } from "$lib/services/songService";

	let displaySongDialogIsOpen = false;
	let confirmDialogIsOpen = false;
	let activeTab: string = "Playlists";
	let rating = 0;
	let editMode = false;
	let selectedSong: any;

	async function updateRating() {
		editMode = false;
		displayToast({ message: "Rating updated", type: "success" });
		if (!$user) {
			displayToast({ message: "Please login to rate songs", type: "error" });
			goto("/login");
			return;
		}
		const token = await $user.getIdToken();
		const body = {
			songId: selectedSong.id,
			rating: rating
		};
		const response = await updateSong(token, body);
		if (response.status !== 204) {
			displayToast({ message: "Error updating rating", type: "error" });
		}
		selectedSong = null;
	}

	async function deleteRating() {
		confirmDialogIsOpen = false;
		displayToast({ message: "Deleted", type: "success" });
	}

	function toggleDialog(element: any) {
		selectedSong = element.detail;
		displaySongDialogIsOpen = !displaySongDialogIsOpen;
	}

	const placeholderImageUrl =
		"https://images.unsplash.com/photo-1496208612508-eb52fba7d94e?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
</script>

<section class="min-h-screen">
	<div class="flex flex-col gap-4">
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
				<SongFileComboUpload />
			</div>
		</div>
		<!-- Recent Additions -->
		<div>
			{#await getRecentAdditions()}
				<!-- Show skeleton state -->
				<div>Loading...</div>
			{:then data}
				<Carousel on:toggleDialog={toggleDialog} title="Recent Additions" {data} />
			{:catch}
				<div>Error fetching data</div>
			{/await}
		</div>
		<!-- Friend Groups -->
		<div>
			{#await getFriendGroups()}
				<!-- Show skeleton state -->
				<div>Loading...</div>
			{:then data}
				<Carousel on:toggleDialog={toggleDialog} title="Friend Groups" {data} />
			{:catch}
				<div>Error fetching data</div>
			{/await}
		</div>
	</div>
	<!-- Modal for detailed music information -->
	<Dialog.Root bind:open={displaySongDialogIsOpen}>
		<Dialog.Content
			class="w-11/12 rounded-lg max-w-[90%] md:max-w-2xl h-[90vh] overflow-y-auto"
		>
			<div class=" relative flex flex-col items-center">
				<div
					class="flex flex-col w-full justify-center items-center text-start break-all"
				>
					<img src={placeholderImageUrl} alt="" class="w-64 object-cover" />
					<h1 class="font-bold text-xl px-2 w-full">{selectedSong.name ?? "Name"}</h1>
					<h2 class="w-full px-2">
						{selectedSong.artists ? selectedSong.artists.join(", ") : "Artists"}
					</h2>
					<p class="w-full px-2">
						Album: {selectedSong.album ?? "Album"}
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
						{#if !editMode}
							<p class="px-2 tabular-nums">Your Rating: {selectedSong.rating ?? 5}</p>
						{:else}
							<p class="px-2 tabular-nums">New Rating: {rating}</p>
						{/if}
						{#if !editMode}
							<Button
								variant="outline"
								on:click={() => {
									editMode = true;
								}}
								class="w-6 h-6 p-0"
							>
								<Edit class="w-4 h-4" />
							</Button>
							<Button
								variant="outline"
								on:click={() => {
									confirmDialogIsOpen = true;
								}}
								class="w-6 h-6 p-0"
							>
								<Trash2 class="w-4 h-4" />
							</Button>
						{/if}
					</div>
					{#if editMode}
						<div transition:fade class="flex justify-center items-center h-8">
							<Stars bind:rating />
							<Button variant="outline" on:click={updateRating} class=" w-6 h-6 p-0 ml-1">
								<CheckCircle2 class="w-4 h-4" />
							</Button>
							<Button
								variant="outline"
								on:click={() => {
									editMode = false;
								}}
								class=" w-6 h-6 p-0"
							>
								<XCircle class="w-4 h-4" />
							</Button>
						</div>
					{/if}
				</div>
			</div>
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
				<Button variant="destructive" on:click={deleteRating}>Delete</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</section>
