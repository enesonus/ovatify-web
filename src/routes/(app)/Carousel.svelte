<script lang="ts">
	import { ChevronLeftCircle, ChevronRightCircle } from "lucide-svelte";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	function toggleDialog(data: any) {
		dispatch("toggleDialog", data);
	}

	const placeholderImageUrl =
		"https://images.unsplash.com/photo-1496208612508-eb52fba7d94e?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

	export let title: string;
	export let data: any[] = [
		{ name: "1989 (Taylor's Version)", release_year: "2021", artists: ["Taylor Swift"] },
		{ name: "1989 (Taylor's Version)", release_year: "2021", artists: ["Taylor Swift"] },
		{ name: "1989 (Taylor's Version)", release_year: "2021", artists: ["Taylor Swift"] },
		{ name: "1989 (Taylor's Version)", release_year: "2021", artists: ["Taylor Swift"] },
		{ name: "1989 (Taylor's Version)", release_year: "2021", artists: ["Taylor Swift"] }
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
			<button
				on:click={() => toggleDialog(element)}
				class="border-[2px] border-black p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800"
			>
				<div class="w-48 rounded-lg">
					<img
						src={element.image_url ?? placeholderImageUrl}
						alt={element.name}
						class="object-cover"
					/>
					<p class="py-2">{element.name}</p>
					<p>{element.release_year} • {element.artists[0]}</p>
				</div>
			</button>
		{/each}
	</div>
</div>
