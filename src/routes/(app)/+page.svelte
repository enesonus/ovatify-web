<script lang="ts">
	import { user } from "$lib/stores/user";
	import Carousel from "$lib/components/Carousel.svelte";
	import RecentRatingsChart from "$lib/components/charts/RecentRatingsChart.svelte";
	import DisplaySongModal from "./DisplaySongModal.svelte";
	import { placeholderImageUrl } from "$lib/constants";
	import Spinner from "$lib/components/Spinner.svelte";
	import { getAllRecentSongs } from "$lib/services/songService";
	import { sleep } from "$lib/utils/time";

	let dialogIsOpen = false;
	let selectedSongId: string = "";

	async function getMusicYouMightLike() {
		await sleep(Math.random() * 2);
		return [1, 2, 3, 4];
	}

	async function getRandomChart() {
		await sleep(Math.random() * 2);
		return [];
	}

	async function getRecentAdditions() {
		const token = await $user?.getIdToken();
		if (!token) {
			console.log("No token");
			return [];
		}
		const response = await getAllRecentSongs(token);
		return response;
	}

	async function getCategories() {
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
		{#if $user}
			<h1 class="text-2xl font-bold">Welcome, {$user.email}</h1>
		{:else}
			<h1 class="text-2xl font-bold">Welcome, User</h1>
		{/if}
		<!-- Music you might like & Stats -->
		<div class="flex flex-row">
			<!-- Music you might like -->
			<div class="flex flex-col py-4 pr-4">
				<h2 class="pb-4">Music you might like</h2>
				<div class="grid grid-cols-2 gap-x-8 gap-y-4">
					{#await getMusicYouMightLike()}
						<div>
							<Spinner class="animate-spin" />
						</div>
					{:then data}
						{#each data as _}
							<div class="flex justify-center items-center">
								<img src={placeholderImageUrl} class="w-16 h-16 object-cover" alt="" />
								<div class="text-sm pl-2">
									<p class="font-semibold">Sanctuary in Dying Light</p>
									<p class="font-light">The Luna Sequence</p>
								</div>
							</div>
						{/each}
					{:catch}
						<div>Error fetching data</div>
					{/await}
				</div>
			</div>
			<!-- Stats -->
			<div class="flex flex-grow justify-center items-center">
				{#await getRandomChart()}
					<div>
						<Spinner class="animate-spin" />
					</div>
				{:then _}
					<RecentRatingsChart />
				{/await}
			</div>
		</div>
		<!-- Newly added and Categories -->
		<div class="flex flex-col gap-2">
			<!-- Newly Added -->
			<div>
				{#await getRecentAdditions()}
					<!-- Show skeleton state -->
					<div>
						<Spinner class="animate-spin" />
					</div>
				{:then data}
					<Carousel title="Newly added" on:toggleEvent={toggleDialog} {data} />
				{:catch}
					<div>Error fetching data</div>
				{/await}
			</div>
			<!-- Categories -->
			<div>
				{#await getCategories()}
					<!-- Show skeleton state -->
					<div>
						<Spinner class="animate-spin" />
					</div>
				{:then data}
					<Carousel title="Categories" on:toggleEvent={toggleDialog} {data} />
				{:catch}
					<div>Error fetching data</div>
				{/await}
			</div>
		</div>
	</div>
	<!-- Hidden dialog -->
	<DisplaySongModal bind:dialogIsOpen bind:selectedSongId />
</section>
