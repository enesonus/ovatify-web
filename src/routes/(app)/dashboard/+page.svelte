<script lang="ts">
	import AddedSongsBarChart from "$lib/components/charts/AddedSongsBarChart.svelte";
	import RecentRatingsChart from "$lib/components/charts/RecentRatingsChart.svelte";

	const byMood: any = {
		title: "Added Songs by Mood",
		xLabels: ["Happy", "Sad", "Excited", "Angry", "Calm", "Neutral"],
		yLabels: [{ label: "Value", data: [50, 100, 75, 50, 50, 160], color: "#292929" }]
	};

	const byTempo: any = {
		title: "Added Songs by Tempo",
		xLabels: ["Fast", "Slow", "Medium"],
		yLabels: [{ label: "Value", data: [50, 100, 75], color: "#1E9798" }]
	};

	const byGenre: any = {
		title: "Added Songs by Genre",
		xLabels: ["Pop", "Rock", "Jazz", "Classical"],
		yLabels: [{ label: "Value", data: [30, 100, 75, 60], color: "#983423" }]
	};
</script>

<div class="grid grid-cols-2 gap-8">
	<div class="flex justify-center items-center">
		<AddedSongsBarChart chartData={byMood} />
	</div>
	<div class="flex justify-center items-center">
		<AddedSongsBarChart chartData={byTempo} />
	</div>
	<div class="flex justify-center items-center">
		<AddedSongsBarChart chartData={byGenre} />
	</div>
	<div class="flex justify-center items-center">
		<RecentRatingsChart />
	</div>
</div>
