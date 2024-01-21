<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { User, MoreHorizontal, LibraryBig, Trash2, Pencil, Users } from "lucide-svelte";
	import { displayToast } from "$lib/utils/toast";
	import Stars from "$lib/components/Stars.svelte";
	import { user } from "$lib/stores/user";
	import { addSong, getSongById } from "$lib/services/songService";
	import { defaultImageUrl } from "$lib/constants";
	import Spinner from "$lib/components/Spinner.svelte";
	import type { Song } from "$lib/types";
	import { deleteUserSongRating, editUserSongRating } from "$lib/services/userService";
	import { deleteFromCache, songCache } from "$lib/utils/caches";
	import { cn } from "$lib/utils";
	import { getRatingColor } from "$lib/utils/colors";
	import { fade } from "svelte/transition";
	import { refresh } from "$lib/stores/refresh";
	import ChooseFriendSuggestSong from "$lib/components/ChooseFriendSuggestSong.svelte";
	import { Icons } from "$lib/icons";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { createEventDispatcher } from "svelte";
	import { goto } from "$app/navigation";
	import { sleep } from "$lib/utils/time";

	export let dialogOpen: boolean;
	export let selectedSongId: string = "";

	const dispatch = createEventDispatcher();

	let confirmDialogOpen = false;
	let updateRatingDialogOpen = false;
	let rating = 0;
	let song: Song | null = null;
	let loading = false;
	let loadingSong = false;
	let chooseFriendDialogOpen = false;
	let addRatingDialogOpen = false;

	$: if (!dialogOpen) {
		selectedSongId = "";
		song = null;
	}

	$: if (!updateRatingDialogOpen) {
		rating = 0;
	}

	$: getSong(selectedSongId);

	async function getSong(selectedSongId: string) {
		if (selectedSongId === "") return;
		loadingSong = true;
		const token = await $user!.getIdToken();
		song = await getSongById(token, selectedSongId);
		console.log(song);
		loadingSong = false;
	}

	async function updateRating() {
		if (loading) return;
		if (rating === 0) {
			displayToast({ message: "Please select a rating", type: "error" });
			return;
		}
		loading = true;
		const token = await $user!.getIdToken();
		const response = await editUserSongRating(token, selectedSongId, rating);
		if (response.status === 201) {
			displayToast({ message: "Rating updated", type: "success" });
			deleteFromCache(songCache, selectedSongId);
		} else {
			displayToast({ message: "Error updating rating", type: "error" });
		}
		updateRatingDialogOpen = false;
		dialogOpen = false;
		loading = false;
	}

	async function deleteRating() {
		if (loading) return;
		loading = true;
		const token = await $user!.getIdToken();
		const response = await deleteUserSongRating(token, selectedSongId);
		console.log(response);
		if (response.status === 204) {
			displayToast({ message: "Rating deleted successfully", type: "success" });
			deleteFromCache(songCache, selectedSongId);
			$refresh = !$refresh;
		} else if (response.status === 404) {
			displayToast({ message: "Rating not found", type: "error" });
			deleteFromCache(songCache, selectedSongId);
			$refresh = !$refresh;
		} else {
			displayToast({ message: "Error deleting rating", type: "error" });
		}
		confirmDialogOpen = false;
		dialogOpen = false;
		loading = false;
	}

	async function addSongToLibrary() {
		if (loading) return;
		if (rating == 0) {
			displayToast({ type: "error", message: "Please select a rating" });
			return;
		}
		if (!selectedSongId) {
			displayToast({ type: "error", message: "Please select a song" });
			return;
		}
		loading = true;
		const token = await $user!.getIdToken();
		const response = await addSong(token, selectedSongId, rating);
		console.log(response);
		if (response.status >= 200 && response.status < 300) {
			displayToast({ type: "success", message: "Rating added successfully" });
			deleteFromCache(songCache, selectedSongId);
			$refresh = !$refresh;
			dispatch("songAdded", selectedSongId);
			goto("/library");
		} else if (response.status === 400) {
			displayToast({ type: "error", message: "This song is already in your library" });
		} else {
			displayToast({ type: "error", message: "Error adding song" });
		}
		addRatingDialogOpen = false;
		dialogOpen = false;
		await sleep(1);
		loading = false;
	}

	function transformDuration(duration: number) {
		const minutes = Math.floor(duration / 60);
		const seconds = duration % 60;
		return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content
		class="w-11/12 rounded-lg max-w-[90%] md:max-w-2xl lg:max-w-4xl h-[90vh] max-h-[48rem] overflow-y-auto"
	>
		<div class="flex flex-col items-center justify-center h-full py-2">
			{#if dialogOpen}
				{#if loadingSong}
					<div in:fade|global class="flex justify-center items-center">
						<Spinner class="animate-spin w-10 h-10" />
					</div>
				{:else if !song}
					<div in:fade|global class="flex justify-center items-center">
						<p class="text-center text-xl">Song not found</p>
					</div>
				{:else}
					<div in:fade|global class="w-full h-full text-start rounded-lg">
						<!-- Content -->
						<div class="flex flex-col sm:flex-row pt-2">
							<div
								class="flex flex-col gap-2 sm:flex-row items-center justify-center sm:items-start sm:justify-start"
							>
								<div class="w-48 flex-shrink-0">
									<img
										class="w-48 h-48 object-cover rounded-lg inline-block"
										alt="Cover image for {song.name}"
										src={song.img_url || defaultImageUrl}
									/>
									<a
										class="inline-flex items-center justify-center mt-2 w-full tabular-nums px-4 py-2 rounded-md border-2 text-center font-medium text-sm h-10 bg-emerald-800 hover:bg-emerald-700"
										href="https://open.spotify.com/track/{song.id}"
										target="_blank"
										rel="noopener noreferrer"
									>
										Listen On <Icons.spotify class="h-5 w-5 ml-1.5" />
									</a>
								</div>
								<div
									class="flex flex-col px-2 rounded-lg h-full align-middle justify-center items-center"
								>
									<div class="my-auto align-middle">
										<p class="text-3xl font-bold text-center sm:text-start">
											{song.name}
										</p>
										<p
											class="text-lg font-medium text-gray-300 text-center sm:text-start"
										>
											{song.albums && song.albums.length > 0 ? song.albums[0] : "Unknown"}
										</p>
										<p
											class="text font-medium opacity-70 text-gray-300 text-center sm:text-start"
										>
											{song.artists && song.artists.length > 0
												? song.artists.join(", ")
												: "Unknown"}
										</p>
									</div>
								</div>
							</div>
						</div>
						<hr class="border-zinc-700 h-1 my-2" />
						<div class="flex flex-row justify-center items-center w-full gap-2">
							<div
								class={cn(
									"flex items-center justify-center sm:min-w-[8rem] tabular-nums px-4 py-2 rounded-md border-2 text-center font-medium text-sm h-10 select-none",
									getRatingColor(song.average_rating)
								)}
							>
								<Icons.logo class="h-5 w-5 mr-1" />
								<span>
									{song.average_rating || "Unrated"}
								</span>
							</div>
							{#if !song.user_rating}
								<Button
									on:click={() => {
										addRatingDialogOpen = true;
									}}
									class={cn(
										"sm:min-w-[8rem] tabular-nums p-2 border-2",
										getRatingColor(song.average_rating)
									)}
									variant="outline">Add to<LibraryBig class="h-6 w-6 ml-1" /></Button
								>
							{:else}
								<div
									class={cn(
										"flex items-center justify-center sm:min-w-[8rem] tabular-nums px-4 py-2 rounded-md border-2 text-center font-medium text-sm h-10 select-none",
										getRatingColor(song.user_rating)
									)}
								>
									<User class="h-6 w-6 mr-1" />
									<span>{song.user_rating}</span>
								</div>
								<DropdownMenu.Root>
									<DropdownMenu.Trigger
										class={cn(
											buttonVariants({ variant: "outline" }),
											"w-10 h-10 p-0 border-2 border-zinc-700"
										)}
										><MoreHorizontal class="w-5 h-5" /><span class="sr-only">More</span>
									</DropdownMenu.Trigger>
									<DropdownMenu.Content>
										<DropdownMenu.Group>
											<DropdownMenu.Item
												on:click={() => {
													chooseFriendDialogOpen = true;
												}}
											>
												<Users class="w-4 h-4 mr-1" /> Suggest
											</DropdownMenu.Item>
											<DropdownMenu.Item
												on:click={() => {
													updateRatingDialogOpen = true;
												}}><Pencil class="w-4 h-4 mr-1" /> Edit Rating</DropdownMenu.Item
											>
											<DropdownMenu.Item
												on:click={() => {
													confirmDialogOpen = true;
												}}
												><Trash2 class="w-4 h-4 mr-1" /> Remove
											</DropdownMenu.Item>
										</DropdownMenu.Group>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							{/if}
						</div>
						<div class="my-2">
							<p class="font-bold text-lg">Genres</p>
							<p class="font-medium text-gray-300">
								{song.genres && song.genres.length > 0
									? song.genres.join(", ")
									: "Unknown"}
							</p>
						</div>
						<div class="grid gap-1 grid-rows-3 sm:grid-rows-none sm:grid-cols-3 my-2">
							<div>
								<p class="font-bold text-lg">Mood</p>
								<p class="font-medium text-gray-300">
									{song.mood || "Unknown"}
								</p>
							</div>
							<div>
								<p class="font-bold text-lg">Tempo</p>
								<p class="font-medium text-gray-300">
									{song.tempo || "Unknown"}
								</p>
							</div>
							<div>
								<p class="font-bold text-lg">Release Year</p>
								<p class="font-medium text-gray-300">
									{song.release_year || "Unknown"}
								</p>
							</div>
						</div>
						<div class="grid gap-1 grid-rows-2 sm:grid-rows-none sm:grid-cols-3 my-2">
							<div>
								<p class="font-bold text-lg">Duration</p>
								<p class="font-medium text-gray-300">
									{transformDuration(song.duration) || "Unknown"}
								</p>
							</div>
							<div>
								<p class="font-bold text-lg">Environment</p>
								<p class="font-medium text-gray-300">
									{song.recorded_environment || "Unknown"}
								</p>
							</div>
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>

<!-- Update rating modal -->
<Dialog.Root bind:open={updateRatingDialogOpen}>
	<Dialog.Content
		class="w-11/12 rounded-lg max-w-[90%] md:max-w-xl overflow-y-auto min-h-[24rem]"
	>
		<div class="pt-4 w-full flex flex-col justify-center items-center gap-4">
			<h2 class="text-lg">Choose new rating</h2>
			<div class="flex">
				<Stars bind:rating />
			</div>
			<Button
				variant="outline"
				class={cn("min-w-[12rem]", {
					"bg-emerald-800 hover:bg-emerald-700": rating !== 0,
					"opacity-50 cursor-not-allowed": loading
				})}
				on:click={updateRating}>{loading ? "Updating..." : "Update Rating"}</Button
			>
		</div>
	</Dialog.Content>
</Dialog.Root>

<!-- Confirm modal for deleting song from user's library -->
<Dialog.Root bind:open={confirmDialogOpen}>
	<Dialog.Content class="rounded-lg max-w-[16rem] sm:max-w-xs md:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Are you sure?</Dialog.Title>
			<Dialog.Description
				>This action will delete this song from your library!</Dialog.Description
			>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="destructive" class="w-full" on:click={deleteRating}
				>{loading ? "Deleting..." : "Delete"}</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Suggest to a friend modal -->
<ChooseFriendSuggestSong
	bind:dialogOpen={chooseFriendDialogOpen}
	bind:songId={selectedSongId}
/>

<!-- Add rating modal -->
<Dialog.Root bind:open={addRatingDialogOpen}>
	<Dialog.Content
		class="w-11/12 rounded-lg max-w-[90%] md:max-w-xl overflow-y-auto min-h-[24rem]"
	>
		<div class="pt-4 w-full flex flex-col justify-center items-center gap-4">
			<h2 class="text-lg">Choose rating</h2>
			<div class="flex">
				<Stars bind:rating />
			</div>
			<Button
				variant="outline"
				class={cn("min-w-[12rem]", {
					"bg-emerald-800 hover:bg-emerald-700": rating !== 0,
					"opacity-50 cursor-not-allowed": loading
				})}
				on:click={addSongToLibrary}>{loading ? "Adding..." : "Add Song"}</Button
			>
		</div>
	</Dialog.Content>
</Dialog.Root>
