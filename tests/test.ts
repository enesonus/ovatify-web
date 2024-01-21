import { expect, test } from "@playwright/test";

test("login and logout works", async ({ page }) => {
	await page.goto("/");
	await page.getByLabel("email").fill("a@a.com");
	await page.getByLabel("password").fill("Akif123.");
	await page.locator('button:has-text("Log In")').click();
	await expect(page.getByRole("heading", { name: "Welcome" })).toBeVisible();
	await page.locator("button[data-bits-dropdown-menu-trigger]").click();
	await page.locator('[data-testid="logout-btn"]').click();
	await expect(page.locator("button:has-text('Log In')")).toBeVisible();
});

test("home page shows welcome message", async ({ page }) => {
	await page.goto("/");
	await page.getByLabel("email").fill("a@a.com");
	await page.getByLabel("password").fill("Akif123.");
	await page.locator('button:has-text("Log In")').click();
	await expect(page.getByRole("heading", { name: "Welcome" })).toBeVisible();
});

test("database search functionality works", async ({ page }) => {
	await page.goto("/");
	await page.getByLabel("email").fill("a@a.com");
	await page.getByLabel("password").fill("Akif123.");
	await page.locator('button:has-text("Log In")').click();
	await page.locator("button:has-text('Search songs, albums')").click();
	await page.getByRole("searchbox").fill("hello");
	await expect(page.locator("button:has-text('Album')")).toBeVisible();
});

test("clicking on an image on the carousel in the home page displays detailed song information", async ({
	page
}) => {
	await page.goto("/");
	await page.getByLabel("email").fill("a@a.com");
	await page.getByLabel("password").fill("Akif123.");
	await page.locator('button:has-text("Log In")').click();
	// await page.locator("button:has(img)").nth(1).click();
	await page.locator('div[data-testid="song-carousel"] button').nth(0).click();
	await expect(page.locator("a:has-text('Listen On')")).toBeVisible();
});
