<script lang="ts">
	import { onMount } from "svelte";
	import Chart from "chart.js/auto";
	import { getRandomRGBA } from "$lib/utils/colors";

	let canvas: HTMLCanvasElement;

	export let chartData: any;

	function getDataSets(chartData: any) {
		const returnData = [];
		for (const yLabel in chartData.yLabels) {
			const color = getRandomRGBA();
			returnData.push({
				data: chartData.yLabels[yLabel].data,
				label: chartData.yLabels[yLabel].label,
				backgroundColor: chartData.yLabels[yLabel].color ?? color,
				borderColor: chartData.yLabels[yLabel].color ?? color,
				borderWidth: 2,
				fill: false
			});
		}
		return returnData;
	}

	onMount(() => {
		const context = canvas.getContext("2d");
		if (!context) throw new Error("Could not get canvas context");
		new Chart(context, {
			type: "bar",
			data: {
				labels: chartData.xLabels,
				datasets: getDataSets(chartData)
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
						text: chartData.title,
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
