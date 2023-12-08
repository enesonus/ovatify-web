<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { Input } from "$lib/components/ui/input";
	import { Trash2, Search } from "lucide-svelte";
	import { displayToast } from "$lib/utils/toast";
	import { user } from "$lib/stores/user";
	import Stars from "$lib/components/Stars.svelte";
	import { fade } from "svelte/transition";
	import { addSong, searchDatabaseSong } from "$lib/services/songService";
	import { placeholderImageUrl } from "$lib/constants";
	import type { SongQueryResponse } from "$lib/types";
	import { deleteFromCache, songCache } from "$lib/utils/caches";
	import { refresh } from "$lib/stores/refresh";

	export let dialogIsOpen: boolean;

	let query: string = "";
	let queryResult: SongQueryResponse[] = [];
	let selectedSongId: string | null = null;
	let selectedSongRating: number = 0;
	let loading = false;
	let querying = false;
	let typing = false;
	let timeoutId: ReturnType<typeof setTimeout>;

	function debounce(func: () => void, delay: number) {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(func, delay);
	}

	function validateQuery() {
		query = query.trim();
		if (query.length === 0) return false;
		if (query.length < 3) {
			displayToast({ type: "error", message: "Enter at least 3 characters to search" });
			return false;
		}
		if (query.length > 50) {
			displayToast({ type: "error", message: "Please enter less than 50 characters" });
			return false;
		}
		return true;
	}

	async function querySongData() {
		if (querying) return;
		typing = false;
		selectedSongId = null;
		queryResult = [];
		if (!validateQuery()) return;
		querying = true;
		const token = await $user!.getIdToken();
		displayToast({ type: "error", message: "Not wired yet." });
		querying = false;
		return;
		const response = await searchDatabaseSong(token, query);
		if (response.status === 200) {
			queryResult = response.data.results;
		} else {
			console.log(response);
			displayToast({ type: "error", message: "Error searching for songs" });
		}
		querying = false;
	}

	async function addSelectedSong() {
		if (loading) return;
		if (!selectedSongId) {
			displayToast({ type: "error", message: "Please select a song" });
			return;
		}
		loading = true;
		const token = await $user!.getIdToken();
		const response = await addSong(token, selectedSongId, selectedSongRating);
		if (response.status >= 200 && response.status < 300) {
			displayToast({ type: "success", message: "Rating added successfully" });
			deleteFromCache(songCache, selectedSongId);
			$refresh = !$refresh;
		} else if (response.status === 400) {
			displayToast({ type: "error", message: "Song already exists" });
		} else {
			displayToast({ type: "error", message: "Error adding song" });
		}
		dialogIsOpen = false;
		loading = false;
		query = "";
		queryResult = [];
		selectedSongId = null;
		selectedSongRating = 0;
	}
</script>

<div class="flex flex-col items-center justify-center">
	<div class="flex flex-col h-[24rem] w-full">
		<div class="w-full h-12 py-2">
			<Input
				type="search"
				disabled={loading}
				bind:value={query}
				on:input={() => {
					typing = true;
					debounce(querySongData, 1000);
				}}
				placeholder="Type at least 3 characters to search"
				class="w-full"
			/>
		</div>
		{#if querying}
			<div class="my-2 px-2 h-64 overflow-auto" in:fade>
				{#each { length: 2 } as _}
					<div class="w-full py-2 my-2 rounded-lg bg-slate-800">
						<div class="flex px-2">
							<Skeleton class="w-24 h-24 bg-slate-600" />
							<div class="h-24 flex-grow">
								{#each { length: 4 } as _}
									<p class="w-full py-1 px-2">
										<Skeleton class="flex-grow p-2  bg-slate-600" />
									</p>
								{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else if !typing && queryResult.length === 0 && query.length > 0}
			<div class="my-2 px-2 h-64 overflow-auto flex justify-center items-center" in:fade>
				<div class="flex justify-center items-center">
					<Search class="w-12 h-12 lg:mr-4" />
					<p class="lg:text-lg">No results found</p>
				</div>
			</div>
		{:else if queryResult.length > 0}
			<div class="my-2 px-2 h-64 overflow-auto" in:fade>
				{#each queryResult as result}
					<button
						on:click={() => {
							if (selectedSongId === result.spotify_id) {
								selectedSongId = null;
							} else {
								selectedSongId = result.spotify_id;
							}
						}}
						class={`w-full py-2 my-2 rounded-lg ${
							selectedSongId === result.spotify_id
								? "bg-emerald-800 hover:bg-emerald-700"
								: "bg-slate-800 hover:bg-slate-700"
						}`}
					>
						<div class="flex px-2">
							<div
								class="hidden xsm:flex w-24 min-h-[6rem] border-slate-600 items-center justify-center"
							>
								<img
									class="w-24 min-w-[6rem] h-24 object-cover rounded-lg"
									src={result.album_url ?? placeholderImageUrl}
									alt={result.track_name}
								/>
							</div>
							<div
								class="px-2 text-start text-sm flex flex-col flex-grow justify-center text-gray-200"
							>
								<p class="font-semibold">{result.track_name}</p>
								<p>Album: {result.album_name}</p>
								<p>Artists: {result.artist}</p>
								<p>Year: {result.release_year}</p>
							</div>
						</div>
					</button>
				{/each}
			</div>
		{:else if !typing}
			<div
				class="my-2 px-2 h-64 overflow-auto flex justify-center items-center"
				in:fade
				out:fade={{ duration: 200, delay: 500 }}
			>
				<div class="flex justify-center items-center">
					<Search class="mr-2 w-12 h-12 lg:mr-4" />
					<p class="lg:text-lg select-none">Search</p>
				</div>
			</div>
		{/if}
		{#if selectedSongId}
			<div class="flex justify-center items-center gap-2" transition:fade>
				<div class="flex justify-center items-center h-12">
					<Stars bind:rating={selectedSongRating} />
				</div>
				<div>
					<Button variant="outline" on:click={() => (selectedSongRating = 0)}
						><Trash2 /></Button
					>
				</div>
			</div>
		{/if}
	</div>
	<Button
		variant="outline"
		class={`w-4/5 ${
			selectedSongId === null || loading
				? "text-white bg-red-800 hover:bg-red-700"
				: "text-black bg-[#B3BBD8]"
		}`}
		on:click={addSelectedSong}
		>{loading
			? "Adding song..."
			: selectedSongRating > 0
			? "Rate selected song"
			: "Add selected song"}</Button
	>
</div>
