<script lang="ts">
	import { onMount } from "svelte";
	import Chart from "chart.js/auto";

	let canvas: HTMLCanvasElement;
	let myChart: Chart;

	export let chartTitle: string;
	export let xValues: string[];
	export let yValues: number[];
	export let friendyValues: number[];
	export let lineColor = "#3498db";
	export let friendLineColor = "#e54f2a";

	onMount(() => {
		const context = canvas.getContext("2d");
		if (!context) throw new Error("Could not get canvas context");

		myChart = new Chart(context, {
			type: "line",
			data: {
				labels: xValues,
				datasets: []
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
						display: true,
						labels: {
							useBorderRadius: true,
							borderRadius: 2,
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

	$: if (myChart && yValues) {
		myChart.data.datasets[0] = {
			data: yValues,
			label: "My Number of Songs",
			borderColor: lineColor,
			borderWidth: 2,
			fill: false
		};
		myChart.update();
	}

	$: if (myChart && friendyValues) {
		if (friendyValues.length) {
			myChart.data.datasets[1] = {
				data: friendyValues,
				label: "Friend's Number of Songs",
				borderColor: friendLineColor,
				borderWidth: 2,
				fill: false
			};
		} else {
			myChart.data.datasets.splice(1, 1);
		}
		myChart.update();
	}
</script>

<div class="w-11/12 bg-zinc-900 rounded-lg">
	<canvas bind:this={canvas} />
</div>
