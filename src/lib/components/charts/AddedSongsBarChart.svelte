<script lang="ts">
	import { onMount } from "svelte";
	import Chart from "chart.js/auto";

	let canvas: HTMLCanvasElement;
	let myChart: Chart;

	export let entityName: string;
	export let chartTitle: string;
	export let barColor = "#FFFFFF";
	export let friendBarColor = "#e54f2a";
	export let xValues: string[];
	export let yValues: number[];
	export let friendxValues: string[] = [];
	export let friendyValues: number[] = [];

	function createSingleChartData() {
		return {
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
		};
	}

	function createChartData() {
		let combinedXValues: string[] = [];
		let combinedYValues: number[] = [];
		let backgroundColors: string[] = [];

		if (friendxValues.length && friendyValues.length) {
			console.log("In the if");
			if (entityName === "artist" || entityName === "genre") {
				combinedXValues = xValues.slice(0, 5).concat(friendxValues.slice(0, 5));
				combinedYValues = yValues.slice(0, 5).concat(friendyValues.slice(0, 5));
				backgroundColors = new Array(5)
					.fill(barColor)
					.concat(new Array(5).fill(friendBarColor));
			} else if (entityName === "mood") {
				const moodOrder = ["Happy", "Sad", "Excited", "Relaxed"];

				let sortedXValues: string[] = [],
					sortedFriendXValues: string[] = [];
				let sortedYValues = new Array(moodOrder.length).fill(0);
				let sortedFriendYValues = new Array(moodOrder.length).fill(0);

				moodOrder.forEach((mood, index) => {
					const moodIndex = xValues.indexOf(mood);
					const friendMoodIndex = friendxValues.indexOf(mood);
					sortedXValues.push(mood);
					sortedFriendXValues.push(mood);

					if (moodIndex !== -1) {
						sortedYValues[index] = yValues[moodIndex];
					}
					if (friendMoodIndex !== -1) {
						sortedFriendYValues[index] = friendyValues[friendMoodIndex];
					}
				});

				xValues = sortedXValues;
				yValues = sortedYValues;
				friendxValues = sortedFriendXValues;
				friendyValues = sortedFriendYValues;

				for (let i = 0; i < xValues.length; i++) {
					combinedXValues.push(xValues[i], friendxValues[i]); // Alternate between main and friend values
					combinedYValues.push(yValues[i], friendyValues[i]);
					backgroundColors.push(barColor, friendBarColor);
				}
			} else if (entityName === "tempo") {
				const tempoOrder = ["Fast", "Medium", "Slow"];

				let sortedXValues: string[] = [],
					sortedFriendXValues: string[] = [];
				let sortedYValues = new Array(tempoOrder.length).fill(0);
				let sortedFriendYValues = new Array(tempoOrder.length).fill(0);

				tempoOrder.forEach((tempo, index) => {
					const moodIndex = xValues.indexOf(tempo);
					const friendMoodIndex = friendxValues.indexOf(tempo);
					sortedXValues.push(tempo);
					sortedFriendXValues.push(tempo);

					if (moodIndex !== -1) {
						sortedYValues[index] = yValues[moodIndex];
					}
					if (friendMoodIndex !== -1) {
						sortedFriendYValues[index] = friendyValues[friendMoodIndex];
					}
				});

				xValues = sortedXValues;
				yValues = sortedYValues;
				friendxValues = sortedFriendXValues;
				friendyValues = sortedFriendYValues;

				for (let i = 0; i < xValues.length; i++) {
					combinedXValues.push(xValues[i], friendxValues[i]); // Alternate between main and friend values
					combinedYValues.push(yValues[i], friendyValues[i]);
					backgroundColors.push(barColor, friendBarColor);
				}
			}
		} else {
			console.log("In the else");
			combinedXValues = [...xValues];
			combinedYValues = [...yValues];
			backgroundColors = new Array(xValues.length).fill(barColor);
		}

		return {
			labels: combinedXValues,
			datasets: [
				{
					data: combinedYValues,
					label: "Number of Songs",
					backgroundColor: backgroundColors,
					borderColor: backgroundColors,
					borderWidth: 2
				}
			]
		};
	}

	onMount(() => {
		const context = canvas.getContext("2d");
		if (!context) throw new Error("Could not get canvas context");

		myChart = new Chart(context, {
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

	$: {
		if (myChart) {
			if (friendyValues.length === 0) {
				// Update chart to only show your data
				myChart.data = createSingleChartData();
			} else {
				// Update chart to show combined data
				myChart.data = createChartData();
			}
			myChart.update();
		}
	}
</script>

<div class="w-11/12 bg-zinc-900 rounded-lg">
	<canvas bind:this={canvas} />
</div>
