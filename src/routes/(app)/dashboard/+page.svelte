<script lang="ts">
	import AddedSongsBarChart from "$lib/components/charts/AddedSongsBarChart.svelte";
	import RecentRatingsChart from "$lib/components/charts/RecentRatingsChart.svelte";
	import { getEntityCount, getRecentAddition } from "$lib/services/userService";
	import { user } from "$lib/stores/user";
	import * as Tabs from "$lib/components/ui/tabs";

	async function getEntityChart(entity: "artists" | "tempos" | "genres" | "moods") {
		const token = await $user!.getIdToken();
		const res = await getEntityCount(token, entity);
		if (res?.status === 200) {
			const data = res.data;
			return { xValues: Object.keys(data), yValues: Object.values(data) as number[] };
		}
		return { xValues: [], yValues: [] };
	}

	type SongCountEntry = {
		date: string;
		count: number;
	};

	async function getRecentChart() {
		const token = await $user!.getIdToken();
		const res = await getRecentAddition(token);

		if (res?.status === 200) {
			const songCounts: SongCountEntry[] = res.data.song_counts;

			const xValues = songCounts.map((entry) => entry.date);
			const yValues = songCounts.map((entry) => entry.count);

			return { xValues, yValues };
		}

		// If the response status is not 200, or if there is no data, return empty arrays
		return { xValues: [], yValues: [] };
	}

	function capitalizeFirstLetter(inputString: string) {
		// Check if the input is a valid string
		if (typeof inputString !== "string" || inputString.length === 0) {
			return inputString;
		}

		return inputString.charAt(0).toUpperCase() + inputString.slice(1);
	}
	const entities = ["artists", "genres", "moods", "tempos"] as const;
	const colors = ["#011f4b", "#03396c", "#005b96", "#6497b1"] as const;
</script>

<div class=" text-left m-4 px-16">
	<p class="text-5xl font-medium text-[#dfe3ee]">Your Taste</p>
</div>
<div class="flex w-full h-full">
	<div class="flex w-full gap-6 px-16 items-center justify-center h-full">
		<div
			class="flex bg-zinc-900 w-1/2 justify-center items-center rounded-lg h-full pl-10"
		>
			<Tabs.Root value="artists" class="flex h-full w-full items-center justify-center">
				<div class="w-full">
					<Tabs.List
						class="flex flex-row w-11/12 bg-zinc-800 items-center justify-center"
					>
						{#each entities as entity}
							<Tabs.Trigger class="w-full" value={entity}
								>{capitalizeFirstLetter(entity)}</Tabs.Trigger
							>
						{/each}
					</Tabs.List>
					{#each entities as entity, index}
						<Tabs.Content value={entity}>
							{#await getEntityChart(entity)}
								<div>Loading</div>
							{:then data}
								<AddedSongsBarChart
									chartTitle={`Added songs by ${entity.slice(0, -1)} `}
									xValues={data.xValues}
									yValues={data.yValues}
									barColor={colors[index]}
								/>
							{/await}
						</Tabs.Content>
					{/each}
				</div>
			</Tabs.Root>
		</div>
		<div class="flex-row bg-zinc-900 w-1/2 rounded-lg items-center justify-center h-full">
			<div class=" flex w-full h-1/6 items-end justify-center pb-2">
				<div
					class="flex w-5/6 bg-zinc-800 rounded-lg h-1/2 items-center justify-center pl-2"
				>
					<p class="font-medium text-sm opacity-50">
						Number of songs you added to your library
					</p>
				</div>
			</div>
			<div class="w-full h-5/6">
				<div class="flex w-11/12 items-center justify-center mx-auto">
					{#await getRecentChart()}
						<div>Loading</div>
					{:then data}
						<RecentRatingsChart
							chartTitle={"Title"}
							xValues={data.xValues}
							yValues={data.yValues}
							lineColor={"#FFFFFF"}
						/>
					{/await}
				</div>
			</div>
		</div>
	</div>
</div>
