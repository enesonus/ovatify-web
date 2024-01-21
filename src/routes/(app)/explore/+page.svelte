<script lang="ts">
	import { user } from "$lib/stores/user";
	import SongCarousel from "$lib/components/SongCarousel.svelte";
	import DisplaySongModal from "$lib/components/DisplaySongModal.svelte";
	import { refresh } from "$lib/stores/refresh";
	import {
		recommendFriendMix,
		recommendFriendsListen,
		recommendSinceYouLike,
		recommendYouMightLike
	} from "$lib/services/recommendationService";
	import { displayToast } from "$lib/utils/toast";
	import type { CarouselSong } from "$lib/types";
	import Spinner from "$lib/components/Spinner.svelte";
	import { onDestroy } from "svelte";

	let dialogOpen = false;
	let selectedSongId: string = "";
	let noFriends = false;

	async function getYouMightLike() {
		const token = await $user!.getIdToken();
		const response = await recommendYouMightLike(token, 10);
		console.log(response);
		if (response.status !== 200) {
			return [];
		}
		return response.data.tracks_info as CarouselSong[];
	}

	async function getFriendsListen() {
		noFriends = false;
		const token = await $user!.getIdToken();
		const response = await recommendFriendsListen(token, 10);
		console.log(response);
		if (response.status === 200) {
			return response.data.tracks_info;
		} else if (
			response.status === 404 &&
			response.data.error === "No friends found for the user, cannot make recommendation"
		) {
			noFriends = true;
			const friendsWarningShown = sessionStorage.getItem("friendsWarningShown");
			if (!friendsWarningShown) {
				displayToast({
					message:
						"Add friends and make sure they have sharing enabled to receive friend recommendations",
					type: "error"
				});
				sessionStorage.setItem("friendsWarningShown", "true");
			}
		} else {
			displayToast({ message: "Error getting friends listen", type: "error" });
		}
		return [];
	}

	async function getFriendMix() {
		const token = await $user!.getIdToken();
		const response = await recommendFriendMix(token, 10);
		console.log(response);
		if (response.status === 200) {
			return response.data.tracks_info;
		} else if (
			response.status === 404 &&
			response.data.error === "No friends found for the user, cannot make recommendation"
		) {
			console.log("No friends found for the user, cannot make recommendation");
		} else {
			displayToast({ message: "Error getting friend mix", type: "error" });
		}
		return [];
	}

	async function getSinceYouLike() {
		const token = await $user!.getIdToken();
		const response = await recommendSinceYouLike(token, 10);
		console.log(response);
		if (response.status !== 200) {
			return {};
		}
		return response.data.tracks_info;
	}

	// React to event to get selected song id when an element in the carousel is clicked
	function toggleDialog(event: CustomEvent<string>) {
		selectedSongId = event.detail;
		dialogOpen = !dialogOpen;
	}

	onDestroy(() => {});
</script>

<section>
	<div class="flex flex-col gap-4">
		<h1 class="text-center sm:text-start text-2xl font-bold">Explore</h1>
		<div class="flex flex-col gap-2 pb-4">
			<!-- Newly Added -->
			{#key $refresh}
				<SongCarousel
					title="You might like"
					on:toggleEvent={toggleDialog}
					dataFunction={getYouMightLike}
				/>
				{#if !noFriends}
					<SongCarousel
						title="Your friends like"
						on:toggleEvent={toggleDialog}
						dataFunction={getFriendsListen}
					/>
					<SongCarousel
						title="Friend Mix"
						on:toggleEvent={toggleDialog}
						dataFunction={getFriendMix}
					/>
				{:else}
					<div class="flex flex-col justify-center pt-2">
						<h2 class="text-lg font-semibold">Your friends like</h2>
						<p class="pt-4">Add friends to receive friend recommendations</p>
					</div>
				{/if}
				{#await getSinceYouLike()}
					<div class="flex items-center justify-center h-[58rem] w-full">
						<Spinner class="w-12 h-12 animate-spin" />
					</div>
				{:then data}
					{#if Object.keys(data).length > 0}
						{#each Object.keys(data) as item}
							<SongCarousel
								title={`Since you like ${item}`}
								on:toggleEvent={toggleDialog}
								dataFunction={() => Promise.resolve(data[item])}
							/>
						{/each}
					{/if}
				{/await}
			{/key}
		</div>
	</div>
	<!-- Hidden dialog -->
	<DisplaySongModal bind:dialogOpen bind:selectedSongId />
</section>
