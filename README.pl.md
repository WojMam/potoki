# POTOKI

🇬🇧 English version: [README.md](README.md)

> Spokojna lokalna przestrzeń do wracania do kontekstu, notatek, decyzji i równoległych nurtów pracy.

[![Najnowsze wydanie](https://img.shields.io/github/v/release/WojMam/potoki?include_prereleases&label=release)](https://github.com/WojMam/potoki/releases)
[![GitHub Pages](https://github.com/WojMam/potoki/actions/workflows/deploy-pages.yaml/badge.svg)](https://github.com/WojMam/potoki/actions/workflows/deploy-pages.yaml)
[![Wersja](https://img.shields.io/github/package-json/v/WojMam/potoki?label=version)](package.json)
[![Local-first](https://img.shields.io/badge/local--first-tak-2f7f8f)](#filozofia-local-first)
[![Offline-first](https://img.shields.io/badge/offline--first-tak-2f7f8f)](#filozofia-local-first)
[![React + Vite + TypeScript](https://img.shields.io/badge/React%20%2B%20Vite%20%2B%20TypeScript-181f2a?logo=react)](#stos-technologiczny)

POTOKI to privacy-first, desktopowa aplikacja webowa do przechowywania kontekstu pracy technicznej w lokalnych plikach.

Pomaga prowadzić wiele równoległych nurtów pracy, zapisywać co się wydarzyło, trzymać notatki Markdown, podłączać lokalne artefakty i wracać do przerwanych myśli bez chmury, kont, telemetrii i backendu.

Aplikacja online: [wojmam.github.io/potoki](https://wojmam.github.io/potoki/)

---

## Spis treści

- [Czym są POTOKI?](#czym-są-potoki)
- [Filozofia](#filozofia)
- [Funkcje](#funkcje)
- [Zrzuty ekranu](#zrzuty-ekranu)
- [Uruchomienie](#uruchomienie)
- [Praca developerska](#praca-developerska)
- [Wymagania przeglądarki](#wymagania-przeglądarki)
- [Architektura Danych](#architektura-danych)
- [Filozofia Local-first](#filozofia-local-first)
- [Stos technologiczny](#stos-technologiczny)
- [Plan rozwoju](#plan-rozwoju)
- [Licencja](#licencja)

---

## Czym są POTOKI?

POTOKI to lokalna przestrzeń kontekstowa do pracy technicznej.

Aplikacja pomaga wracać do wielu równoległych tematów bez zamieniania ich w tablicę zadań, system ticketowy albo narzędzie do mierzenia produktywności.

Każdy **potok** to osobny nurt kontekstu: refaktor, analiza architektury, badania, dokumentacja, testy, decyzje operacyjne albo dowolny temat, do którego trzeba wracać po godzinach lub dniach.

POTOKI zapisują dane jako czytelne pliki:

- `JSON` dla workspace, potoków i timeline,
- `Markdown` dla notatek,
- lokalne ścieżki dla dołączonych plików i artefaktów.

Nie ma konta. Nie ma backendu. Nie ma chmury. Nie ma telemetrii.

---

## Filozofia

POTOKI nie próbują zarządzać Twoją pracą.

Ich celem jest zachowanie kontekstu.

To aplikacja dla osób, które często przełączają się między tematami i chcą spokojnie odpowiedzieć sobie na pytania:

- Co tu ostatnio robiłem?
- Jaką decyzję podjąłem i dlaczego?
- Co warto przeczytać przed powrotem do tematu?
- Jaki jest następny mały krok?
- Gdzie są lokalne notatki, szkice i pliki związane z tym kontekstem?

---

## Funkcje

- Wiele równoległych potoków pracy.
- Timeline wpisów dla każdego potoku.
- Szybkie wpisy: notatka, decyzja, wykonana akcja, praca, plik.
- Edycja i bezpieczne usuwanie wpisów.
- Aktualny kontekst potoku jako spokojna notatka operacyjna.
- Następne kroki / notatki powrotu.
- Lokalne notatki Markdown.
- Podpinanie notatek do potoku albo konkretnego wpisu.
- Podpinanie lokalnych plików do potoku albo konkretnego wpisu.
- Modalny podgląd i edycja Markdown.
- Lokalne wyszukiwanie w pamięci aplikacji.
- Ciemny, spokojny interfejs.
- Dwujęzyczny UI: Polski i English.
- Offline-first static build.
- Produkcyjny output jako pojedynczy `index.html`.

---

## Zrzuty ekranu

Screenshoty są zaplanowane i zostaną dodane, gdy dokumentacja wizualna dojrzeje.

<details>
<summary>Planowane zrzuty ekranu</summary>

- Przegląd
- Widok potoku
- Timeline
- Edytor Markdown
- Ustawienia
- Wybór workspace

</details>

---

## Uruchomienie

### Wersja Online

Otwórz:

[https://wojmam.github.io/potoki/](https://wojmam.github.io/potoki/)

Strona hostowana jest tylko statyczną powłoką aplikacji. Dane workspace nadal zostają w lokalnym folderze wybranym przez użytkownika.

### Lokalny Build

```bash
npm install
npm run build
```

Build produkcyjny tworzy pojedynczy plik:

```text
dist/
  index.html
```

Możesz skopiować ten plik na inną maszynę i otworzyć go w Chrome albo Edge.

---

## Praca developerska

Instalacja zależności:

```bash
npm install
```

Serwer developerski:

```bash
npm run dev
```

Typecheck:

```bash
npm run typecheck
```

Build produkcyjny:

```bash
npm run build
```

Podgląd produkcyjnego buildu:

```bash
npm run preview
```

Output produkcyjny jest celowo statyczny i samowystarczalny. Obecny build tworzy pojedynczy plik `dist/index.html`, który można skopiować i otworzyć bez lokalnego serwera.

---

## Wymagania przeglądarki

POTOKI używają **File System Access API**, dlatego wymagają przeglądarki Chromium:

- Google Chrome,
- Microsoft Edge,
- innej przeglądarki Chromium z obsługą File System Access API.

Jeśli API nie jest dostępne, aplikacja pokaże jasny komunikat i nie zapisze danych do ukrytego storage przeglądarki.

---

## Architektura Danych

POTOKI są aplikacją file-based. Dane użytkownika żyją w wybranym folderze workspace:

```text
workspace/
  workspace.json
  streams/
    local-ai-integration.json
  timeline/
    local-ai-integration.timeline.json
  notes/
    local-ai-integration/
      2026-05-15-research-notes.md
  artifacts/
    local-ai-integration/
      architecture.drawio
```

Aplikacja normalizuje starsze pliki przy odczycie, uzupełnia bezpieczne wartości domyślne i zapisuje przewidywalny aktualny format.

---

## Filozofia Local-first

POTOKI traktują folder workspace jako granicę produktu.

Aplikacja opiera się na kilku prostych zasadach:

- Dane należą do użytkownika.
- Pliki powinny pozostać czytelne poza aplikacją.
- Filesystem jest źródłem prawdy.
- Runtime nie wymaga serwera.
- Chmura nie jest wymagana.
- Telemetria nie jest zbierana.
- Konto nie jest potrzebne do spokojnego myślenia.

Dzięki temu POTOKI nadają się do pracy offline, środowisk ograniczonych i osobistego zarządzania kontekstem tam, gdzie prywatność jest ważniejsza niż funkcje współpracy.

---

## Stos technologiczny

- **React** dla UI.
- **TypeScript** dla bezpieczeństwa typów.
- **Vite** dla developmentu i buildów produkcyjnych.
- **Tailwind CSS** dla systemu wizualnego.
- **React Markdown** dla renderowania notatek.
- **File System Access API** dla dostępu do lokalnego workspace.
- **GitHub Pages** dla statycznego deploymentu.
- Lokalna warstwa repozytoriów nad plikami JSON i Markdown.

---

## Plan rozwoju

Możliwe kierunki rozwoju:

- Tagi i spokojne grupowanie potoków.
- Lepsze lokalne wyszukiwanie.
- Głębsze linkowanie wpisów, notatek i plików.
- Szablony potoków.
- Eksport/import workspace.
- Pomysły na pluginy/rozszerzenia.
- Konfigurowalny tryb skupienia.
- Lepsza nawigacja z klawiatury.
- AI-assisted context summaries jako opcjonalny pomysł na przyszłość.

Roadmapa jest celowo lekka. POTOKI powinny pozostać spokojne, lokalne i skoncentrowane na kontekście.

---

## Licencja

POTOKI są udostępniane na licencji [MIT](LICENSE).
