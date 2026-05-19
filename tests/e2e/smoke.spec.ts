import { test, expect } from "@playwright/test";
import { createSampleWorkspace, gotoApp, openStream, sidebar } from "../utils/testWorkspace";
import { pl } from "../utils/selectors";
import { emptyWorkspaceTree } from "../utils/mockFileSystem";

test.describe("Smoke @smoke", () => {
  test("should load the app without page errors", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await gotoApp(page, emptyWorkspaceTree());
    await expect(page).toHaveTitle(/POTOKI/i);
    expect(pageErrors).toEqual([]);
  });

  test("should render the workspace landing screen", async ({ page }) => {
    await gotoApp(page, emptyWorkspaceTree());

    await expect(page.getByRole("heading", { name: pl.workspace.title })).toBeVisible();
    await expect(page.getByRole("button", { name: pl.workspace.open })).toBeVisible();
    await expect(page.getByRole("button", { name: pl.workspace.sample })).toBeVisible();
  });

  test("should create a sample workspace and show the dashboard", async ({ page }) => {
    await createSampleWorkspace(page);

    await expect(page.getByRole("heading", { name: pl.dashboard.title })).toBeVisible();
    await expect(sidebar(page).getByRole("button", { name: pl.stream.sampleAi })).toBeVisible();
  });

  test("should open a stream from the sidebar", async ({ page }) => {
    await createSampleWorkspace(page);
    await openStream(page, pl.stream.sampleAi);

    await expect(page.getByRole("heading", { name: pl.stream.sampleAi, level: 1 })).toBeVisible();
    await expect(page.getByRole("button", { name: pl.timeline.addEntry })).toBeVisible();
  });
});
