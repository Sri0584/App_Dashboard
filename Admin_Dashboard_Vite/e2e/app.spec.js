import { test, expect } from "@playwright/test";

test("homepage loads and displays dashboard", async ({ page }) => {
	await page.goto("/");
	await expect(page).toHaveTitle(/Admin Dashboard/);
	await expect(page.locator("main")).toBeVisible();
	await expect(page.locator("text=Dashboard").first()).toBeVisible();
});

test("navigation to users page", async ({ page }) => {
	await page.goto("/");
	await page.click("text=Users"); // Assuming sidebar has this link
	await expect(page).toHaveURL(/users/);
	await expect(page.locator("text=Create User")).toBeVisible();
});

test("navigation to products page", async ({ page }) => {
	await page.goto("/");
	await page.click("text=Products");
	await expect(page).toHaveURL(/.*products/);
	await expect(page.locator("text=Product")).toBeVisible();
});

test("login form interaction", async ({ page }) => {
	await page.goto("/login");
	await page.fill('input[name="email"]', "testuser");
	await page.fill('input[name="password"]', "testpass");
	await page.click('button[type="submit"]');
	// Add assertions based on login behavior
});
