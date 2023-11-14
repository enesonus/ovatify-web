<script lang="ts">
	import { onMount } from "svelte";
	import Chart from "chart.js/auto";

	let canvas: HTMLCanvasElement;

	function getLast5Days() {
		let days = [];
		for (let i = 4; i >= 0; i--) {
			let d = new Date();
			d.setDate(d.getDate() - i);
			days.push(`${d.getDate()}/${d.getMonth() + 1}`);
		}
		return days;
	}

	onMount(() => {
		const context = canvas.getContext("2d");
		if (!context) throw new Error("Could not get canvas context");
		new Chart(context, {
			type: "line",
			data: {
				labels: getLast5Days(),
				datasets: [
					{
						label: "Rating",
						data: [3, 4, 2, 5, 4], // Placeholder data
						backgroundColor: "rgba(0, 128, 0, 0.2)",
						borderColor: "green",
						borderWidth: 2,
						fill: true
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				aspectRatio: 16 / 9,
				plugins: {
					title: {
						display: true,
						text: "Recent Ratings"
					}
				},
				scales: {
					y: {
						beginAtZero: true,
						max: 5,
						ticks: {
							stepSize: 1
						}
					}
				}
			}
		});
	});
</script>

<div class="w-[32rem]">
	<canvas bind:this={canvas} />
</div>
