<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { Input } from "$lib/components/ui/input";
	import { Search } from "lucide-svelte";
	import { displayToast } from "$lib/utils/toast";
	import { user } from "$lib/stores/user";
	import { fade } from "svelte/transition";
	import { searchDatabaseSong } from "$lib/services/songService";
	import { defaultImageUrl } from "$lib/constants";
	import type { SongQueryResponse } from "$lib/types";
	import DisplaySongModal from "$lib/components/DisplaySongModal.svelte";

	export let dialogOpen: boolean;
	let songDetailsDialogOpen = false;
	let query: string = "";
	let queryResult: SongQueryResponse[] = [];
	let selectedSongId: string = "";
	let loading = false;
	let querying = false;
	let typing = false;
	let timeoutId: ReturnType<typeof setTimeout>;

	$: if (!dialogOpen) {
		query = "";
		queryResult = [];
		selectedSongId = "";
		loading = false;
		querying = false;
		typing = false;
	}

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
		selectedSongId = "";
		queryResult = [];
		if (!validateQuery()) return;
		querying = true;
		const token = await $user!.getIdToken();
		const response = await searchDatabaseSong(token, query);
		console.log(response);
		if (response.status === 200) {
			queryResult = response.data.songs_info;
		} else {
			console.log(response);
			displayToast({ type: "error", message: "Error searching for songs" });
		}
		querying = false;
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content
		class="flex justify-center rounded-lg w-11/12 md:max-w-[80vw] lg:max-w-[51.2rem] h-[32rem] px-0"
	>
		<div class="flex justify-center rounded-md w-full m-2">
			<div class="w-full py-4 sm:w-4/5">
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
							<div class="my-2 px-2 h-80 overflow-auto" in:fade>
								{#each { length: 2 } as _}
									<div class="w-full py-2 my-2 rounded-lg bg-zinc-800">
										<div class="flex px-2">
											<Skeleton class="w-24 h-24 bg-zinc-600" />
											<div class="h-24 flex-grow">
												{#each { length: 4 } as _}
													<p class="w-full py-1 px-2">
														<Skeleton class="flex-grow p-2  bg-zinc-600" />
													</p>
												{/each}
											</div>
										</div>
									</div>
								{/each}
							</div>
						{:else if !typing && queryResult.length === 0 && query.length > 0}
							<div
								class="my-2 px-2 h-80 overflow-auto flex justify-center items-center"
								in:fade
							>
								<div class="flex justify-center items-center">
									<Search class="w-12 h-12 lg:mr-4" />
									<p class="lg:text-lg">No results found</p>
								</div>
							</div>
						{:else if queryResult.length > 0}
							<div class="my-2 px-2 h-80 overflow-auto" in:fade>
								{#each queryResult as result}
									<button
										on:click={() => {
											selectedSongId = result.spotify_id;
											songDetailsDialogOpen = true;
										}}
										class="w-full py-2 my-2 rounded-lg bg-zinc-800 hover:bg-zinc-700"
									>
										<div class="flex px-2">
											<div
												class="hidden xsm:flex w-24 min-h-[6rem] border-zinc-600 items-center justify-center"
											>
												<img
													class="w-24 min-w-[6rem] h-24 object-cover rounded-lg"
													src={result.album_url || defaultImageUrl}
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
								class="my-2 px-2 h-80 overflow-auto flex justify-center items-center"
								in:fade
								out:fade={{ duration: 200, delay: 500 }}
							>
								<div class="flex justify-center items-center">
									<Search class="mr-2 w-12 h-12 lg:mr-4" />
									<p class="lg:text-lg select-none">Search</p>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>

<DisplaySongModal
	bind:dialogOpen={songDetailsDialogOpen}
	bind:selectedSongId
	on:songAdded={() => (dialogOpen = false)}
/>
