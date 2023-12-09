<script lang="ts">
	import { onMount } from "svelte";
	import Chart from "chart.js/auto";
	import { getRandomRGBA } from "$lib/utils/colors";

	let canvas: HTMLCanvasElement;

	export let chartTitle: string;
	export let xValues: string[];
	export let yValues: number[];
	export let lineColor = "#3498db";

	onMount(() => {
		const context = canvas.getContext("2d");
		if (!context) throw new Error("Could not get canvas context");
		new Chart(context, {
			type: "line",
			data: {
				labels: xValues,
				datasets: [
					{
						data: yValues,
						label: "Number of Songs",
						borderColor: lineColor,
						borderWidth: 2,
						fill: false
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
						display: false,
						text: chartTitle,
						font: {
							size: 18
						}
					},
					legend: {
						display: false,
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
						offset: true,
						beginAtZero: true,
						max: undefined,
						ticks: {
							backdropColor: "rgba(0, 0, 0, 0)",
							padding: 0,
							stepSize: 1,
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

<div class="w-11/12 bg-zinc-900 rounded-lg">
	<canvas bind:this={canvas} />
</div>
