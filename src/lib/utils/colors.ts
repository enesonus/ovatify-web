export function getRandomRGBA() {
	// Generate each color component
	const red = Math.floor(Math.random() * 256);
	const green = Math.floor(Math.random() * 256);
	const blue = Math.floor(Math.random() * 256);

	// Generate alpha value
	const alpha = Math.random().toFixed(2); // Keeps the alpha value to two decimal places

	// Return the color in rgba format
	return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function getRatingColor(rating: number) {
	console.log(rating);
	if (!rating) return "bg-stone-800 hover:bg-stone-700";
	if (rating == 5) return "bg-teal-700 hover:bg-teal-600";
	if (rating < 5 && rating > 4.5) return "bg-emerald-700 hover:bg-emerald-600";
	if (rating <= 4.5 && rating > 4) return "bg-lime-700 hover:bg-lime-600";
	if (rating <= 4 && rating > 3) return "bg-yellow-700 hover:bg-yellow-600";
	if (rating <= 3 && rating > 2) return "bg-amber-700 hover:bg-amber-600";
	if (rating <= 2 && rating > 1) return "bg-orange-700 hover:bg-orange-600";
	if (rating == 1) return "bg-red-700 hover:bg-red-600";
}
