import { test, expect } from "@playwright/test";
import { openTestStreamFixture } from "../utils/testWorkspace";
import { pl } from "../utils/selectors";

test.describe("Markdown toolbar @regression", () => {
  test.beforeEach(async ({ page }) => {
    await openTestStreamFixture(page);
    const entry = page.getByRole("article", { name: "Wpis startowy" });
    await entry.getByRole("button", { name: pl.timeline.attachNote }).click();
  });

  async function editor(page: import("@playwright/test").Page) {
    return page.getByLabel(pl.notes.markdownEditor);
  }

  async function selectAllInEditor(page: import("@playwright/test").Page) {
    const textarea = await editor(page);
    await textarea.focus();
    await page.keyboard.press("ControlOrMeta+A");
  }

  test("should wrap selection in bold", async ({ page }) => {
    const textarea = await editor(page);
    await textarea.fill("tekst");
    await selectAllInEditor(page);
    await page.getByRole("button", { name: pl.markdown.bold }).click();
    await expect(textarea).toHaveValue("**tekst**");
  });

  test("should wrap selection in italic", async ({ page }) => {
    const textarea = await editor(page);
    await textarea.fill("tekst");
    await selectAllInEditor(page);
    await page.getByRole("button", { name: pl.markdown.italic }).click();
    await expect(textarea).toHaveValue("*tekst*");
  });

  test("should prefix selection with heading 2", async ({ page }) => {
    const textarea = await editor(page);
    await textarea.fill("nagłówek");
    await selectAllInEditor(page);
    await page.getByRole("button", { name: pl.markdown.heading2 }).click();
    await expect(textarea).toHaveValue("## nagłówek");
  });

  test("should prefix multiple lines as a bulleted list", async ({ page }) => {
    const textarea = await editor(page);
    await textarea.fill("linia jeden\nlinia dwa");
    await selectAllInEditor(page);
    await page.getByRole("button", { name: pl.markdown.bulletedList }).click();
    await expect(textarea).toHaveValue("- linia jeden\n- linia dwa");
  });

  test("should wrap selection in a markdown link", async ({ page }) => {
    const textarea = await editor(page);
    await textarea.fill("etykieta");
    await selectAllInEditor(page);
    await page.getByRole("button", { name: pl.markdown.link }).click();
    await expect(textarea).toHaveValue("[etykieta](url)");
  });
});
