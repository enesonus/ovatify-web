<script lang="ts">
	import { onMount } from "svelte";
	import Chart from "chart.js/auto";

	let canvas: HTMLCanvasElement;

	export let chartTitle: string;
	export let barColor = "#292929";
	export let xValues: string[];
	export let yValues: number[];

	onMount(() => {
		const context = canvas.getContext("2d");
		if (!context) throw new Error("Could not get canvas context");
		new Chart(context, {
			type: "bar",
			data: {
				labels: xValues,
				datasets: [
					{
						data: yValues,
						label: "Number of Songs",
						backgroundColor: barColor,
						borderColor: barColor,
						borderWidth: 2
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				aspectRatio: 16 / 9,
				layout: {
					padding: {
						top: 0,
						bottom: 10,
						left: 20,
						right: 20
					}
				},
				plugins: {
					title: {
						display: true,
						text: chartTitle,
						font: {
							size: 18
						}
					},
					legend: {
						labels: {
							useBorderRadius: true,
							borderRadius: 1,
							font: {
								size: 12
							}
						}
					}
				},
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							stepSize: 1,
							padding: 0,
							crossAlign: "near",
							font: {
								size: 16
							}
						},
						grid: {
							display: false
						}
					},
					x: {
						offset: true,
						ticks: {
							font: {
								size: 14
							},
							crossAlign: "far",
							padding: 5
						},
						grid: {
							display: false
						}
					}
				}
			}
		});
	});
</script>

<div class="w-[32rem] bg-[#DDDDDD] rounded-lg">
	<canvas bind:this={canvas} />
</div>
