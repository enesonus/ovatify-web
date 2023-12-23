<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import { avatars } from "$lib/utils/avatars";
	import { Pencil } from "lucide-svelte";
	import { createEventDispatcher } from "svelte";

	let dialogOpen = false;

	const dispatch = createEventDispatcher();
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger
		class="absolute top-0 right-0 rounded-full bg-slate-950 p-1 hover:bg-slate-800"
		><Pencil class="h-5 w-5" /></Dialog.Trigger
	>
	<Dialog.Content
		class="flex justify-center rounded-lg px-2 xsm:px-6 w-3/4 md:max-w-[70vw] lg:max-w-[36rem] pt-10 min-h-[24rem]"
	>
		<div class="w-full">
			<div class="py-2">
				<h1 class="text-2xl font-semibold text-center">Choose an image</h1>
			</div>
			<div class="avatars gap-4 overflow-y-auto px-2 max-h-96">
				{#each avatars as image}
					<button
						on:click={() => {
							dispatch("selectImage", image.url);
							dialogOpen = false;
						}}
					>
						<img src={image.url} alt={image.alt} class="object-cover rounded-lg" />
					</button>
				{/each}
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>

<style lang="postcss">
	.avatars {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(4rem, 1fr));
	}
</style>
