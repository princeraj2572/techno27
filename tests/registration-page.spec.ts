import { test, expect } from "@playwright/test";

test("registration page loads", async ({ page }) => {
  await page.goto("/auth/signup");

  await expect(page.getByText("Create Account", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /continue|send otp|next/i })).toBeVisible();
});
