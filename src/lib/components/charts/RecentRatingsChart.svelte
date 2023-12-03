<script lang="ts">
	import { onMount } from "svelte";
	import Chart from "chart.js/auto";
	import { getRandomRGBA } from "$lib/utils/colors";

	let canvas: HTMLCanvasElement;

	function getLast5Days() {
		let days = [];
		for (let i = 4; i >= 0; i--) {
			let d = new Date();
			d.setDate(d.getDate() - i);
			days.push(`${d.getDate()}/${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`);
		}
		return days;
	}

	// Recent Ratings by Mood
	// Recent Ratings by Tempo =>
	// Recent Ratings by Tempo
	// x_labels: string[] // x axis, in order
	// y_labels: object[] // label: string, data: number[], color: string

	export let chartData = {
		title: "Recent Ratings By Mood",
		xLabels: getLast5Days(),
		yLabels: [
			{ label: "Happy", data: [5, 4.2, 2.3, 3, 4], color: "green" },
			{ label: "Sad", data: [2, 3, 1, 3, 1], color: "blue" },
			{ label: "Excited", data: [0.5, 3, 2, 2, 3], colors: "red" }
		]
	};

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
			type: "line",
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
						offset: true,
						beginAtZero: true,
						max: 5,
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

<div class="w-full bg-[#DDDDDD] rounded-lg">
	<canvas bind:this={canvas} />
</div>
