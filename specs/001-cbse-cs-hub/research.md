# Research: CBSE CS Hub

**Feature**: 001-cbse-cs-hub  
**Date**: 2026-04-28  
**Status**: Complete — all NEEDS CLARIFICATION resolved

---

## Decision 1 — Angular Version

- **Decision**: Angular 21.2.x (latest stable as of April 2026)
- **Rationale**: Angular 21 is the current stable major release with full Signals support, standalone-first architecture, and active LTS. Using latest stable ensures best performance primitives (Signals, defer, zoneless) and full compatibility with all required packages.
- **Alternatives considered**: Angular 19 (too old, missing latest Signals improvements), Angular 22 RC (not yet stable)
- **TypeScript version**: 5.9.x (peer requirement of Angular 21)

---

## Decision 2 — CSS / Styling Strategy

- **Decision**: Tailwind CSS 4.2.x with PostCSS plugin (`@tailwindcss/postcss`)
- **Rationale**: Tailwind v4 uses a PostCSS-first approach (no `tailwind.config.js` required). It integrates cleanly with Angular's build pipeline via `.postcssrc.json`. Provides utility-first classes that are ideal for a mobile-first card-based UI without writing custom CSS components for common patterns. Dark mode via `class` strategy (toggle class on `<html>`).
- **Alternatives considered**: Angular Material (heavier, less design control), pure SCSS (more verbose, slower iteration), Tailwind v3 (deprecated approach with config file)
- **Setup steps**:
  1. `npm install tailwindcss @tailwindcss/postcss postcss`
  2. Create `.postcssrc.json` with `@tailwindcss/postcss` plugin
  3. Add `@import "tailwindcss";` to `src/styles.css`

---

## Decision 3 — GitHub Pages Deployment

- **Decision**: `angular-cli-ghpages` v3.0.3 via `ng add angular-cli-ghpages`
- **Rationale**: Official community standard for Angular → GitHub Pages. Handles `gh-pages` branch creation, `404.html` fallback for Angular Router, and `.nojekyll` file automatically. Deploy command: `ng deploy --base-href=/CBSE_CS_HUB/`
- **Alternatives considered**: Manual GitHub Actions workflow (more setup, same result), Netlify/Vercel (free but not GitHub Pages as required)
- **Base href note**: Must match GitHub repository name exactly. Since the repo is `CBSE_CS_HUB`, base href = `/CBSE_CS_HUB/`

---

## Decision 4 — Angular Router Strategy

- **Decision**: Standalone component routing with lazy-loaded `loadComponent()` per feature route
- **Rationale**: Angular 21 standalone components eliminate NgModules. `loadComponent()` lazy-loading ensures initial bundle is small (< 500KB target from NFR-001). Each feature module loads its content JSON only when the route activates.
- **Alternatives considered**: NgModule-based lazy routes (deprecated pattern in Angular 17+), eager loading (would violate NFR-001 bundle size)

---

## Decision 5 — State Management / Reactivity

- **Decision**: Angular Signals + `effect()` for localStorage synchronisation. No separate state management library.
- **Rationale**: The platform has no cross-component async data flow requiring RxJS streams. All state is either (a) content loaded once from JSON or (b) localStorage-persisted user state. Signals with `effect()` provide the exact pattern Angular docs recommend for localStorage sync — reactive, computed, no boilerplate.
- **Pattern**: Private `WritableSignal` in `@Injectable({ providedIn: 'root' })` services; `effect()` in constructor syncs signal → localStorage; public `readonly` signal exposed to components.
- **Alternatives considered**: RxJS BehaviorSubject (verbose for simple key-value state), NgRx (massive overkill for a localStorage-only app), Akita/Elf (unnecessary third-party dependency)

---

## Decision 6 — Content Architecture

- **Decision**: Lazy-loaded JSON files under `src/assets/content/` fetched via Angular's `HttpClient` (using `provideHttpClient(withFetch())`)
- **Rationale**: Content as assets allows GitHub Pages to serve JSON files statically. Lazy-loading per feature route (fetch JSON only when user visits that module) satisfies NFR-001 and Risk 4 (mobile performance on slow connections). No bundling of content into JS.
- **File layout**: One JSON file per SQL category, one per Python topic, one index JSON per class for study notes, individual chapter JSON files.
- **Alternatives considered**: Inlining content in TypeScript constants (destroys maintainability, violates NFR-006), single large JSON file (violates lazy-loading strategy)

---

## Decision 7 — PWA / Offline Support

- **Decision**: `@angular/pwa` v21.2.8 via `ng add @angular/pwa`
- **Rationale**: Satisfies SC-009 (offline after first visit) and NFR-003. Angular's service worker caches the app shell and all content JSON assets on first visit. Configuration in `ngsw-config.json` explicitly lists `/assets/content/**` for pre-caching.
- **Alternatives considered**: Workbox directly (more config, same outcome), no PWA (fails SC-009)

---

## Decision 8 — Search Architecture

- **Decision**: Client-side search using a lightweight index built at app startup — iterate over all loaded content (notes index, SQL questions, Python exercises) with JavaScript `String.prototype.includes()` / case-insensitive regex against pre-loaded indices.
- **Rationale**: No backend, no index server needed. A search index loaded from a flat `search-index.json` (generated manually or scripted at content-authoring time) provides O(n) search across all titles and tags. SC-006 target (< 1 second) is easily achievable with < 500 items client-side.
- **Alternatives considered**: Fuse.js fuzzy search (acceptable but adds a dependency), Lunr.js (heavier, overkill for this data size), Pagefind (static site search, excellent option for future but requires build-time generation)

---

## Decision 9 — Theming

- **Decision**: Tailwind dark mode via `class` strategy — toggle `dark` class on `<html>`. Theme preference persisted to `localStorage` key `cbse-theme`. `ThemeService` uses Angular Signal to reactively apply the class.
- **Rationale**: Tailwind's class-based dark mode (`dark:bg-gray-900` etc.) is the simplest and most reliable approach. No runtime CSS variable injection needed. Works correctly before Angular bootstrap (can set class from `localStorage` in `index.html` `<script>` to avoid flash of wrong theme).
- **Alternatives considered**: CSS custom properties swap (works but Tailwind dark: classes don't participate), Angular Material theming (tied to Material components)

---

## Decision 10 — Testing

- **Decision**: Jasmine + Karma for unit tests (Angular CLI default). Focus on service-layer tests (storage, search, progress). No end-to-end tests for v1.
- **Rationale**: Core business logic lives in services (localStorage read/write, search, progress calculation). These are pure functions / simple signal updates — ideal for unit tests. Component tests add little value for a content-display app.
- **Alternatives considered**: Jest (requires Angular Jest preset setup, not worth added config for simple services), Playwright E2E (good for future, out of v1 scope)
