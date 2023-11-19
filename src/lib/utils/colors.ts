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
