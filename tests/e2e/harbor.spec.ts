import { test, expect } from "@playwright/test";
import {
  confirmDelete,
  createHarborPier,
  createSampleWorkspace,
  goToHarbor,
  goToPotoki,
  openHarborPier,
  openSeededWorkspace,
  saveHarborCardDialog,
  sidebar,
} from "../utils/testWorkspace";
import { pl } from "../utils/selectors";

test.describe("Harbor @smoke", () => {
  test.beforeEach(async ({ page }) => {
    await createSampleWorkspace(page);
    await goToHarbor(page);
  });

  test("should show harbor home with empty piers state", async ({ page }) => {
    await expect(page.getByRole("heading", { name: pl.harbor.title, level: 1 })).toBeVisible();
    await expect(sidebar(page).getByRole("button", { name: pl.harbor.newPier })).toBeVisible();
    await expect(page.getByRole("main").getByText(/Nie ma jeszcze pomostów/)).toBeVisible();
  });

  test("should list piers and cards in the sidebar", async ({ page }) => {
    await createHarborPier(page, "SQL E2E", "Zapytania testowe");
    await expect(sidebar(page).getByRole("button", { name: "SQL E2E" })).toBeVisible();
    await sidebar(page).getByRole("button", { name: "SQL E2E" }).click();
    await page.getByRole("button", { name: pl.harbor.newCard }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByPlaceholder(pl.harbor.cardTitlePlaceholder).fill("Pierwszy SELECT");
    await dialog.getByLabel(pl.harbor.cardContentPlaceholder).fill("SELECT 1");
    await saveHarborCardDialog(page);
    await expect(sidebar(page).getByRole("button", { name: "Pierwszy SELECT" })).toBeVisible();
  });

  test("should switch between Potoki and Przystań", async ({ page }) => {
    await goToPotoki(page);
    await expect(page.getByRole("heading", { name: pl.dashboard.title })).toBeVisible();

    await goToHarbor(page);
    await expect(page.getByRole("heading", { name: pl.harbor.title, level: 1 })).toBeVisible();
  });
});

test.describe("Harbor @critical", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await createSampleWorkspace(page);
    await goToHarbor(page);
    await createHarborPier(page, "SQL E2E", "Zapytania testowe");
    await openHarborPier(page, "SQL E2E");
  });

  test("should create, view, copy, edit and delete a harbor card", async ({ page }) => {
    const cardTitle = "Aktywni użytkownicy";
    const initialSql = "SELECT id, email FROM users WHERE active = 1;";
    const updatedSql = "SELECT COUNT(*) FROM users WHERE active = 1;";

    await page.getByRole("button", { name: pl.harbor.newCard }).click();
    const dialog = page.getByRole("dialog").filter({ hasText: pl.harbor.newCard });
    await dialog.getByPlaceholder(pl.harbor.cardTitlePlaceholder).fill(cardTitle);
    await dialog.getByLabel(pl.harbor.syntax).selectOption("sql");
    await dialog.getByLabel(pl.harbor.cardContentPlaceholder).fill(initialSql);
    await expect(dialog.locator("code.hljs")).toContainText("SELECT");
    await saveHarborCardDialog(page);

    await page.getByRole("main").getByRole("button", { name: cardTitle }).click();
    await expect(page.getByRole("heading", { name: cardTitle, level: 1 })).toBeVisible();
    await expect(page.locator("code.hljs")).toContainText("users");

    await page.getByRole("button", { name: pl.harbor.copy }).click();
    await expect(page.getByRole("button", { name: pl.harbor.copied })).toBeVisible();

    await page.getByRole("button", { name: pl.harbor.edit }).click();
    const editDialog = page.getByRole("dialog").filter({ hasText: pl.harbor.editCard });
    await editDialog.getByLabel(pl.harbor.cardContentPlaceholder).fill(updatedSql);
    await saveHarborCardDialog(page);
    await expect(page.locator("code.hljs")).toContainText("COUNT");

    await page.getByRole("button", { name: pl.harbor.delete }).click();
    await expect(page.getByRole("dialog").filter({ hasText: pl.harbor.deleteCardTitle })).toBeVisible();
    await confirmDelete(page);

    await expect(page.getByRole("button", { name: cardTitle })).toHaveCount(0);
    await expect(sidebar(page).getByRole("button", { name: cardTitle })).toHaveCount(0);
  });

  test("should filter cards with pier search", async ({ page }) => {
    await page.getByRole("button", { name: pl.harbor.newCard }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByPlaceholder(pl.harbor.cardTitlePlaceholder).fill("Widoczna karta");
    await dialog.getByLabel(pl.harbor.cardContentPlaceholder).fill("treść");
    await saveHarborCardDialog(page);

    await page.getByRole("button", { name: pl.harbor.newCard }).click();
    await dialog.getByPlaceholder(pl.harbor.cardTitlePlaceholder).fill("Ukryta karta");
    await dialog.getByLabel(pl.harbor.cardContentPlaceholder).fill("treść");
    await saveHarborCardDialog(page);

    await page.getByPlaceholder(pl.harbor.searchCards).fill("Widoczna");
    await expect(page.getByRole("main").getByRole("button", { name: "Widoczna karta" })).toBeVisible();
    await expect(page.getByRole("main").getByRole("button", { name: "Ukryta karta" })).toHaveCount(0);
  });
});

test.describe("Harbor compatibility @regression", () => {
  test("should open harbor on workspace without harbor directory", async ({ page }) => {
    await openSeededWorkspace(page, "sample");
    await goToHarbor(page);

    await expect(page.getByRole("heading", { name: pl.harbor.title, level: 1 })).toBeVisible();
    await expect(sidebar(page).getByRole("button", { name: pl.harbor.newPier })).toBeVisible();
    await expect(page.getByRole("main").getByText(/Nie ma jeszcze pomostów/)).toBeVisible();

    await goToPotoki(page);
    await expect(sidebar(page).getByRole("button", { name: pl.stream.test })).toBeVisible();
  });
});
