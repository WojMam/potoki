# POTOKI — strategia testów E2E

Skrót w README: [Testing (EN)](../../README.md#testing) · [Testy (PL)](../../README.pl.md#testy).

## Cel

Chronić krytyczne ścieżki użytkownika w local-first aplikacji: otwarcie workspace, nawigacja, wpisy na osi czasu, notatki Markdown, ustawienia języka i otwarcie starszych plików danych.

Testy E2E **nie** mierzą pokrycia kodu ani poprawności implementacji repozytoriów — to rola testów jednostkowych (np. `normalizers.ts`).

## Zakres E2E

| Obszar | Tak |
|--------|-----|
| Start aplikacji, landing workspace | Tak |
| Utworzenie / otwarcie workspace (przez mock FS) | Tak |
| Dashboard, wejście w potok | Tak |
| Dodanie / edycja / usunięcie wpisu (z potwierdzeniem) | Tak |
| Notatka Markdown przy wpisie, podgląd, zapis | Tak |
| Toolbar Markdown (bold, italic, H2, lista, link) | Tak |
| Ustawienia — zmiana języka PL/EN + reload | Tak |
| Wczytanie legacy workspace (brak `schemaVersion`, stare pola) | Tak |
| Przystań — moduł, pomosty, karty, kopiowanie, edycja, usuwanie | Tak |
| Przystań na workspace bez `harbor/` (kompatybilność) | Tak |

## Czego NIE testujemy E2E

- Prawdziwy picker folderu OS i `showOpenFilePicker` (pliki lokalne)
- Normalizacja JSON (osobne testy unit)
- Wyszukiwanie, filtry sidebara, work log, usuwanie potoku
- Animacje tła, snapshoty wizualne, klasy CSS
- GitHub Pages vs dev — ten sam build Vite; smoke na `preview` opcjonalnie ręcznie
- Firefox / Safari (produkt wymaga Chromium + File System Access API)

## Główne ryzyka produktu

1. **Utrata / uszkodzenie danych** przy zapisie timeline lub notatek.
2. **Crash na starym workspace** — brak `schemaVersion`, stare nazwy pól (`body`, `worklog`).
3. **Regresja i18n** — hardcoded stringi, brak zapisu `potoki.language`.
4. **Niedostępność FS API** — komunikat na landing zamiast aplikacji.

## Priorytety

1. **Smoke** (`@smoke`) — start, landing, sample workspace, dashboard, wejście w potok.
2. **Critical** (`@critical`) — wpisy, notatki, ustawienia języka.
3. **Regression** (`@regression`) — toolbar Markdown, kompatybilność danych.

## Struktura katalogów

```text
tests/
  e2e/
    smoke.spec.ts
    streams.spec.ts
    notes.spec.ts
    settings.spec.ts
    markdown-editor.spec.ts
    data-compatibility.spec.ts
    harbor.spec.ts
  fixtures/
    workspaces/
      empty/
      sample/
      legacy-v0/
      legacy-missing-fields/
  utils/
    mockFileSystem.ts
    testWorkspace.ts
    selectors.ts
  scripts/
    patch-playwright-report.mjs
playwright.config.ts
docs/testing/TEST_STRATEGY.md
```

## Konwencje

- Pliki: `*.spec.ts`, opis testu: `test('should …', …)`.
- Tagi w tytule: `@smoke`, `@critical`, `@regression`.
- Język domyślny w testach: **PL** (`localStorage` / `storageState`).
- Bez `page.waitForTimeout` — wyłącznie `expect` z auto-wait Playwrighta.

## Fixture / dane testowe

- Małe, deterministyczne drzewa w `tests/fixtures/workspaces/`.
- Legacy: adaptacja z `docs/fixtures/data-compatibility/`.
- Sample workspace z aplikacji: pusty katalog + przycisk „Utwórz przykładową przestrzeń” (dane generuje `WorkspaceRepository`).

## Selektory

Kolejność:

1. `getByRole` (button, heading, dialog, textbox)
2. `getByLabel` / `aria-label`
3. `getByPlaceholder` — tylko gdy brak labela i nie planujemy poprawki a11y
4. Unikać selektorów CSS / klas Tailwind

Brak etykiety → najpierw poprawka UI (`aria-label`), potem test.

## File System Access API i localStorage

- **FS**: in-memory polyfill w `tests/utils/mockFileSystem.ts`, wstrzykiwany przez `page.addInitScript` przed nawigacją. `showDirectoryPicker` zwraca wirtualny katalog (pusty lub z fixture).
- **localStorage**: tylko `potoki.language` w testach ustawień; pozostałe dane użytkownika **nie** w localStorage (zgodnie z produktem).
- Mock ≠ prawdziwy Chromium FS — okresowy **ręczny smoke** w Chrome z `demoWorkspace/` zalecany przed releasem.

## CI (GitHub Actions)

Workflow: [`.github/workflows/e2e-playwright.yml`](../../.github/workflows/e2e-playwright.yml)

- Uruchamianie: push i pull request do gałęzi domyślnej (`main` lub `master`), oraz `workflow_dispatch`.
- Kroki: `npm ci` → `npx playwright install --with-deps chromium` → `npm run test:e2e` (`CI=true`).
- Raport HTML: artefakt `playwright-report` (30 dni) na stronie runu.
- **Summary** joba: link do runu, artefaktu i (na gałęzi domyślnej) hostowanego raportu.
- Anotacje w PR: reporter `github` włączony przy `CI=true`.

Publikacja hostowanego raportu (gałąź domyślna, np. `master`): [`.github/workflows/publish-playwright-report.yml`](../../.github/workflows/publish-playwright-report.yml) — automatycznie po E2E na gałęzi domyślnej, albo ręcznie (**Actions → Publish Playwright report → Run workflow**; opcjonalnie podaj `e2e_run_id`, inaczej ostatni zakończony run E2E na gałęzi domyślnej). URL: [wojmam.github.io/potoki/playwright-report/](https://wojmam.github.io/potoki/playwright-report/). Przed publikacją uruchamiany jest [`tests/scripts/patch-playwright-report.mjs`](../../tests/scripts/patch-playwright-report.mjs) (wymusza jasny motyw — raport Playwright domyślnie psuje kontrast w dark mode systemu).

Uwaga: automatyczny `workflow_run` wymaga, by oba workflow były na gałęzi domyślnej repozytorium. Run E2E z PR nie uruchamia publish. Gałęzie `main` i `master` są obsługiwane w workflow.

Lokalnie: `npm install` → `npx playwright install chromium` → `npm run test:e2e`.

## Uruchamianie

| Skrypt | Opis |
|--------|------|
| `npm run test:e2e` | headless, wszystkie specy; na końcu uruchamia `patch-playwright-report.mjs` |
| `npm run test:e2e:ui` | UI mode |
| `npm run test:e2e:headed` | z oknem przeglądarki |
| `npm run test:e2e:debug` | debug |
| `npm run test:e2e:report` | otwiera ostatni `playwright-report/` (`playwright show-report`) |

Po samym `playwright test` (bez npm) raport może mieć słaby kontrast w dark mode — uruchom: `node tests/scripts/patch-playwright-report.mjs`.
