import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
	webServer: {
		command: "npm run build && npm run preview",
		port: 4173
	},
	testDir: "tests",
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,

	// Define projects for different browsers
	projects: [
		{
			name: "Chrome",
			use: {
				...devices["Desktop Chrome"]
			}
		}
	]
};

export default config;
