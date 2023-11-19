<script lang="ts">
	import { user } from "$lib/stores/user";
	import Carousel from "./Carousel.svelte";
	import RecentRatingsChart from "$lib/components/charts/RecentRatingsChart.svelte";
	import * as Dialog from "$lib/components/ui/dialog";

	let dialogIsOpen = false;

	function toggleDialog() {
		dialogIsOpen = !dialogIsOpen;
	}
	const placeholderImageUrl =
		"https://images.unsplash.com/photo-1496208612508-eb52fba7d94e?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
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
					{#each [1, 2, 3, 4] as _}
						<div class="flex justify-center items-center">
							<img src={placeholderImageUrl} class="w-16 h-16" alt="" />
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
	<Dialog.Root bind:open={dialogIsOpen}>
		<Dialog.Content class="min-w-[48rem] min-h-[90vh] ">
			<div class="flex flex-col items-center justify-center">
				<h1>1989 (Taylor's Version)</h1>
				<img src={placeholderImageUrl} alt="" class="w-64" />
				<p>Taylor Swift</p>
			</div>
		</Dialog.Content>
	</Dialog.Root>
</section>

<style lang="postcss">
	img {
		object-fit: cover;
	}
</style>
