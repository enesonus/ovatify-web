<script lang="ts">
	import { user } from "$lib/stores/user";
	import Carousel from "$lib/components/Carousel.svelte";
	import DisplaySongModal from "./DisplaySongModal.svelte";
	import { getAllRecentSongs } from "$lib/services/songService";
	import { sleep } from "$lib/utils/time";
	import { userData } from "$lib/stores/userData";
	import { fade } from "svelte/transition";
	import YouMightLike from "./YouMightLike.svelte";
	import RandomChart from "./RandomChart.svelte";

	let dialogIsOpen = false;
	let selectedSongId: string = "";
	let refreshNewlyAdded = false;

	async function getRecentAdditions() {
		const token = await $user!.getIdToken();
		const response = await getAllRecentSongs(token);
		return response;
	}

	async function getGenres() {
		await sleep(Math.random() * 2);
		return [];
	}

	// React to event to get selected song id when an element in the carousel is clicked
	function toggleDialog(event: CustomEvent<string>) {
		selectedSongId = event.detail;
		dialogIsOpen = !dialogIsOpen;
	}
</script>

<section class="min-h-screen">
	<div class="flex flex-col gap-4">
		<!-- Welcome -->
		<h1 class="text-2xl font-bold">
			Welcome, {$userData.name ?? "User"}
		</h1>
		<!-- Music you might like & Stats -->
		<div class="flex flex-col md:flex-row">
			<!-- Music you might like -->
			<YouMightLike />
			<!-- Stats -->
			<div class="flex flex-grow justify-center items-center">
				<RandomChart />
			</div>
		</div>
		<!-- Newly added and Genres -->
		<div class="flex flex-col gap-2">
			<!-- Newly Added -->
			{#key refreshNewlyAdded}
				<Carousel
					title="Newly added"
					on:toggleEvent={toggleDialog}
					functionToCall={getRecentAdditions}
				/>
			{/key}
			<!-- Genres -->
			<div>
				<Carousel
					title="Genres"
					on:toggleEvent={toggleDialog}
					functionToCall={getGenres}
				/>
			</div>
		</div>
	</div>
	<!-- Hidden dialog -->
	<DisplaySongModal
		bind:dialogIsOpen
		bind:selectedSongId
		bind:refresh={refreshNewlyAdded}
	/>
</section>
