<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import { buttonVariants } from "$lib/components/ui/button";
	import * as Tabs from "$lib/components/ui/tabs";
	import SongUploadTab from "$lib/components/SongUploadTab.svelte";
	import FileUploadTab from "$lib/components/FileUploadTab.svelte";
	import { fade } from "svelte/transition";
	import { Button } from "$lib/components/ui/button";
	import { user } from "$lib/stores/user";
	import { exportSongsByArtist, exportSongsByGenre } from "$lib/services/userService";
	import { cn } from "$lib/utils";
	import ComboBox from "$lib/components/ComboBox.svelte";
	import { getUserGenreNames } from "$lib/services/genreService";
	import { getUserArtistNames } from "$lib/services/artistService";
	import { displayToast } from "$lib/utils/toast";

	let downloadLink = "";
	let loading = false;
	let selectedItem: string;
	export let placeholder: string;
	export let name: "genre" | "artist";

	$: if (selectedItem) {
		downloadLink = "";
	}

	async function getItems() {
		const token = await $user!.getIdToken();
		const response =
			name === "genre" ? await getUserGenreNames(token) : await getUserArtistNames(token);
		if (response.status === 200) {
			const data = name === "genre" ? response.data.genres : response.data.artists;
			const items = data.map((item: string) => {
				return { value: item, label: item };
			});
			return items;
		} else if (response.status === 404) {
			return [];
		}
		displayToast({ message: "Error getting items", type: "error" });
		return [];
	}

	async function exportSongs() {
		if (loading) return;
		if (selectedItem === placeholder) {
			displayToast({ message: `Please ${placeholder.toLowerCase()}`, type: "error" });
			return;
		}
		loading = true;
		const token = await $user!.getIdToken();
		const response =
			name === "genre"
				? await exportSongsByGenre(token, selectedItem)
				: await exportSongsByArtist(token, selectedItem);
		console.log(response);
		if (response.status === 200) {
			const blob = new Blob([JSON.stringify(response.data, null, 2)], {
				type: "application/json"
			});
			downloadLink = URL.createObjectURL(blob);
		} else {
			displayToast({ message: "Error exporting songs", type: "error" });
		}
		loading = false;
	}
</script>

<div class="flex flex-col items-center justify-center gap-4 py-8">
	{#await getItems()}
		<div class="pt-2">Loading...</div>
	{:then items}
		<div in:fade|global>
			<ComboBox bind:selectedValue={selectedItem} {items} {placeholder} />
		</div>
	{/await}
	{#if downloadLink !== ""}
		<a
			in:fade|global
			href={downloadLink}
			download="data.json"
			class={cn(
				buttonVariants({ variant: "outline" }),
				"min-w-[12rem] bg-emerald-800 hover:bg-emerald-700"
			)}>Download File</a
		>
	{:else}
		<div in:fade|global>
			<Button
				variant="outline"
				on:click={() => exportSongs()}
				class={`min-w-[12rem] ${loading ? "bg-red-800 hover:bg-red-800" : ""}`}
				>Export Songs
			</Button>
		</div>
	{/if}
</div>
