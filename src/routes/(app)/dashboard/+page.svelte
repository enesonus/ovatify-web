<script lang="ts">
	import AddedSongsBarChart from "$lib/components/charts/AddedSongsBarChart.svelte";
	import RecentRatingsChart from "$lib/components/charts/RecentRatingsChart.svelte";
	import { getEntityCount, getRecentAdditionCounts } from "$lib/services/userService";
	import { user } from "$lib/stores/user";
	import * as Tabs from "$lib/components/ui/tabs";
	import ShareOnX from "$lib/components/charts/ShareOnX.svelte";
	import { page } from "$app/stores";
	import Spinner from "$lib/components/Spinner.svelte";

	type ChartEntity = "artists" | "tempos" | "genres" | "moods";

	const entities = ["artists", "genres", "moods", "tempos"] as const;
	const colors = ["#011f4b", "#03396c", "#005b96", "#6497b1"] as const;

	async function getEntityChart(entity: ChartEntity) {
		const token = await $user!.getIdToken();
		const response = await getEntityCount(token, entity);
		if (response.status === 200) {
			const data = response.data;
			return {
				xValues: Object.keys(data).slice(0, 10),
				yValues: Object.values(data).slice(0, 10) as number[]
			};
		}
		return { xValues: [], yValues: [] };
	}

	function entityBarChartShareText(
		entity: ChartEntity,
		data: { xValues: string[]; yValues: number[] }
	) {
		let str = "";
		if (entity === "artists") {
			str = "Here's how many songs I have from my favorite 5 artists:\n";
		} else if (entity === "genres") {
			str = "Here's how many songs I have from my favorite 5 genres:\n";
		} else if (entity === "moods") {
			str = "Here's how many songs I have in each mood:\n";
		} else if (entity === "tempos") {
			str = "Here's how many songs I have in each tempo:\n";
		}
		const myArr = data.xValues
			.slice(0, 5)
			.map((entity, index) => `${entity.replaceAll("&", "and")}: ${data.yValues[index]}`);
		str += myArr.join("\n");
		str += "\n\nWhat about you?";
		return str;
	}

	async function getRecentChart() {
		const token = await $user!.getIdToken();
		const response = await getRecentAdditionCounts(token);
		if (response.status === 200) {
			const songCounts: { date: string; count: number }[] = response.data.song_counts;
			const xValues = songCounts.map((entry) => entry.date);
			const yValues = songCounts.map((entry) => entry.count);
			return { xValues, yValues };
		}
		return { xValues: [], yValues: [] };
	}

	function recentChartShareText(data: { xValues: string[]; yValues: number[] }) {
		let str = "Here's how many songs I have added in the last 5 days:\n\n";
		const myArr = data.xValues.map((date, index) => `${date}: ${data.yValues[index]}`);
		str += myArr.join("\n");
		str += "\n\nHow about you?";
		return str;
	}
</script>

<div class="text-left m-4 sm:px-16">
	<p class="text-5xl font-medium text-[#dfe3ee]">Your Taste</p>
</div>
<div class="flex w-full h-full">
	<div class="flex w-full gap-6 px-16 items-center justify-center h-full">
		<div class="flex bg-zinc-900 w-1/2 justify-center items-center rounded-lg h-full">
			<Tabs.Root value="artists" class="flex flex-col h-full w-full items-center pt-4">
				<Tabs.List class="flex flex-row w-11/12 bg-zinc-800 items-center justify-center">
					{#each entities as entity}
						<Tabs.Trigger class="w-full capitalize" value={entity}>{entity}</Tabs.Trigger>
					{/each}
				</Tabs.List>
				{#each entities as entity, index}
					<Tabs.Content value={entity} class="h-full w-full">
						{#await getEntityChart(entity)}
							<div class="min-h-[22rem] flex items-center justify-center">
								<Spinner class="animate-spin h-12 w-12" />
							</div>
						{:then data}
							{#if data.xValues.length === 0}
								<div class="flex w-full h-full items-center justify-center">
									<p class="text-2xl font-medium text-[#dfe3ee]">
										Add songs to your library to see your taste
									</p>
								</div>
							{:else}
								<div class="flex items-center justify-center">
									<AddedSongsBarChart
										chartTitle={`Added songs by ${entity.slice(0, -1)} `}
										xValues={data.xValues}
										yValues={data.yValues}
										barColor={colors[index]}
									/>
								</div>
								<div class="flex justify-center items-center gap-2">
									<p>Share on X</p>
									<ShareOnX
										text={entityBarChartShareText(entity, data)}
										url={$page.url.origin}
									/>
								</div>
							{/if}
						{/await}
					</Tabs.Content>
				{/each}
			</Tabs.Root>
		</div>
		<div class="flex-row bg-zinc-900 w-1/2 rounded-lg items-center justify-center h-full">
			<div class="flex w-full items-end justify-center pb-2">
				<div
					class="flex w-5/6 bg-zinc-800 rounded-lg p-2 mt-4 items-center justify-center pl-2"
				>
					<p class="font-medium text-sm opacity-50">
						Number of songs added to your library
					</p>
				</div>
			</div>
			<div class="w-full h-full">
				<div class="flex flex-col w-11/12 items-center justify-center mx-auto">
					{#await getRecentChart()}
						<div class="min-h-[22rem] flex items-center justify-center">
							<Spinner class="animate-spin h-12 w-12" />
						</div>
					{:then data}
						{#if data.yValues.reduce((a, b) => a + b, 0) === 0}
							<div class="flex w-full min-h-[16rem] items-center justify-center">
								<p class="text-2xl font-medium text-[#dfe3ee]">
									Add songs to your library to see your taste
								</p>
							</div>
						{:else}
							<RecentRatingsChart
								chartTitle=""
								xValues={data.xValues}
								yValues={data.yValues}
								lineColor={"#FFFFFF"}
							/>
							<div class="flex justify-center items-center gap-2">
								<p>Share on X</p>
								<ShareOnX text={recentChartShareText(data)} url={$page.url.origin} />
							</div>
						{/if}
					{/await}
				</div>
			</div>
		</div>
	</div>
</div>
