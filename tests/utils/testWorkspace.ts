import type { Page } from "@playwright/test";
import { emptyWorkspaceTree, installFileSystemMock, loadWorkspaceFixture } from "./mockFileSystem";
import { pl } from "./selectors";

export async function gotoApp(page: Page, fixture?: Parameters<typeof installFileSystemMock>[1]) {
  await installFileSystemMock(page, fixture ?? emptyWorkspaceTree());
  await page.goto("/");
}

export async function createSampleWorkspace(page: Page) {
  await gotoApp(page, emptyWorkspaceTree());
  await page.getByRole("button", { name: pl.workspace.sample }).click();
  await page.getByRole("heading", { name: pl.dashboard.title }).waitFor();
}

export async function openSeededWorkspace(page: Page, fixtureName: string) {
  const tree = loadWorkspaceFixture(fixtureName);
  await gotoApp(page, tree);
  await page.getByRole("button", { name: pl.workspace.open }).click();
  await page.getByRole("heading", { name: pl.dashboard.title }).waitFor();
}

export function sidebar(page: Page) {
  return page.locator("aside");
}

export async function openStream(page: Page, streamTitle: string) {
  await sidebar(page).getByRole("button", { name: streamTitle }).click();
  await page.getByRole("heading", { name: streamTitle, level: 1 }).waitFor();
}

export async function goToDashboard(page: Page) {
  await page.getByRole("button", { name: pl.timeline.back }).click();
  await page.getByRole("heading", { name: pl.dashboard.title }).waitFor();
}

export async function confirmDelete(page: Page) {
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: pl.common.delete }).click();
  await dialog.waitFor({ state: "hidden" });
}

export async function openSampleStream(page: Page) {
  await createSampleWorkspace(page);
  await openStream(page, pl.stream.sampleAi);
}

export async function openTestStreamFixture(page: Page) {
  await openSeededWorkspace(page, "sample");
  await openStream(page, pl.stream.test);
}

export async function goToHarbor(page: Page) {
  await sidebar(page).getByRole("button", { name: pl.module.harbor, exact: true }).click();
  await page.getByRole("heading", { name: pl.harbor.title, level: 1 }).waitFor();
}

export async function goToPotoki(page: Page) {
  await sidebar(page).getByRole("button", { name: pl.module.potoki, exact: true }).click();
  await page.getByRole("heading", { name: pl.dashboard.title }).waitFor();
}

export async function createHarborPier(page: Page, name: string, description = "") {
  await page.getByRole("button", { name: pl.harbor.newPier }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.getByPlaceholder(pl.harbor.pierNamePlaceholder).fill(name);
  if (description) {
    await dialog.getByPlaceholder(pl.harbor.pierDescriptionPlaceholder).fill(description);
  }
  await dialog.getByRole("button", { name: pl.common.save }).click();
  await dialog.waitFor({ state: "hidden" });
  await page.getByRole("heading", { name, level: 2 }).waitFor();
}

export async function openHarborPier(page: Page, pierName: string) {
  await page.getByRole("heading", { name: pierName, level: 2 }).click();
  await page.getByRole("heading", { name: pierName, level: 1 }).waitFor();
}

export async function saveHarborCardDialog(page: Page) {
  const save = page.getByRole("dialog").getByRole("button", { name: pl.common.save });
  await save.scrollIntoViewIfNeeded();
  await save.click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
}
