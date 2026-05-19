import { test, expect } from "@playwright/test";
import { openSeededWorkspace, openStream, sidebar } from "../utils/testWorkspace";
import { pl } from "../utils/selectors";

test.describe("Data compatibility @regression", () => {
  test("should open a legacy workspace without schemaVersion", async ({ page }) => {
    await openSeededWorkspace(page, "legacy-v0");
    await openStream(page, pl.stream.legacy);

    await expect(page.getByRole("heading", { name: pl.stream.legacy, level: 1 })).toBeVisible();
    await expect(page.getByText("Older entries used body instead of content.")).toBeVisible();
    const legacyEntry = page.getByRole("article").filter({ hasText: "Legacy work log" });
    await expect(legacyEntry.getByText(pl.timeline.typeWorkLog)).toBeVisible();
  });

  test("should normalize streams and entries with missing optional fields", async ({ page }) => {
    await openSeededWorkspace(page, "legacy-missing-fields");

    await expect(sidebar(page).getByRole("button", { name: pl.stream.sparse })).toBeVisible();
    await expect(page.locator(".text-destructive-foreground")).toHaveCount(0);

    await openStream(page, pl.stream.sparse);
    await expect(page.getByRole("heading", { name: "Sparse entry", level: 2 })).toBeVisible();
  });
});
