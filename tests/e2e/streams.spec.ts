import { test, expect } from "@playwright/test";
import { confirmDelete, openTestStreamFixture } from "../utils/testWorkspace";
import { pl } from "../utils/selectors";

test.describe("Stream timeline @critical", () => {
  test.beforeEach(async ({ page }) => {
    await openTestStreamFixture(page);
  });

  test("should add a timeline entry", async ({ page }) => {
    const title = "Nowy wpis testowy";
    const content = "Treść wpisu testowego.";

    await page.getByLabel(pl.timeline.entryTitle).fill(title);
    await page.getByPlaceholder("Co się zmieniło i co warto zapamiętać?").fill(content);
    await page.getByRole("button", { name: pl.timeline.addEntry }).click();

    await expect(page.getByRole("heading", { name: title, level: 2 })).toBeVisible();
    await expect(page.getByText(content)).toBeVisible();
  });

  test("should edit a timeline entry", async ({ page }) => {
    const title = "Wpis startowy";
    const entry = page.getByRole("article", { name: title });
    await expect(entry.getByRole("heading", { name: title, level: 2 })).toBeVisible();

    await entry.getByRole("button", { name: pl.timeline.edit }).click({ force: true });
    await expect(entry.getByRole("button", { name: pl.timeline.save })).toBeVisible();

    const updatedTitle = "Wpis po edycji";
    await entry.getByRole("textbox", { name: pl.timeline.editTitle }).fill(updatedTitle);
    await entry.getByRole("button", { name: pl.timeline.save }).click();

    await expect(page.getByRole("article", { name: updatedTitle })).toBeVisible();
    await expect(page.getByRole("heading", { name: updatedTitle, level: 2 })).toBeVisible();
  });

  test("should delete a timeline entry after confirmation", async ({ page }) => {
    const title = "Wpis do usunięcia";
    await page.getByLabel(pl.timeline.entryTitle).fill(title);
    await page.getByRole("button", { name: pl.timeline.addEntry }).click();
    const entry = page.getByRole("article", { name: title });
    await expect(entry).toBeVisible();

    await entry.getByRole("button", { name: pl.timeline.delete }).click({ force: true });

    await expect(page.getByRole("dialog")).toBeVisible();
    await confirmDelete(page);

    await expect(page.getByRole("heading", { name: title, level: 2 })).toHaveCount(0);
  });
});
