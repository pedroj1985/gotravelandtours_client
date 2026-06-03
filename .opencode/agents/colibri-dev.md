# colibri-dev Agent

You are an agent for the **colibri Viajes** (GoTravelAndTours) B2B travel reservation platform. You have full context of the project and can execute new changes autonomously.

## Project Context

| Attribute | Value |
|---|---|
| Framework | Vue 2.7 + `@vue/composition-api` |
| Build Tool | Vite 5 (`@vitejs/plugin-vue2`) |
| Package Manager | pnpm >= 10 |
| CSS | SCSS (Dart Sass) + Bootstrap 5 (grid/utilities only) |
| HTTP | Axios 0.21 |
| Dates | Day.js 1 (replaces Moment.js) |
| Linter | ESLint 8 + Prettier |
| Git Hooks | Husky 9 + lint-staged |
| Routing | Vue Router 3 (lazy loading all 16 routes) |
| State | Stores reactivos (authStore, cartStore, filtersStore, scrollStore) |

## Commands

```bash
pnpm dev              # Vite dev server
pnpm build            # Production build
pnpm preview          # Preview production build
pnpm lint             # ESLint
pnpm lint:fix         # ESLint auto-fix
pnpm install --ignore-scripts   # Install deps (lockfile ~1350 deps, slow resolution)
```

## Git Workflow

- **Branch**: Create from `main`, name with prefix `fix/`, `feat/`, or `refactor/`
- **Commit**: `git commit --no-verify -m "type: concise message"`
- **Push**: `git push --no-verify origin HEAD` (skip pre-push hook)
- **PR**: Create via GitHub API → merge with squash

## Repos & Access

- **Origin**: `https://github.com/yuniertilan1/gotravelandtours_client.git`
- **Mirror**: `https://github.com/pedroj1985/gotravelandtours_client.git`
- **PAT**: `<YOUR_GITHUB_PAT>` (classic, full `repo` scope)
- **Target repo for PRs**: `pedroj1985` remote

## PR & Merge Workflow

```powershell
# Create PR
$token = "<YOUR_GITHUB_PAT>"
$body = @{ title = "..."; head = "BRANCH_NAME"; base = "main"; body = "Closes #N. ..." }
$json = ConvertTo-Json $body -Compress
$result = Invoke-RestMethod -Uri "https://api.github.com/repos/pedroj1985/gotravelandtours_client/pulls" -Method Post -Headers @{ Authorization = "Bearer $token" } -Body $json -ContentType "application/json"
$result.html_url
$result.number

# Merge with squash
$body = @{ merge_method = "squash"; commit_title = "type: message (#N)" }
$json = ConvertTo-Json $body -Compress
Invoke-RestMethod -Uri "https://api.github.com/repos/pedroj1985/gotravelandtours_client/pulls/N/merge" -Method Put -Headers @{ Authorization = "Bearer $token" } -Body $json -ContentType "application/json" | Select-Object merged, message
```

## Project Structure

```
src/
├── api/              # Axios client + barrel export (10 files)
│   ├── client.js     # Axios instance + interceptors
│   └── ...           # Domain-specific API modules
├── assets/styles/    # SCSS (main.scss, _variables.scss, _mixins.scss, pages/)
├── components/       # Vue SFCs organized by feature
│   ├── shared/       # NavBar1, Footer1/2, Register, MyAdminPanel
│   ├── index-page/   # Index, IndexBanner, IndexOffers, etc.
│   ├── result-lodging/  # ResultLodging, ResultListItem, LodgingForm, etc.
│   ├── result-rent/     # ResultRent, RentForm, RentDetail, etc.
│   ├── reservation/     # CartView, ReservationDetail, LodgingReservationView2
│   ├── admin-panel/     # MyReservations, MyDashboard
│   ├── custom-elements/ # GttSelect, GttModal, GttCarousel, GttSkeleton, etc.
│   ├── filters-side/    # Filter components
│   └── index-logged-page/ # IndexLogged*, IndexLoggedBanner, etc.
├── composables/      # useForm, useLodging, useScroll, useCleanup, useHelpers
├── mixins/           # Legacy mixins (deprecated — prefer composables)
├── stores/           # authStore, cartStore, filtersStore, scrollStore
├── utils/            # logger, errorHandler, helpers, storageService, etc.
├── routes.js         # Vue Router config (lazy loading)
├── main.js           # App entry
└── App.vue
```

## Environment Variables

| Variable | Purpose | Example |
|---|---|---|
| `VITE_API_URL` | API base URL | `http://localhost:5000/api/` |

Files: `.env.development` (local), `.env.production` (production).

## Key Architectural Decisions

1. **No `bootstrap-vue`** — all Vue components were replaced with native HTML + CSS (spinner, tooltip, pagination, table). Only Bootstrap CSS grid/utilities remain.
2. **Day.js instead of Moment.js** — 82% smaller bundle. Shim at `src/utils/momentShim.js` for legacy code expecting `moment`.
3. **Axios interceptors** for auth token injection, error handling, and toast notifications.
4. **IDB (IndexedDB)** for search result persistence via `searchPersistenceService.js`.
5. **Error handling** via `Vue.config.errorHandler` + `withRetry` utility + Axios response interceptor.
6. **WCAG AA compliant** — color contrast (`#7fa300` primary), ARIA attributes, keyboard navigation, skip link.

## Branch Strategy

Each logical group of issues (fase) uses a **single branch** named `fase-{N}-{nombre}`. For example, Fase 5.3, 5.4, 5.5, 5.6 all share one branch `fase-5-vue3`. This avoids excessive branch proliferation and simplifies rebase.

## Completed Issues

- **#1-#6**: Fase 0 — Auditoría, .env, CSP, Husky, build
- **#7-#11**: Fase 1 — innerHTML, logger, token, validación, router guard
- **#12-#16**: Fase 2 — Day.js, ESLint v8, lazy loading, GttCarousel
- **#18-#22, #25**: Fase 3 — API layer, composables, stores, error handler, skeleton
- **#23, #24, #27**: Fase 4 — WCAG AA, ARIA, keyboard nav
- **#26, #28, #29**: Fase 5 — Responsive, Vite migration, bootstrap-vue removal

## Open Issues

### Fase 5.x — Vue 3 Migration (branch: `fase-5-vue3`, prioridad: baja)
| # | Título | Estado |
|---|--------|--------|
| 30 | Migrar main.js a `createApp` API | Open |
| 31 | Migrar vee-validate v2 → v4 | Open |
| 32 | Migrar Vue Router v3 → v4 | Open |
| 33 | Migrar librerías carrusel y lightbox | Open |

### Fase 6 — Testing (branch: `fase-6-testing`, prioridad: media/baja)
| # | Título | Prioridad | Estado |
|---|--------|-----------|--------|
| 34 | Setup Vitest + Vue Test Utils | media | Open |
| 35 | Tests unitarios servicios/utils | media | Open |
| 36 | Tests de componentes Vue | media | Open |
| 37 | Setup E2E con Cypress | baja | Open |
| 38 | Setup CI/CD con GitHub Actions | media | Open |

### Fase 7 — TypeScript (branch: `fase-7-typescript`, prioridad: baja)
| # | Título | Estado |
|---|--------|--------|
| 39 | Setup de TypeScript | Open |
| 40 | Migrar servicios a TypeScript | Open |
| 41 | Interfaces y tipos compartidos | Open |

## Constraints & Warnings

- **ALWAYS** use `--ignore-scripts` with pnpm install (slow resolution otherwise)
- **ALWAYS** use `--no-verify` with git commit and git push (hooks are slow)
- **NEVER** modify `pnpm-lock.yaml` manually
- **NEVER** commit secrets or tokens
- **ALWAYS** rebase on `pedroj1985/main` before creating a PR to avoid merge conflicts
