<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import { buttonVariants } from "$lib/components/ui/button";
	import * as Tabs from "$lib/components/ui/tabs";
	import SongUploadTab from "$lib/components/SongUploadTab.svelte";
	import FileUploadTab from "$lib/components/FileUploadTab.svelte";

	let dialogOpen = false;
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Add Music</Dialog.Trigger
	>
	<Dialog.Content
		class="flex justify-center rounded-lg w-11/12 md:max-w-[80vw] lg:max-w-[51.2rem] h-[34rem]"
	>
		<Tabs.Root value="manual-upload" class="w-full py-4 sm:w-4/5">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="manual-upload">Manual</Tabs.Trigger>
				<Tabs.Trigger value="file-upload">File</Tabs.Trigger>
			</Tabs.List>
			<!-- Manual Upload -->
			<Tabs.Content value="manual-upload">
				<SongUploadTab bind:dialogOpen={dialogOpen} />
			</Tabs.Content>
			<!-- File Upload -->
			<Tabs.Content value="file-upload">
				<FileUploadTab bind:dialogOpen={dialogOpen} />
			</Tabs.Content>
		</Tabs.Root>
	</Dialog.Content>
</Dialog.Root>
