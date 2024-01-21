import { expect, test } from "@playwright/test";

test("explore page loads", async ({ page }) => {
	await page.goto("/explore");
	await page.getByLabel("email").fill("a@a.com");
	await page.getByLabel("password").fill("Akif123.");
	await page.locator('button:has-text("Log In")').click();
	await expect(page.locator("button:has(img)")).toBeVisible();
});

test("library page loads", async ({ page }) => {
	await page.goto("/library");
	await page.getByLabel("email").fill("a@a.com");
	await page.getByLabel("password").fill("Akif123.");
	await page.locator('button:has-text("Log In")').click();
	await expect(page.locator("h1:has-text('Library')")).toBeVisible();
});

test("profile page loads", async ({ page }) => {
	await page.goto("/profile");
	await page.getByLabel("email").fill("a@a.com");
	await page.getByLabel("password").fill("Akif123.");
	await page.locator('button:has-text("Log In")').click();
	await expect(page.locator("p:has-text('Rated Songs')")).toBeVisible();
});
