<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import { Pencil } from "lucide-svelte";
	import { createEventDispatcher } from "svelte";

	let dialogIsOpen = false;

	const dispatch = createEventDispatcher();

	const profileImages: Record<"url" | "alt", string>[] = [
		{
			url: "https://cdn.betterttv.net/emote/609431bc39b5010444d0cbdc/3x.webp",
			alt: "The Goat"
		},
		{
			url: "https://cdn.betterttv.net/emote/5f1b0186cf6d2144653d2970/3x.webp",
			alt: "catJAM"
		},
		{
			url: "https://cdn.betterttv.net/emote/5e9c6c187e090362f8b0b9e8/3x.webp",
			alt: "kekw"
		},
		{
			url: "https://cdn.betterttv.net/emote/5590b223b344e2c42a9e28e3/3x.webp",
			alt: "EZ"
		},
		{
			url: "https://cdn.betterttv.net/emote/5efcd82551e3910deed68751/3x.webp",
			alt: "Donowall"
		}
	];
</script>

<Dialog.Root bind:open={dialogIsOpen}>
	<!-- <Dialog.Trigger class={cn(buttonVariants({ variant: "outline" }), "p-0 w-8 h-8")}
		><Image class="h-6 w-6" /><span class="sr-only">Choose Photo</span>
		</Dialog.Trigger
	> -->
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
				{#each profileImages as image}
					<button
						on:click={() => {
							dispatch("selectImage", image.url);
							dialogIsOpen = false;
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
