# Phase 6 testing and parity sign-off

This document records the Phase 6 verification pass for Angular migration parity.

## Scope covered

- Route/query-param behavior for all legacy page patterns.
- API endpoint and core parameter parity for read and write flows.
- Mutation flows for word and definition edit pages.
- Loading/empty/error-path assertions in unit tests.

## Automated verification matrix

| Parity area | Evidence | Status |
|---|---|---|
| Legacy route aliases (`*.html`) redirect to Angular routes | `src/app/app.routes.spec.ts` | ✅ |
| Search query-param contract (`term`) including empty-term API calls | `src/app/features/search-page/search-page.component.spec.ts` | ✅ |
| Dictionary query-param contract (`language`) | `src/app/features/dictionary-page/dictionary-page.component.spec.ts` | ✅ |
| Word page `word`/`term` query-param behavior and save validation/error state | `src/app/features/word-page/word-page.component.spec.ts` | ✅ |
| Definition page `defid` query-param behavior and edit/save error state | `src/app/features/definition-page/definition-page.component.spec.ts` | ✅ |
| Recent changes page read parity and loading completion | `src/app/features/recent-changes-page/recent-changes-page.component.spec.ts` | ✅ |
| Inconsistent definitions page query-param and legacy-compatible links | `src/app/features/inconsistent-definitions-page/inconsistent-definitions-page.component.spec.ts` | ✅ |
| Convergent translations page query-param and link fallback behavior | `src/app/features/convergent-translations-page/convergent-translations-page.component.spec.ts` | ✅ |
| Read endpoint + query-param parity inventory | `src/app/core/services/dictionary.service.spec.ts` | ✅ |
| Write endpoint parity (`/dict/entry/:id/edit`, `/defn/:id/edit`) | `src/app/core/services/word-edit.service.spec.ts` | ✅ |
| Edit helper parity for staged add/delete/update transforms | `src/app/core/helpers/edit-workflow.helpers.spec.ts` | ✅ |

## Test command log

- `npm test -- --watch=false`

Result: all Angular unit tests pass (39 tests).

## Phase 6 exit criteria sign-off

- [x] Route/query-param parity checks pass.
- [x] API parity checks pass.
- [x] Edit-flow checks pass.
- [x] Empty/loading/error-path checks are present and passing.
- [x] Phase 6 evidence documented.
