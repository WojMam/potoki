# Plan refaktoryzacji automatyzacji API

## Cel

Zmniejszyć powtarzalne przygotowanie testów bez ukrywania ich zachowania.

## Zostaje

- Obecny układ zestawów testów.
- Jawne nazwy scenariuszy.
- Własność po stronie konkretnych zestawów.

## Zmiany

- Wyciągnąć fabryki fixture dla wspólnych domyślnych payloadów.
- Przenieść powtarzane asercje odpowiedzi do małych helperów.
- Zostawić politykę ponowień blisko testu, który jej używa.

## Nie robić

Nie budować szerokiego frameworka testowego. Zespół potrzebuje mniej pośrednich warstw, nie więcej.
