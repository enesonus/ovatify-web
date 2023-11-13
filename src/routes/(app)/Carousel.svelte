<script lang="ts">
	import { ChevronLeftCircle, ChevronRightCircle } from "lucide-svelte";
	const placeholderImageUrl =
		"https://images.unsplash.com/photo-1496208612508-eb52fba7d94e?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

	export let title: string;
	export let data: Record<string, any>[] = [
		{ title: "1989 (Taylor's Version)", type: "Album", artist: "Taylor Swift" },
		{ title: "1989 (Taylor's Version)", type: "Album", artist: "Taylor Swift" },
		{ title: "1989 (Taylor's Version)", type: "Album", artist: "Taylor Swift" },
		{ title: "1989 (Taylor's Version)", type: "Album", artist: "Taylor Swift" },
		{ title: "1989 (Taylor's Version)", type: "Album", artist: "Taylor Swift" }
	];
</script>

<div>
	<div class="flex h-12 items-center">
		<h1 class="text-lg font-semibold">{title}</h1>
		<div class="ml-auto pr-4">
			<button><ChevronLeftCircle class="h-8 w-8" /></button>
			<button><ChevronRightCircle class="h-8 w-8" /></button>
		</div>
	</div>
	<div class="flex gap-4">
		{#each data as element}
			<!-- Song Cards -->
			<a
				href="/"
				class="border-[2px] border-black p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800"
			>
				<div class="w-48 rounded-lg">
					<img src={placeholderImageUrl} alt="" />
					<p class="py-2">{element.title}</p>
					<p>{element.type} • {element.artist}</p>
				</div>
			</a>
		{/each}
	</div>
</div>

<style lang="postcss">
	img {
		object-fit: cover;
	}
</style>
