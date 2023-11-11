<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { displayToast } from "$lib/utils/toast";

	let selected: Record<string, any>[] = [];
	let genres: Record<string, any>[] = [
		{ name: "Dubstep" },
		{ name: "Drumstep" },
		{ name: "DnB" },
		{ name: "Rock" },
		{ name: "Pop" },
		{ name: "HipHop" },
		{ name: "Rap" },
		{ name: "KPop" },
		{ name: "Jazz" },
		{ name: "Alternative Rock" },
		{ name: "Classical" },
		{ name: "Country" }
	];

	const tempImageURL =
		"https://images.unsplash.com/photo-1520446266423-6daca23fe8c7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

	function updateSelected(genre: Record<string, any>) {
		if (selected.includes(genre.name)) {
			selected = selected.filter((item) => item !== genre.name);
		} else {
			if (selected.length < 5) {
				selected.push(genre.name);
			} else {
				displayToast({ message: "You have already picked 5 categories", type: "error" });
			}
		}
		selected = selected;
	}

	async function welcomeUser() {
		if (selected.length < 5) {
			displayToast({ message: "Please pick 5 categories", type: "error" });
			return;
		}
		displayToast({ message: "Done (WIP)", type: "success" });
	}
</script>

<div class="flex flex-col gap-4 justify-center items-center">
	<h1 class="text-center text-3xl font-extrabold py-2">Pick 5 categories you like</h1>
	<div class="genre-table">
		{#if genres}
			{#each genres as genre}
				<div
					class={selected.includes(genre.name)
						? "bg-emerald-800 rounded-md"
						: "bg-[#292929] rounded-md"}
				>
					<button on:click={() => updateSelected(genre)}>
						<img
							src={tempImageURL}
							alt="Placeholder"
							class={selected.includes(genre.name) ? "filter" : ""}
						/>
						<p class="text-center">
							{genre.name}
						</p>
					</button>
				</div>
			{/each}
		{/if}
	</div>
	<div class="flex items-center justify-center">
		<p>{selected.length} / 5 Selected</p>
	</div>
	<Button on:click={welcomeUser} variant="outline" class="w-48 py-6">Done</Button>
</div>

<style lang="postcss">
	.genre-table {
		display: grid;
		gap: 2rem;
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
	}
	img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		@apply rounded-md;
		border-bottom-right-radius: 0;
		border-bottom-left-radius: 0;
	}
</style>
