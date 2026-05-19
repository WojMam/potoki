import { test, expect } from "@playwright/test";
import { createSampleWorkspace, gotoApp, sidebar } from "../utils/testWorkspace";
import { pl } from "../utils/selectors";
import { emptyWorkspaceTree } from "../utils/mockFileSystem";

const en = {
  workspaceTitle: "A quiet local workspace for returning to technical context.",
  sampleWorkspace: "Create sample workspace",
  settings: "Settings",
} as const;

test.describe("Settings @critical", () => {
  test("should switch language to English and persist after reload", async ({ page }) => {
    await createSampleWorkspace(page);

    await page.getByRole("button", { name: pl.settings.title }).click();
    await page.getByRole("button", { name: pl.settings.english }).click();
    await page.reload();

    await expect(page.getByRole("heading", { name: en.workspaceTitle })).toBeVisible();

    await gotoApp(page, emptyWorkspaceTree());
    await page.getByRole("button", { name: en.sampleWorkspace }).click();
    await page.getByRole("heading", { name: "What do you want to return to?" }).waitFor();

    await sidebar(page).getByRole("button", { name: en.settings }).click();
    await expect(page.getByRole("dialog").getByRole("heading", { name: en.settings })).toBeVisible();
  });
});
