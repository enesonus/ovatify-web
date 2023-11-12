<script lang="ts">
	import { goto } from "$app/navigation";
	import { user } from "$lib/stores/user";
	import { displayToast } from "$lib/utils/toast";
	import { onDestroy } from "svelte";
	import Carousel from "./Carousel.svelte";

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
				<div class="w-fit">
					<img
						src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						class="w-96 rounded-lg"
						alt=""
					/>
				</div>
			</div>
		</div>
		<!-- Newly Added -->
		<div>
			<Carousel title="Newly added" />
		</div>
		<!-- Categories -->
		<div>
			<Carousel title="Categories" />
		</div>
	</div>
</section>

<style lang="postcss">
	img {
		object-fit: cover;
	}
</style>
