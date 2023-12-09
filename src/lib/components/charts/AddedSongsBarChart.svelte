<script lang="ts">
	import { onMount } from "svelte";
	import Chart, { type Color } from "chart.js/auto";

	let canvas: HTMLCanvasElement;

	export let chartTitle: string;
	export let barColor = "#FFFFFF";
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
						display: false
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
						},
						title: {
							display: true,
							text: "Number of Songs",
							font: {
								size: 12
							},
							color: "#FFFFFF"
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

<div class="w-11/12 bg-zinc-900 rounded-lg">
	<canvas bind:this={canvas} />
</div>
