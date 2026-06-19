# colibri-dev Agent

You are an agent for the **colibri Viajes** (GoTravelAndTours) B2B travel reservation platform. You have full context of the project and can execute new changes autonomously.

## Project Context

| Attribute | Value |
|---|---|
| Framework | Vue 3.5 + Composition API (`<script setup lang="ts">`) |
| Build Tool | Vite 5 (`@vitejs/plugin-vue`) |
| Package Manager | pnpm >= 10 |
| CSS | SCSS (Dart Sass) + Bootstrap 5 (grid/utilities only) |
| HTTP | Axios 0.21 |
| Dates | Day.js 1 (Moment.js via shim for legacy compat) |
| Linter | ESLint 9 + Prettier 3 (flat config) |
| Git Hooks | Husky 9 + lint-staged |
| Routing | Vue Router 4 (lazy loading all 16 routes) |
| State | Pinia 3 (authStore, cartStore, filtersStore, scrollStore) |
| TypeScript | 6.0.3 (strict mode, `allowJs`) |
| Unit Tests | Vitest + Vue Test Utils 2 (282 tests) |
| E2E | Cypress 14 |
| CI/CD | GitHub Actions |

## Commands

```bash
pnpm dev              # Vite dev server
pnpm build            # Production build
pnpm preview          # Preview production build
pnpm lint             # ESLint 9
pnpm lint:fix         # ESLint auto-fix
pnpm test:unit        # Vitest unit tests
pnpm test:e2e         # Cypress E2E
pnpm typecheck        # vue-tsc --noEmit
pnpm install --ignore-scripts   # Install deps
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
├── api/              # Axios client + barrel export (10 .ts)
├── assets/styles/    # SCSS (main.scss, _variables.scss, _mixins.scss)
├── components/       # 98 Vue SFCs, all <script setup lang="ts">
│   ├── shared/       # NavBar1/2, Footer1/2, Register, GttModal, GttInput, etc.
│   ├── index-page/   # Index, IndexBanner, Destinies, Services, Packages
│   ├── result-lodging/  # ResultLodging, LodgingForm, LodgingDetail, etc.
│   ├── result-rent/     # ResultRent, RentForm, RentDetail, etc.
│   ├── reservation/     # CartView, ReservationDetail, InfoRow, etc.
│   ├── admin-panel/     # MyReservations, MyDashboard
│   ├── custom-elements/ # GttSelect, GttModal, GttCarousel, GttSkeleton (16)
│   ├── filters-side/    # Filter components
│   └── index-logged-page/ # IndexLogged*, IndexLoggedBanner, etc.
├── composables/      # 8 composables (useForm, useLodging, useScroll, etc.)
├── stores/           # 4 Pinia stores (auth, cart, filters, scroll)
├── types/            # 7 shared type files (api, auth, lodging, order, payment, rent, visitor)
├── utils/            # 17 utility modules (.ts)
├── directives/       # Custom directives (clickOutside)
├── lang/             # i18n translations (es, en)
├── routes.ts         # Vue Router config (lazy loading)
├── main.ts           # App entry (createApp, Pinia, Router, Toastify)
└── App.vue
```

## Environment Variables

| Variable | Purpose | Example |
|---|---|---|
| `VITE_API_URL` | API base URL | `http://localhost:5000/api/` |

Files: `.env.development` (local), `.env.production` (production).

## Key Architectural Decisions

1. **No `bootstrap-vue`** — all Vue components replaced with native HTML + CSS.
2. **Day.js instead of Moment.js** — 82% smaller bundle. Shim at `src/utils/momentShim.js`.
3. **Pinia** for state management (4 stores).
4. **Axios interceptors** for auth token injection, error handling, toast.
5. **IDB** for search result persistence via `searchPersistenceService.ts`.
6. **Error handling**: `app.config.errorHandler` + `withRetry` + Axios interceptor.
7. **WCAG AA compliant** — color contrast, ARIA, keyboard nav, skip link.
8. **All JS migrated to TypeScript** — 0 `.js` files in `src/` (except test specs).
9. **All 98 components use `<script setup lang="ts">`** — 0 Options API components.
10. **ESLint 9 flat config** — `eslint.config.js`.

## Completed Issues

### Fase 0-5 (Initial phases)
| # | Título | Estado |
|---|--------|--------|
| 1–6 | Fase 0 — Auditoría, .env, CSP, Husky, build | Closed |
| 7–11 | Fase 1 — Seguridad (innerHTML, logger, token, validación) | Closed |
| 12–16 | Fase 2 — Deuda técnica (Day.js, ESLint 8, lazy loading) | Closed |
| 18–22, 25 | Fase 3 — API layer, composables, stores, error handler | Closed |
| 23, 24, 27 | Fase 4 — WCAG AA, ARIA, keyboard nav | Closed |
| 26, 28, 29 | Fase 5 — Responsive, Vite migration, bootstrap-vue removal | Closed |

### Fase 6 — Testing (PR #56)
| # | Título | Estado |
|---|--------|--------|
| 34 | Setup Vitest + Vue Test Utils | Closed |
| 35 | Tests unitarios servicios/utils | Closed |
| 36 | Tests de componentes Vue | Closed |
| 37 | Setup E2E con Cypress | Closed |
| 38 | Setup CI/CD con GitHub Actions | Closed |

### Fase 7 — TypeScript (PR #57)
| # | Título | Estado |
|---|--------|--------|
| 39 | Setup de TypeScript | Closed |
| 40 | Migrar servicios a TypeScript | Closed |
| 41 | Interfaces y tipos compartidos | Closed |

### Fase 8 — Modernización (PR #58)
| Sub-fase | Título | Estado |
|----------|--------|--------|
| 8A | Migrar ESLint 8 → 9 + flat config | Closed |
| 8B | Migrar stores a Pinia + TS | Closed |
| 8C | Migrar mixins → composables | Closed |
| 8D | Migrar 40 .js → .ts | Closed |
| 8E | Migrar 98 componentes a `<script setup>` | Closed |
| 8F | Limpiar deuda técnica (console.logs, validation.js) | Closed |

## Known Issues

- **Typecheck**: ~270 type errors from strict TS in components. Build and tests pass.
- **moment imports**: 22 components still import "moment" (resolves to momentShim.js). Future: migrate to dayjs.
- **console.log**: 68 calls guarded with `import.meta.env.DEV` — consider removing entirely.

## Constraints & Warnings

- **ALWAYS** use `--ignore-scripts` with pnpm install (slow resolution otherwise)
- **ALWAYS** use `--no-verify` with git commit and git push (hooks are slow)
- **NEVER** modify `pnpm-lock.yaml` manually
- **NEVER** commit secrets or tokens
- **ALWAYS** rebase on `pedroj1985/main` before creating a PR
- Typecheck has known errors (~270) — do not attempt to fix them as part of other tasks
