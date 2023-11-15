export async function sleep(seconds: number) {
	return new Promise((resolve) => setTimeout(resolve, 1000 * seconds));
}
