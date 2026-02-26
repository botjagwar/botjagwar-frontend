# Phase 5 compatibility and rollout

This document captures the operational contract for serving the Angular SPA during migration while keeping legacy static pages available as a rollback path.

## Goals

- Serve Angular on `/ng/*` first.
- Keep legacy static pages at root by default.
- Add a reversible feature flag to test root deep links without removing legacy pages.

## Nginx behavior

All Nginx configs now include:

- `/ng/*` static SPA host from `ng-app/` build output.
- Root `location /` fallback controlled by `X-Botjagwar-Spa` request header.
  - Header omitted (default): no SPA root fallback, preserving legacy static behavior.
  - `X-Botjagwar-Spa: angular`: unresolved root paths fallback to `/ng/index.html`.

### Why header-based switching?

- Zero-downtime migration testing.
- Easy canary rollout with reverse proxy/load balancer header injection.
- Fast rollback by removing the header policy.

## Deploy steps

1. Build Angular app with `/ng/` base href and deploy bundle under `ng-app/`.
2. Reload Nginx with updated config.
3. Validate `/ng/*` route and query-param deep links.
4. Enable canary traffic by injecting `X-Botjagwar-Spa: angular` for selected users.
5. Promote globally after parity sign-off.

## Deep-link verification matrix

Validate both **with** and **without** the header:

- `/ng/`
- `/ng/search?term=foo`
- `/ng/dictionary?language=eng`
- `/ng/word?word=1`
- `/ng/definition?defid=1`
- `/ng/recent-changes`
- `/ng/inconsistent-definitions`
- `/ng/convergent-translations`

Also validate Angular legacy aliases under `/ng`:

- `/ng/index.html`
- `/ng/search.html?term=foo`
- `/ng/dictionary.html?language=eng`
- `/ng/word.html?word=1`
- `/ng/definition.html?defid=1`
- `/ng/recent_changes.html`
- `/ng/inconsistent_definitions.html`
- `/ng/convergent_translations.html`

## Rollback

- Remove canary header injection (or set a non-`angular` value).
- Root returns to legacy static pages only.
- `/ng/*` remains available for verification.
