# Badanie lokalnej integracji AI

## Ograniczenia

- Bez wywołań do chmury.
- Bez telemetrii.
- Bez kont i osobnego logowania.
- Bez procesu działającego w tle.
- Bez bazy danych.
- Użytkownik jawnie wybiera pliki albo akcje.

## Proponowany kształt

Mały lokalny wrapper komend, który przyjmuje zaznaczony tekst albo tymczasowy plik Markdown przekazany przez użytkownika. Przepływ powinien być widoczny i łatwy do cofnięcia.

## Otwarte pytania

- Jak dystrybuować zatwierdzone binaria modeli?
- Czy wynik modelu może być zapisywany w folderach projektowych?
- Jak opisać retencję promptów i odpowiedzi?
