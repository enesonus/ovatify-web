<script lang="ts">
	import { user } from "$lib/stores/user";
	import Carousel from "./Carousel.svelte";
	import RecentRatingsChart from "$lib/components/charts/RecentRatingsChart.svelte";
	import DisplaySongModal from "./DisplaySongModal.svelte";
	import { placeholderImageUrl } from "$lib/constants";

	let dialogIsOpen = false;
	let selectedSongId: any;

	// Handles communication between Carousel and DisplaySongModal
	function toggleDialog(data: any) {
		console.log(data.detail);
		selectedSongId = data.detail;
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
					{#each { length: 4 } as _}
						<div class="flex justify-center items-center">
							<img src={placeholderImageUrl} class="w-16 h-16 object-cover" alt="" />
							<div class="text-sm pl-2">
								<p class="font-semibold">Sanctuary in Dying Light</p>
								<p class="font-light">The Luna Sequence</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
			<!-- Stats -->
			<div class="flex flex-grow justify-center items-center">
				<RecentRatingsChart />
			</div>
		</div>
		<!-- Newly Added -->
		<div>
			<Carousel title="Newly added" on:toggleDialog={toggleDialog} />
		</div>
		<!-- Categories -->
		<div>
			<Carousel title="Categories" />
		</div>
	</div>
	<!-- Hidden dialog -->
	<DisplaySongModal bind:dialogIsOpen bind:selectedSongId />
</section>
