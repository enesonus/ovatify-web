<script lang="ts">
	import ExportTab from "./ExportTab.svelte";
	import * as Dialog from "$lib/components/ui/dialog";
	import { buttonVariants } from "$lib/components/ui/button";
	import * as Tabs from "$lib/components/ui/tabs";

	let dialogOpen = false;
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}
		>Export Music</Dialog.Trigger
	>
	<Dialog.Content
		class="flex justify-center rounded-lg w-11/12 md:max-w-[80vw] lg:max-w-[36rem] h-[20rem]"
	>
		<Tabs.Root value="export-by-artist-name" class="w-full py-4 sm:w-4/5">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="export-by-artist-name">Artist</Tabs.Trigger>
				<Tabs.Trigger value="export-by-genre-name">Genre</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="export-by-artist-name">
				<ExportTab name="artist" placeholder="Select an artist" />
			</Tabs.Content>
			<Tabs.Content value="export-by-genre-name">
				<ExportTab name="genre" placeholder="Select a genre" />
			</Tabs.Content>
		</Tabs.Root>
	</Dialog.Content>
</Dialog.Root>
