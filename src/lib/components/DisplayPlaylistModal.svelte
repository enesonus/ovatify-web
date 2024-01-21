<script lang="ts">
	import { user } from "$lib/stores/user";
	import * as Dialog from "$lib/components/ui/dialog";
	import Spinner from "$lib/components/Spinner.svelte";
	import { defaultImageUrl } from "$lib/constants";
	import type { Playlist, Song } from "$lib/types";
	import { displayToast } from "$lib/utils/toast";
	import { cn } from "$lib/utils";
	import { fade } from "svelte/transition";
	import { createEventDispatcher } from "svelte";
	import {
		deletePlaylist,
		getPlaylistById,
		editPlaylist,
		removeSongFromPlaylist
	} from "$lib/services/playlistService";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Label } from "$lib/components/ui/label";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { deleteFromCache, playlistCache } from "$lib/utils/caches";
	import AddSongPlaylistModal from "./AddSongPlaylistModal.svelte";
	import DisplaySongModal from "$lib/components/DisplaySongModal.svelte";
	import { Pencil, Plus, Trash2, MinusCircle } from "lucide-svelte";
	import { Icons } from "$lib/icons";
	import { spotify } from "$lib/utils/spotify";
	import { disabledBtn } from "$lib/utils/colors";
	import { sleep } from "$lib/utils/time";

	export let dialogOpen: boolean;
	export let selectedPlaylistId: string | null;

	let selectedSongId: string = "";

	let playlist: Playlist | null = null;
	let loadingPlaylist = false;
	let loading = false;
	let addSongPlaylistDialogOpen = false;
	let editPlaylistDialogOpen = false;
	let deleteConfirmDialogOpen = false;
	let songDetailsDialogOpen = false;
	let importPlaylistSpotifyDialogOpen = false;

	let refresh = false;

	const dispatch = createEventDispatcher();

	$: if (!dialogOpen) {
		selectedPlaylistId = null;
		playlist = null;
	}

	$: getPlaylist(selectedPlaylistId, refresh);

	async function getPlaylist(selectedPlaylistId: string | null, refresh: boolean) {
		if (!selectedPlaylistId) return;
		console.log(`Getting playlist ${selectedPlaylistId}`);
		loadingPlaylist = true;
		const token = await $user!.getIdToken();
		playlist = await getPlaylistById(token, selectedPlaylistId);
		console.log(`Selected playlist:`, playlist);
		loadingPlaylist = false;
	}

	async function handleEditPlaylist(e: SubmitEvent) {
		if (loading) return;
		const formData = new FormData(e.target as HTMLFormElement);
		let newPlaylistName = (formData.get("playlist-name") as string) || "";
		let newPlaylistDescription = (formData.get("playlist-description") as string) || "";
		newPlaylistName = newPlaylistName.trim();
		newPlaylistDescription = newPlaylistDescription.trim();
		if (
			newPlaylistName === playlist?.name &&
			newPlaylistDescription === playlist?.description
		) {
			editPlaylistDialogOpen = false;
			return;
		}
		if (!newPlaylistName) {
			displayToast({ message: "Playlist name cannot be empty", type: "error" });
			return;
		}
		if (newPlaylistName.length > 25) {
			displayToast({
				message: "Playlist name cannot be longer than 25 characters",
				type: "error"
			});
			return;
		}
		loading = true;
		const token = await $user!.getIdToken();
		const response = await editPlaylist(token, {
			playlist_id: selectedPlaylistId!,
			name: newPlaylistName,
			description: newPlaylistDescription
		});
		if (response.status === 200) {
			displayToast({ message: "Playlist updated successfully", type: "success" });
			deleteFromCache(playlistCache, selectedPlaylistId!);
			editPlaylistDialogOpen = false;
			refresh = !refresh;
			dispatch("refresh");
		} else {
			displayToast({ message: "Error updating playlist", type: "error" });
		}
		loading = false;
	}

	async function handleDeleteSongFromPlaylist(songId: string) {
		if (loading) return;
		loading = true;
		const token = await $user!.getIdToken();
		const response = await removeSongFromPlaylist(token, selectedPlaylistId!, songId);
		if (response.status === 200) {
			displayToast({
				message: "Song removed from playlist successfully",
				type: "success"
			});
			deleteFromCache(playlistCache, selectedPlaylistId!);
			refresh = !refresh;
			dispatch("refresh");
		} else {
			displayToast({ message: "Error removing song from playlist", type: "error" });
		}
		loading = false;
	}

	async function handleDeletePlaylist() {
		if (loading) return;
		loading = true;
		const token = await $user!.getIdToken();
		const response = await deletePlaylist(token, selectedPlaylistId!);
		if (response.status === 200) {
			displayToast({ message: "Playlist deleted successfully", type: "success" });
			deleteFromCache(playlistCache, selectedPlaylistId!);
			deleteConfirmDialogOpen = false;
			dialogOpen = false;
			dispatch("refresh");
		} else {
			displayToast({ message: "Error deleting playlist", type: "error" });
		}
		loading = false;
	}

	async function handleOpenImportSpotifyDialog() {
		if (playlist!.songs.length < 3) {
			displayToast({
				message: "Add at least 3 songs to the playlist to import the playlist to Spotify",
				type: "error"
			});
			return;
		}
		if (loading) return;
		const spotifyToken = await spotify.getAccessToken();
		if (!spotifyToken) {
			await spotify.authenticate();
			return;
		}
		importPlaylistSpotifyDialogOpen = true;
	}

	async function handleImportSpotify() {
		if (loading) return;
		const spotifyToken = await spotify.getAccessToken();
		if (!spotifyToken) {
			await spotify.authenticate();
			return;
		}
		loading = true;
		const { id: user_id } = await spotify.currentUser.profile();
		if (!playlist) {
			displayToast({ message: "Error importing playlist", type: "error" });
			return;
		}
		const createdPlaylist = await spotify.playlists.createPlaylist(user_id, {
			name: playlist.name,
			description: playlist.description
		});
		if (playlist.songs.length > 0) {
			await spotify.playlists.addItemsToPlaylist(
				createdPlaylist.id,
				playlist.songs.map((song) => `spotify:track:${song.id}`)
			);
		}
		displayToast({
			message: "Playlist imported to Spotify successfully",
			type: "success"
		});
		importPlaylistSpotifyDialogOpen = false;
		loading = false;
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content
		class="w-11/12 rounded-lg max-w-[90%] md:max-w-2xl lg:max-w-4xl h-[90vh] max-h-[48rem] px-4"
	>
		<div class="flex mt-4 w-full overflow-y-auto rounded-lg bg-zinc-900">
			{#if loadingPlaylist}
				<div in:fade|global class="flex justify-center items-center w-full">
					<Spinner class="animate-spin w-10 h-10" />
				</div>
			{:else if !playlist}
				<div in:fade|global class="flex justify-center items-center w-full">
					<p class="text-center text-xl">Playlist not found</p>
				</div>
			{:else}
				<div in:fade|global class="flex flex-col w-full h-full">
					<div class="flex flex-col sm:flex-row items-center">
						{#if playlist.songs.length < 4}
							<div class="px-4 pt-4 pb-2 flex-shrink-0">
								<img
									class="w-48 h-48 object-cover rounded-lg"
									src={playlist.songs.at(0)?.img_url || defaultImageUrl}
									alt={playlist.songs.at(0)?.name || playlist.name}
								/>
							</div>
						{:else}
							<div class="grid grid-cols-2 px-4 pt-4 pb-2 flex-shrink-0">
								{#each playlist.songs.slice(0, 4) as song, index}
									<img
										class={cn("w-24 h-24 object-cover", {
											"rounded-tl-lg": index === 0,
											"rounded-tr-lg": index === 1,
											"rounded-bl-lg": index === 2,
											"rounded-br-lg": index === 3
										})}
										src={song.img_url || defaultImageUrl}
										alt={song.name}
									/>
								{/each}
							</div>
						{/if}
						<div class="grid break-all w-full px-4 py-2 sm:px-2 gap-1">
							<h1 class="text-4xl font-bold text-center sm:text-start">
								{playlist.name}
							</h1>
							<h2 class="font-light">{playlist.description}</h2>
						</div>
					</div>
					<div class="flex px-4 gap-1 items-center">
						<Button
							variant="outline"
							class={cn("p-0 h-10 w-10", disabledBtn(loading))}
							on:click={() => {
								if (!loading) {
									addSongPlaylistDialogOpen = true;
								}
							}}><Plus /><span class="sr-only">Add Song</span></Button
						>
						<Button
							variant="outline"
							class={cn("p-0 h-10 w-10", disabledBtn(loading))}
							on:click={() => {
								if (!loading) {
									editPlaylistDialogOpen = true;
								}
							}}><Pencil /><span class="sr-only">Edit Playlist</span></Button
						>
						<Button
							variant="outline"
							class={cn("p-0 h-10 w-10", disabledBtn(loading))}
							on:click={() => {
								if (!loading) {
									deleteConfirmDialogOpen = true;
								}
							}}><Trash2 /><span class="sr-only">Delete Playlist</span></Button
						>
						<Button
							variant="outline"
							class={cn("p-0 h-10 w-10", disabledBtn(loading))}
							on:click={handleOpenImportSpotifyDialog}
							><Icons.spotify class="h-6 w-6" /><span class="sr-only"
								>Import to Spotify</span
							></Button
						>
					</div>
					<div class="flex flex-col items-center px-2">
						{#if playlist.songs.length === 0}
							<div
								class="grid grid-cols-[auto,1fr,1fr,1fr,auto] items-center justify-center text-white gap-x-2 sm:gap-x-4 w-full p-1"
							>
								<div class="hidden sm:block sm:w-12 h-4" />
								<p class="sm:hidden pl-2">Title</p>
								<p class="truncate hidden sm:block">Name</p>
								<p class="truncate hidden sm:block">Artist</p>
								<p class="truncate hidden sm:block">Release Year</p>
							</div>
							<hr class="border-white w-full mb-2" />
						{:else}
							<div
								class="grid grid-cols-[auto,1fr,1fr,1fr,auto] items-center justify-center text-white gap-x-2 sm:gap-x-4 w-full p-1"
							>
								<div class="hidden sm:block sm:w-12 h-4" />
								<p class="sm:hidden pl-2">Title</p>
								<p class="truncate hidden sm:block">Name</p>
								<p class="truncate hidden sm:block">Artist</p>
								<p class="truncate hidden sm:block">Release Year</p>
								<div class="hidden sm:block sm:w-12 h-4" />
							</div>
							<hr class="border-white w-full mb-2" />
							<div class="flex flex-col w-full">
								{#each playlist.songs as song}
									<button
										on:click={() => {
											if (!loading) {
												selectedSongId = song.id;
												songDetailsDialogOpen = true;
											}
										}}
										class={cn(
											"w-full p-1 rounded-lg hover:bg-zinc-800 transition ease-in-out delay-[25ms]",
											disabledBtn(loading)
										)}
									>
										<div
											class="sm:hidden grid grid-cols-[auto,1fr,auto] items-center gap-2"
										>
											<img
												src={song.img_url}
												alt={song.name}
												class="inline-block w-16 h-16 object-cover rounded-lg"
											/>
											<div class="overflow-x-hidden text-start">
												<p class="truncate">
													{song.name}
												</p>
												<p class="truncate">
													{song.main_artist}
												</p>
											</div>
											<Button
												variant="outline"
												class={cn(
													"rounded-full p-0 h-8 w-8 hover:bg-red-800 transition duration-300 ease-in-out",
													disabledBtn(loading)
												)}
												on:click={(e) => {
													e.stopPropagation();
													handleDeleteSongFromPlaylist(song.id);
												}}><MinusCircle class="w-6 h-6 p-0" /></Button
											>
										</div>
										<div
											class="hidden sm:grid grid-cols-[auto,1fr,1fr,1fr,auto] items-center justify-center gap-x-4 text-start"
										>
											<img
												src={song.img_url}
												alt={song.name}
												class="w-12 h-12 object-cover rounded-lg"
											/>
											<p class="truncate">
												{song.name}
											</p>
											<p class="truncate">
												{song.main_artist}
											</p>
											<p class="truncate">
												{song.release_year}
											</p>
											<Button
												variant="outline"
												class={cn(
													"rounded-full p-0 h-8 w-8 hover:bg-red-800 transition duration-300 ease-in-out",
													disabledBtn(loading)
												)}
												on:click={(e) => {
													e.stopPropagation();
													handleDeleteSongFromPlaylist(song.id);
												}}><MinusCircle class="w-6 h-6 p-0" /></Button
											>
										</div>
									</button>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>

<DisplaySongModal bind:dialogOpen={songDetailsDialogOpen} bind:selectedSongId />

<!-- Add song modal -->
<AddSongPlaylistModal
	bind:dialogOpen={addSongPlaylistDialogOpen}
	bind:playlistId={selectedPlaylistId}
	on:songAdded={() => {
		refresh = !refresh;
		selectedPlaylistId = selectedPlaylistId;
		dispatch("refresh");
	}}
/>

<!-- Edit playlist modal -->
<Dialog.Root bind:open={editPlaylistDialogOpen}>
	<Dialog.Content
		class="w-11/12 rounded-lg max-w-[90%] md:max-w-xl lg:max-w-2xl max-h-[48rem] px-2 sm:px-4"
	>
		<div class="flex flex-col gap-4 items-center justify-center my-4">
			<form
				on:submit|preventDefault={handleEditPlaylist}
				class="flex flex-col gap-4 w-4/5"
			>
				<Label for="playlist-name">Name</Label>
				<Input
					id="playlist-name"
					name="playlist-name"
					type="text"
					placeholder="Title"
					minlength={1}
					maxlength={25}
					value={playlist?.name}
				/>
				<Label for="playlist-description">Description</Label>
				<Textarea
					id="playlist-description"
					name="playlist-description"
					placeholder="Description"
					class="resize-none h-36"
					maxlength={100}
					value={playlist?.description}
				/>
				<Button variant="outline" type="submit" class="bg-cyan-800 hover:bg-cyan-700"
					>{loading ? "Saving..." : "Save"}</Button
				>
			</form>
		</div>
	</Dialog.Content>
</Dialog.Root>

<!-- Delete confirm modal -->
<Dialog.Root bind:open={deleteConfirmDialogOpen}>
	<Dialog.Content class="rounded-lg max-w-[16rem] sm:max-w-xs md:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Are you sure?</Dialog.Title>
			<Dialog.Description
				>This action will delete this playlist from your library!</Dialog.Description
			>
		</Dialog.Header>
		<Dialog.Footer>
			<form on:submit|preventDefault={handleDeletePlaylist} class="w-full">
				<Button variant="destructive" type="submit" class="w-full"
					>{loading ? "Deleting..." : "Delete"}</Button
				>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Import playlist to Spotify modal -->
<Dialog.Root bind:open={importPlaylistSpotifyDialogOpen}>
	<Dialog.Content class="rounded-lg max-w-[16rem] sm:max-w-xs md:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Import this playlist to spotify?</Dialog.Title>
			<Dialog.Description
				>This action will import this playlist to your Spotify account.</Dialog.Description
			>
		</Dialog.Header>
		<Dialog.Footer>
			<form on:submit|preventDefault={handleImportSpotify} class="w-full">
				<Button
					variant="outline"
					type="submit"
					class="w-full bg-emerald-800 hover:bg-emerald-700"
					>{loading ? "Importing..." : "Import"}</Button
				>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
