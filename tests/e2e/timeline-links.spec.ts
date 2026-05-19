import { test, expect } from "@playwright/test";
import { openTestStreamFixture } from "../utils/testWorkspace";
import { pl } from "../utils/selectors";

test.describe("Timeline file links @regression", () => {
  test.beforeEach(async ({ page }) => {
    await openTestStreamFixture(page);
  });

  test("should unlink a non-markdown file while editing an entry", async ({ page }) => {
    const entry = page.getByRole("article", { name: "Wpis startowy" });

    await entry.getByRole("button", { name: pl.timeline.edit }).click({ force: true });
    await expect(entry.getByRole("button", { name: "diagram.drawio" })).toBeVisible();

    await entry.getByRole("button", { name: pl.timeline.unlinkFile }).click();
    await expect(entry.getByRole("button", { name: "diagram.drawio" })).toHaveCount(0);

    await entry.getByRole("button", { name: pl.timeline.save }).click();
    await expect(entry.getByRole("button", { name: "diagram.drawio" })).toHaveCount(0);
  });
});
