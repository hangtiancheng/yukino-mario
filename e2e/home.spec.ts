import { expect, test } from "@playwright/test";

test.describe("home route", (): void => {
  test("renders the Yukino Mario hero", async ({ page }): Promise<void> => {
    await page.goto("./");
    await expect(
      page.getByRole("heading", { level: 1, name: /yukino mario/i }),
    ).toBeVisible();
    await expect(page.getByText(/space jump/i)).toBeVisible();
  });

  test("exposes player name input and leaderboard", async ({
    page,
  }): Promise<void> => {
    await page.goto("./");
    await expect(page.getByText(/top scores/i)).toBeVisible();
    await page.getByRole("button", { name: /settings/i }).click();
    await expect(page.getByLabel(/player name/i)).toBeVisible();
  });

  test("lets players switch to hell difficulty", async ({
    page,
  }): Promise<void> => {
    await page.goto("./");
    await page.getByRole("button", { name: /settings/i }).click();
    const hellButton = page.getByRole("button", { name: /hell/i });
    await hellButton.click();
    await expect(hellButton).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText(/^hell \d+$/i)).toBeVisible();
  });

  test("running right advances the distance HUD", async ({
    page,
  }): Promise<void> => {
    await page.goto("./");
    const distance = page.getByText(/^dist \d+m$/i);
    await expect(distance).toHaveText(/dist 0m/i);
    await page.keyboard.down("ArrowRight");
    await expect(distance).toHaveText(/dist [1-9]\d*m/i);
    await page.keyboard.up("ArrowRight");
  });
});
