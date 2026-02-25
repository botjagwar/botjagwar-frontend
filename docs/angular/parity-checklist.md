# Angular Migration Parity Checklist (Phase 0)

This document freezes legacy Vue/static behavior before Angular migration. It is the parity baseline for routes, query parameters, UI behavior, and backend API usage.

## Route and query-parameter matrix

| Legacy page | Legacy script | Required query params | Optional query params | Behavior summary |
|---|---|---|---|---|
| `/index.html` | `main.js` | none | none | Fetches language list and links to dictionary per language. |
| `/search.html` | `js/search.js` | `term` (effectively required for meaningful results) | none | Executes word and definition search requests with `like.<term>` filters. |
| `/dictionary.html` | `js/dictionary.js` | none | `language` | Loads dictionary entries for selected language; supports refetch via input + button/Enter. |
| `/word.html` | `js/word.js` | one of: `word` **or** `term` | none | `word` loads single word by id; `term` loads matching words; supports definition add/delete and save. |
| `/definition.html` | `js/definition.js` | `defid` | none | Loads one definition and linked words; supports dissociation and save. |
| `/recent_changes.html` | `js/recentchanges.js` | none | none | Displays latest words and latest definitions with edit links. |
| `/inconsistent_definitions.html` | `js/inconsistent_definitions.js` | none | `language` (read but not used in fetch) | Shows inconsistency report from materialized endpoint. |
| `/convergent_translations.html` | `js/convergent_translations.js` | none | `language` (read but not used in fetch) | Shows convergent translations report. |

## Shared runtime behavior (all pages)

- Data access is synchronous `XMLHttpRequest` through `Request()` in `js/utils.js` (`open(..., false)`).
- JSON body is parsed directly with `JSON.parse(Httpreq.responseText)`.
- Common lookup fetches:
  - `fetch_language_mapping()` calls `GET /langs` and maps `iso_code` to `english_name` or `malagasy_name` fallback.
  - `fetch_pos_mapping()` calls `GET /pos.json`.
- Header component (`botjagwar-header`) provides top navigation and a search form (`GET /search.html?term=...`).

## Legacy page behavior checklist

### 1) Main (`/index.html`, `main.js`)
- [ ] Page renders language cards from `GET /dict/list`.
- [ ] Each language links to `/dictionary.html?language=<code>`.
- [ ] Language display names come from `GET /langs` mapping.

### 2) Search (`/search.html`, `js/search.js`)
- [ ] Word result set loaded from:
  - `GET /api/json_dictionary?word=like.<term>&limit=100`
- [ ] Definition result set loaded from:
  - `GET /api/definitions?definition=like.<term>%&limit=100`
- [ ] Word links resolve to `/word.html?word=<id>`.
- [ ] Definition links resolve to `/definition.html?defid=<id>`.
- [ ] Language links resolve to `/dictionary.html?language=<code>`.

### 3) Dictionary (`/dictionary.html`, `js/dictionary.js`)
- [ ] Initial language taken from `?language=`.
- [ ] Initial fetch uses `GET /dict/<language>`.
- [ ] “Fetch words from language” and Enter key refetch from `GET /dict/<language>`.
- [ ] Spinner `#fetch_spinner` is toggled before/after fetch.
- [ ] Word row links resolve to `/word.html?word=<id>`.

### 4) Word (`/word.html`, `js/word.js`)
- [ ] If `?word=<id>`: fetches `GET /wrd/<id>` and displays a single word.
- [ ] If `?term=<term>`: fetches `GET /api/vw_json_dictionary?word=like.<term>` and displays multiple words.
- [ ] Adds in-memory definition entries (`new_definitions` + visible `words[i].definitions`).
- [ ] Deletes definition entries from visible list and tracks persisted definitions in `definitions_to_delete` when `definition.id` exists.
- [ ] Save sets each definition's `definition_language = language` before request.
- [ ] Save sends one request per displayed word:
  - `PUT /dict/entry/<word_id>/edit`
- [ ] POS labels come from `GET /pos.json`.

### 5) Definition (`/definition.html`, `js/definition.js`)
- [ ] Reads `?defid=<id>` and fetches:
  - `GET /defn/<id>` (definition)
  - `GET /defw/<id>` (linked words list from first element)
- [ ] “Dissociate” removes a word from UI and stages edited word copy in `new_words_version`.
- [ ] Dissociation flow fetches original word with `GET /wrd/<word_id>`, removes current definition id from that word's `definitions` array.
- [ ] Save sets `definition.definition_language = definition.language`.
- [ ] Save sends:
  - `PUT /defn/<definition_id>/edit`
  - `PUT /dict/entry/<word_id>/edit` for each staged word in `new_words_version`.
- [ ] Cancel re-adds staged words to visible list and clears `new_words_version`.

### 6) Recent changes (`/recent_changes.html`, `js/recentchanges.js`)
- [ ] Words table loads from:
  - `GET /api/json_dictionary?limit=100&select=id,word,language,part_of_speech,last_modified&order=id.desc`
- [ ] Definitions table loads from:
  - `GET /api/definitions?limit=100&select=id,definition,definition_language,date_changed&order=id.desc`
- [ ] Word links resolve to `/word.html?word=<id>`.
- [ ] Definition links resolve to `/definition.html?defid=<id>`.

### 7) Inconsistent definitions (`/inconsistent_definitions.html`, `js/inconsistent_definitions.js`)
- [ ] Report loads from:
  - `GET /api/matview_inconsistent_definitions?limit=1000`
- [ ] Word links resolve to `word.html?term=<word>` (relative URL in legacy page).
- [ ] Definition link currently uses `definition.html?id=<value>` in markup (note: param name differs from `defid`).

### 8) Convergent translations (`/convergent_translations.html`, `js/convergent_translations.js`)
- [ ] Report loads from:
  - `GET /api/convergent_translations?limit=1000`
- [ ] Word links resolve to `word.html?term=<word>`.
- [ ] Definition links resolve to `definition.html?defid=<id>` for EN/FR/MG definition columns.

## API endpoint inventory (frozen)

### Read endpoints
- `GET /langs`
- `GET /pos.json`
- `GET /dict/list`
- `GET /dict/<language>`
- `GET /wrd/<word_id>`
- `GET /defn/<definition_id>`
- `GET /defw/<definition_id>`
- `GET /api/json_dictionary?...`
- `GET /api/vw_json_dictionary?...`
- `GET /api/definitions?...`
- `GET /api/matview_inconsistent_definitions?limit=1000`
- `GET /api/convergent_translations?limit=1000`

### Write endpoints
- `PUT /dict/entry/<word_id>/edit`
- `PUT /defn/<definition_id>/edit`

## Known quirks to preserve until explicitly fixed

- `js/utils.js` uses synchronous XHR; Angular migration must consciously handle async conversion impacts.
- `word.js` `validateLanguage()` always returns `true`.
- `word.js` resets `new_definitions` to `[]` (array) after save despite being used as object map.
- `inconsistent_definitions.html` definition link uses `?id=` while `definition.js` expects `?defid=`.
- Some links are relative without leading slash (e.g., `word.html?...`) and should still resolve in current deployment layout.

## Phase 0 sign-off

- [ ] Route/query-param parity matrix reviewed.
- [ ] Endpoint inventory reviewed with backend owner.
- [ ] Baseline accepted before starting Angular workspace scaffold.
