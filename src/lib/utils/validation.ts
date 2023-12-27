export function isValidRoute(route: string) {
	if (route.startsWith("/")) {
		route = route.slice(1);
	}
	// Remove potential phishing attempts
	if (route.startsWith("http://") || route.startsWith("https://")) {
		return false;
	}
	// Remove auth routes
	if (route.includes("login") || route.includes("signup")) {
		return false;
	}
	return true;
}
