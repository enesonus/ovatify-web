<script lang="ts">
	import AddedSongsBarChart from "$lib/components/charts/AddedSongsBarChart.svelte";
	import RecentRatingsChart from "$lib/components/charts/RecentRatingsChart.svelte";
	import { getEntityCount } from "$lib/services/userService";
	import { user } from "$lib/stores/user";
	import { onMount } from "svelte";

	async function getEntityChart(entity: "artists" | "tempos" | "genres" | "moods") {
		const token = await $user!.getIdToken();
		const res = await getEntityCount(token, entity);
		if (res?.status === 200) {
			const data = res.data;
			return { xValues: Object.keys(data), yValues: Object.values(data) as number[] };
		}
		return { xValues: [], yValues: [] };
	}

	const entities = ["artists", "genres", "moods", "tempos"] as const;

	onMount(() => {
		// getTempoChart();
	});
</script>

<div class="grid grid-cols-2 gap-8">
	{#if $user}
		{#each entities as entity}
			<div class="flex justify-center items-center">
				{#await getEntityChart(entity)}
					<div>Loading</div>
				{:then data}
					<AddedSongsBarChart
						chartTitle={`Added songs by ${entity.slice(0, -1)} `}
						xValues={data.xValues}
						yValues={data.yValues}
					/>
				{/await}
			</div>
		{/each}
	{/if}
	<div class="flex justify-center items-center">
		<RecentRatingsChart />
	</div>
</div>
