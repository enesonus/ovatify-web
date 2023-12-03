<script lang="ts">
	import Spinner from "$lib/components/Spinner.svelte";
	import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
	import RecentRatingsChart from "$lib/components/charts/RecentRatingsChart.svelte";
	import { sleep } from "$lib/utils/time";

	async function getRandomChart() {
		await sleep(Math.random() * 2);
		return [];
	}
</script>

{#await getRandomChart()}
	<div class="w-full">
		<Spinner class="animate-spin" />
	</div>
{:then}
	<RecentRatingsChart />
{/await}
