<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import { buttonVariants } from "$lib/components/ui/button";
	import * as Tabs from "$lib/components/ui/tabs";
	import SongUploadTab from "./SongUploadTab.svelte";
	import FileUploadTab from "./FileUploadTab.svelte";

	export let refresh: boolean;
	let dialogIsOpen = false;
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
				<SongUploadTab bind:refresh bind:dialogIsOpen />
			</Tabs.Content>
			<!-- File Upload -->
			<Tabs.Content value="file-upload">
				<FileUploadTab bind:dialogIsOpen />
			</Tabs.Content>
		</Tabs.Root>
	</Dialog.Content>
</Dialog.Root>
