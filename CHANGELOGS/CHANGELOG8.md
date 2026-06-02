# CHANGELOG 8 — Test labels EN + doc counts

## Tests

- **51 fichiers** (`*.spec.*`, `cypress/e2e/*.cy.ts`) : titres `describe` / `it` en anglais court, IDs conservés (ex. `1.1`, `DS.1.1`, `Flow 1`).
- **Vitest** : `npm test` → **203/203** (41 fichiers), +6 vs 197 (suites `downloadStore`, etc.).

## Doc

- `TESTING.md` : 203/203, tableau Cypress → libellés Flow EN.
- `DOSSIER TECHNIQUE/doc-app/src/data/doc-data.ts` : Vitest 203/203.
- `PRESENTATION-REACT/src/slides/Slide11.tsx` : 203 cas front, 45 cas intégration back.

## Résultats (session)

| Suite    | Résultat   |
| :------- | :--------- |
| Vitest   | ✅ 203/203 |
| Cypress  | ✅ 26/26 (`cy:run` ~46s — 7 specs, 0 fail) |
