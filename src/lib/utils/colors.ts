export function getRandomRGBA() {
	const red = Math.floor(Math.random() * 256);
	const green = Math.floor(Math.random() * 256);
	const blue = Math.floor(Math.random() * 256);
	const alpha = Math.random().toFixed(2);

	return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function getRatingColor(rating: number) {
	if (!rating) return "border-stone-800";
	if (rating == 5) return "border-teal-700";
	if (rating < 5 && rating > 4.5) return "border-emerald-700";
	if (rating <= 4.5 && rating > 4) return "border-lime-700";
	if (rating <= 4 && rating > 3) return "border-yellow-700";
	if (rating <= 3 && rating > 2) return "border-amber-700";
	if (rating <= 2 && rating > 1) return "border-orange-700";
	if (rating == 1) return "border-red-700";
}

export function disabledBtn(loading: boolean) {
	return {
		"opacity-50 bg-muted hover:bg-muted cursor-not-allowed": loading
	};
}
