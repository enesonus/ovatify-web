<script lang="ts">
	import * as api from "$lib/utils/api";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { Input } from "$lib/components/ui/input";
	import * as Tabs from "$lib/components/ui/tabs";
	import { Trash2, Search } from "lucide-svelte";
	import { displayToast } from "$lib/utils/toast";
	import { user } from "$lib/stores/user";
	import { cn } from "$lib/utils";
	import { goto } from "$app/navigation";
	import Stars from "$lib/components/Stars.svelte";
	import { fade } from "svelte/transition";
	import { searchSong, uploadSongFile, addSong } from "$lib/services/songService";

	type SelectedSongBody = {
		spotify_id: string;
		rating?: number;
	};

	type SongQueryResponse = {
		spotify_id: string;
		album_name: string;
		artist: string;
		release_year: string;
		track_name: string;
		image_url?: string;
	};

	const placeholderImageUrl =
		"https://images.unsplash.com/photo-1496208612508-eb52fba7d94e?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

	let file: File | undefined;
	let query: string = "";
	let queryResult: SongQueryResponse[] = [];
	let selectedSongId: string | null = null;
	let selectedSongRating: number = 0;
	let dialogIsOpen = false;
	let loading = false;
	let querying = false;
	let typing = false;
	let timeoutId: ReturnType<typeof setTimeout>;

	function debounce(func: () => void, delay: number) {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(func, delay);
	}

	function setFile(event: Event) {
		const target = event.target as HTMLInputElement;
		file = target?.files?.[0];
	}

	async function querySongData() {
		if (querying) return;
		typing = false;
		selectedSongId = null;
		queryResult = [];
		query = query.trim();
		if (query.length === 0) return;
		if (query.length < 3) {
			displayToast({ type: "error", message: "Please enter at least 3 characters" });
			return;
		}
		if (query.length > 50) {
			displayToast({ type: "error", message: "Please enter less than 50 characters" });
			return;
		}
		if (!$user) {
			displayToast({ type: "error", message: "You must be logged in to upload a song" });
			goto("/login");
			return;
		}
		querying = true;
		try {
			const token = await $user.getIdToken();
			const response = await searchSong(token, query);
			if (response.status !== 200) {
				console.log(response);
				displayToast({ type: "error", message: "Error searching for songs" });
			} else {
				queryResult = response.data.results;
				console.log(queryResult);
			}
		} catch (error: any) {
			console.log(error);
			displayToast({ type: "error", message: "Error searching for songs" });
		} finally {
			querying = false;
		}
	}

	async function addSelectedSong() {
		if (loading) return;
		if (!selectedSongId) {
			displayToast({ type: "error", message: "Please select a song" });
			return;
		}
		if (!$user) {
			displayToast({ type: "error", message: "You must be logged in to upload a song" });
			goto("/login");
			return;
		}
		const token = await $user.getIdToken();
		const body: SelectedSongBody = {
			spotify_id: selectedSongId,
			rating: selectedSongRating
		};
		console.log(body);
		try {
			const response = await addSong(token, body);
			if (response.status !== 200) {
				console.log(response);
				displayToast({ type: "error", message: "Error adding song" });
				return;
			}
			displayToast({ type: "success", message: "Song added successfully" });
		} catch (error: any) {
			console.log(error);
			displayToast({ type: "error", message: "Error adding song" });
		} finally {
			dialogIsOpen = false;
			loading = false;
			query = "";
			queryResult = [];
			selectedSongId = null;
			selectedSongRating = 0;
		}
	}

	function validateFileName(fileName: string) {
		const fileSplit = fileName.split(".");
		const fileExtension = fileSplit[fileSplit.length - 1].toLowerCase();
		if (fileExtension !== "json") {
			displayToast({ type: "error", message: "The file must be a JSON file" });
			return false;
		}
		return true;
	}

	async function uploadFile() {
		if (loading) return;
		if (!file) {
			displayToast({ type: "error", message: "No file selected" });
			return false;
		}
		const validFileName = validateFileName(file.name);
		if (!validFileName) return;
		loading = true;
		const form = new FormData();
		form.append("file", file!);
		if (!$user) {
			displayToast({ type: "error", message: "You must be logged in to upload a song" });
			goto("/login");
			return;
		}
		try {
			const token = await $user.getIdToken();
			const response = await uploadSongFile(token, form);
			switch (response.status) {
				case 201:
					displayToast({ type: "success", message: "Songs uploaded successfully" });
					break;
				case 400:
					displayToast({
						type: "error",
						message: "Please make sure the data is in the format shown in the docs"
					});
					break;
				default:
					displayToast({ type: "error", message: "Error uploading songs" });
					break;
			}
		} catch (e: any) {
			console.log(e);
			displayToast({ type: "error", message: "Error uploading songs" });
		} finally {
			dialogIsOpen = false;
			loading = false;
			file = undefined;
		}
	}
</script>

<Dialog.Root bind:open={dialogIsOpen} closeOnOutsideClick={false}>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Add Music</Dialog.Trigger
	>
	<Dialog.Content
		class="flex justify-center rounded-lg w-11/12 md:max-w-[80vw] lg:max-w-[51.2rem] h-[32rem]"
	>
		<Tabs.Root value="song-upload" class="w-4/5">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="song-upload">Manual</Tabs.Trigger>
				<Tabs.Trigger value="file-upload">File</Tabs.Trigger>
			</Tabs.List>
			<!-- Song Upload -->
			<Tabs.Content value="song-upload">
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
							<div
								class="my-2 px-2 h-64 overflow-auto flex justify-center items-center"
								in:fade
							>
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
													src={result.image_url ?? placeholderImageUrl}
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
							selectedSongId === null
								? "text-white bg-red-800 hover:bg-red-700"
								: "text-black bg-[#B3BBD8]"
						}`}
						on:click={addSelectedSong}
						>{selectedSongRating > 0
							? "Rate and add selected song"
							: "Add selected song"}</Button
					>
				</div>
			</Tabs.Content>
			<!-- File Upload -->
			<Tabs.Content value="file-upload">
				<div class="flex flex-col gap-4 min-h-[24rem] justify-center items-center">
					<label
						for="file-upload"
						class={cn(buttonVariants({ variant: "outline" }), "w-96 py-8 cursor-pointer")}
						>Choose File</label
					>
					<input
						id="file-upload"
						type="file"
						class="hidden"
						accept=".json"
						on:change={setFile}
					/>
					{#if file}
						<p>Chosen file "{file.name}"</p>
					{:else}
						<p>No file chosen</p>
					{/if}
					<Button
						on:click={uploadFile}
						variant="outline"
						class={`w-96 ${
							loading
								? "bg-red-800 hover:bg-red-800 text-white"
								: "text-black bg-[#B3BBD8]"
						}`}>Upload File</Button
					>
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</Dialog.Content>
</Dialog.Root>
