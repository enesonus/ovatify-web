import type { CarouselSong } from "$lib/types";
import { sleep } from "$lib/utils/time";

export async function getRecentAdditions() {
	const error = false;

	await sleep(0.5);
	const sampleResponseData: CarouselSong[] = [
		{
			id: "1",
			name: "Stronger",
			artists: ["Kanye West"],
			album: "Graduation",
			genre: "Pop",
			release_year: 2021
		},
		{
			id: "2",
			name: "Stronger",
			artists: ["Kanye West"],
			album: "Graduation",
			genre: "Pop",
			release_year: 2021
		},
		{
			id: "3",
			name: "Stronger",
			artists: ["Kanye West"],
			album: "Graduation",
			genre: "Pop",
			release_year: 2021
		},
		{
			id: "4",
			name: "Stronger",
			artists: ["Kanye West"],
			album: "Graduation",
			genre: "Pop",
			release_year: 2021
		}
	];

	if (error) {
		throw new Error();
	}
	// console.log(sampleResponseData);
	return sampleResponseData;
}

export async function getUserFavorites() {
	const error = false;
	await sleep(1.5);

	const sampleResponseData: CarouselSong[] = [
		{
			id: "1",
			name: "Stronger",
			artists: ["Kanye West"],
			album: "Graduation",
			genre: "Pop",
			release_year: 2021
		},
		{
			id: "2",
			name: "Stronger",
			artists: ["Kanye West"],
			album: "Graduation",
			genre: "Pop",
			release_year: 2021
		},
		{
			id: "3",
			name: "Stronger",
			artists: ["Kanye West"],
			album: "Graduation",
			genre: "Pop",
			release_year: 2021
		},
		{
			id: "4",
			name: "Stronger",
			artists: ["Kanye West"],
			album: "Graduation",
			genre: "Pop",
			release_year: 2021
		}
	];
	if (error) {
		throw new Error();
	}
	// console.log(sampleResponseData);
	return sampleResponseData;
}

export async function getFriendGroups() {
	const error = false;
	await sleep(1.3);

	const sampleResponseData: CarouselSong[] = [
		{
			id: "1",
			name: "Stronger",
			artists: ["Kanye West"],
			album: "Graduation",
			genre: "Pop",
			release_year: 2021
		},
		{
			id: "2",
			name: "Stronger",
			artists: ["Kanye West"],
			album: "Graduation",
			genre: "Pop",
			release_year: 2021
		},
		{
			id: "3",
			name: "Stronger",
			artists: ["Kanye West"],
			album: "Graduation",
			genre: "Pop",
			release_year: 2021
		},
		{
			id: "4",
			name: "Stronger",
			artists: ["Kanye West"],
			album: "Graduation",
			genre: "Pop",
			release_year: 2021
		}
	];
	if (error) {
		throw new Error();
	}
	// console.log(sampleResponseData);
	return sampleResponseData;
}
