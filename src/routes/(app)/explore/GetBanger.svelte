<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import { buttonVariants } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { searchGenre, getMoods, getTempos } from "$lib/services/genreService";
	import { searchArtist } from "$lib/services/artistService";
	import { displayToast } from "$lib/utils/toast";
	import * as Select from "$lib/components/ui/select";
	import { user } from "$lib/stores/user";
	import { onMount } from "svelte";

	let dialogOpen = false;

	let loading = false;
	let querying = false;
	let typing = false;
	let artist_query: string = "";
	let genre_query: string = "";

	let selected_artist: string = "";
	let selected_genre: string = "";
	let selected_tempo: string = "";
	let selected_mood: string = "";
	let moods: string[] = [];

	function handleTempoChange(event: CustomEvent) {
		console.log("Tempo changed:", event.detail.value); // Debug log
		selected_tempo = event.detail.value;
	}

	function handleMoodChange(event: CustomEvent) {
		selected_mood = event.detail.value;
	}

	async function getTempo() {
		const token = await $user!.getIdToken();
		const response = await getTempos(token);
		if (response.status === 200) {
			const data = response.data;
			return {};
		}
		return;
	}

	async function getMood() {
		const token = await $user!.getIdToken();
		const response = await getMoods(token);
		if (response.status === 200) {
			const data = response.data;
			return {};
		}
		return;
	}

	function validateArtistQuery() {
		artist_query = artist_query.trim();
		if (artist_query.length === 0) return false;
		if (artist_query.length < 3) {
			displayToast({ type: "error", message: "Enter at least 3 characters to search" });
			return false;
		}
		if (artist_query.length > 50) {
			displayToast({ type: "error", message: "Please enter less than 50 characters" });
			return false;
		}
		return true;
	}

	function validateGenreQuery() {
		genre_query = genre_query.trim();
		if (genre_query.length === 0) return false;
		if (genre_query.length < 3) {
			displayToast({ type: "error", message: "Enter at least 3 characters to search" });
			return false;
		}
		if (genre_query.length > 50) {
			displayToast({ type: "error", message: "Please enter less than 50 characters" });
			return false;
		}
		return true;
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}
		>Get Banger</Dialog.Trigger
	>
	<Dialog.Content
		class="flex justify-center rounded-lg w-11/12 md:max-w-[80vw] lg:max-w-[77.8rem] h-[51rem]"
	>
		<div class="flex flex-col w-full px-12 py-4">
			<div class="flex justify-between w-full gap-4">
				<Input
					type="search"
					disabled={loading}
					bind:value={artist_query}
					on:input={() => {
						typing = true;
					}}
					placeholder="Search artist"
					class="w-1/5"
				/>
				<Input
					type="search"
					disabled={loading}
					bind:value={genre_query}
					on:input={() => {
						typing = true;
					}}
					placeholder="Search genre"
					class="w-1/5"
				/>

				<Select.Root on:change={handleTempoChange}>
					<Select.Trigger class="w-1/5">
						<Select.Value placeholder="Select Tempo" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="S">Slow</Select.Item>
						<Select.Item value="M">Medium</Select.Item>
						<Select.Item value="F">Fast</Select.Item>
					</Select.Content>
				</Select.Root>

				<Select.Root on:change={handleMoodChange}>
					<Select.Trigger class="w-1/5">
						<Select.Value placeholder="Select Mood" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="H">Happy</Select.Item>
						<Select.Item value="SA">Sad</Select.Item>
						<Select.Item value="E">Excited</Select.Item>
						<Select.Item value="R">Relaxed</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="p-8">
				<p>{selected_mood}</p>
				<p>{selected_tempo}</p>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
