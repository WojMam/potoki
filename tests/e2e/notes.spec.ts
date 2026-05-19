import { test, expect } from "@playwright/test";
import { openTestStreamFixture } from "../utils/testWorkspace";
import { pl } from "../utils/selectors";

test.describe("Notes @critical", () => {
  test.beforeEach(async ({ page }) => {
    await openTestStreamFixture(page);
  });

  test("should attach, preview, and save a note on a timeline entry", async ({ page }) => {
    const entry = page.getByRole("article", { name: "Wpis startowy" });
    await entry.getByRole("button", { name: pl.timeline.attachNote }).click();

    const noteTitle = "Notatka E2E";
    const noteBody = "# Nagłówek testowy\n\nTreść notatki E2E.";

    await page.getByRole("dialog").getByPlaceholder(pl.notes.titlePlaceholder).fill(noteTitle);
    await page.getByLabel(pl.notes.markdownEditor).fill(noteBody);
    await page.getByRole("dialog").getByRole("button", { name: pl.notes.save }).click();

    await expect(page.getByRole("dialog").filter({ hasText: noteTitle })).toBeVisible();
    await page.getByRole("button", { name: pl.common.closeDialog }).click();

    await expect(entry.getByRole("button", { name: noteTitle })).toBeVisible();

    await entry.getByRole("button", { name: noteTitle }).click();
    await expect(page.getByRole("dialog").filter({ hasText: noteTitle })).toBeVisible();

    const updatedBody = "# Zaktualizowany nagłówek\n\nZaktualizowana treść.";
    await page.getByRole("button", { name: pl.notes.edit }).click();
    await page.getByRole("dialog").getByRole("textbox").first().fill(updatedBody);
    await page.getByRole("dialog").getByRole("button", { name: pl.notes.save }).click();

    await expect(page.getByRole("heading", { name: "Zaktualizowany nagłówek", level: 1 })).toBeVisible();
    await page.getByRole("button", { name: pl.common.closeDialog }).click();
  });
});
