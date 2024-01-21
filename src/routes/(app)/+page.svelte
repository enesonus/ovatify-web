<script lang="ts">
	import { user } from "$lib/stores/user";
	import SongCarousel from "$lib/components/SongCarousel.svelte";
	import GenreCarousel from "$lib/components/GenreCarousel.svelte";
	import DisplaySongModal from "$lib/components/DisplaySongModal.svelte";
	import { getAllRecentSongs } from "$lib/services/songService";
	import { getRandomSongGenres } from "$lib/services/genreService";
	import { userData } from "$lib/stores/userData";
	import YouMightLike from "./YouMightLike.svelte";
	import { refresh } from "$lib/stores/refresh";
	import { onMount } from "svelte";
	import { sleep } from "$lib/utils/time";
	import {
		getFriendSuggestionCount,
		setFriendSuggestionsAsSeen
	} from "$lib/services/friendService";
	import { displayToast } from "$lib/utils/toast";

	let dialogOpen = false;
	let selectedSongId: string = "";

	async function getRecentAdditions() {
		const token = await $user!.getIdToken();
		const response = await getAllRecentSongs(token);
		return response;
	}

	async function getGenres() {
		const token = await $user!.getIdToken();
		const response = await getRandomSongGenres(token, 10);
		return response;
	}

	// React to event to get selected song id when an element in the carousel is clicked
	function toggleDialog(event: CustomEvent<string>) {
		selectedSongId = event.detail;
		dialogOpen = !dialogOpen;
	}

	onMount(async () => {
		await sleep(1);
		const token = await $user!.getIdToken();
		const response = await getFriendSuggestionCount(token);
		console.log(response);
		if (response.status === 200) {
			const count = response.data.count;
			if (count && count > 0) {
				displayToast({
					message: `You have ${count} unread ${
						count > 1 ? "suggestions" : "suggestion"
					}}`,
					type: "success"
				});
				const setSeenResponse = await setFriendSuggestionsAsSeen(token);
				if (setSeenResponse.status === 200) {
					console.log("Friend suggestions marked as seen");
				} else {
					console.log("Error marking friend suggestions as seen");
				}
			} else {
				console.log("No unread suggestions");
			}
		} else {
			console.log("Error getting friend suggestion count");
		}
	});
</script>

<section class="min-h-[100dvh]">
	<div class="flex flex-col gap-4">
		<!-- Welcome -->
		<h1 class="text-center sm:text-start text-2xl font-bold">
			Welcome, {$userData.name}
		</h1>
		<!-- Music you might like & Stats -->
		<div class="flex items-center md:pr-8">
			<!-- Music you might like -->
			<YouMightLike on:toggleEvent={toggleDialog} />
		</div>
		<!-- Newly added and Genres -->
		<div class="flex flex-col gap-2 pb-4">
			<!-- Newly Added -->
			{#key $refresh}
				<SongCarousel
					title="Newly added"
					on:toggleEvent={toggleDialog}
					dataFunction={getRecentAdditions}
				/>
				<!-- Genres -->
				<GenreCarousel
					title="Genres"
					dataFunction={getGenres}
					on:toggleEvent={toggleDialog}
				/>
			{/key}
		</div>
	</div>
</section>

<DisplaySongModal bind:dialogOpen bind:selectedSongId />
