# colibri Viajes

Plataforma B2B de reservas de alojamiento, renta de autos, excursiones y traslados turísticos.

## Stack Tecnológico

| Tecnología | Versión |
|---|---|
| Vue | 2.7 (Composition API via `@vue/composition-api`) |
| Vite | 5 |
| Vue Router | 3 |
| Axios | 0.21 |
| Day.js | 1 (reemplazo de Moment.js) |
| Bootstrap | 5 (solo CSS grid/utilities) |
| SCSS | Dart Sass |
| ESLint | 8 + prettier |
| Husky | 9 + lint-staged |

## Prerrequisitos

- Node.js >= 18
- pnpm >= 10 (instalar con `npm i -g pnpm`)

## Instalación

```bash
pnpm install --ignore-scripts
```

> `--ignore-scripts` evita la ejecución de scripts postinstall (el lockfile tiene ~1350 dependencias y la resolución es lenta).

## Comandos

| Comando | Descripción |
|---|---|
| `pnpm dev` | Inicia servidor de desarrollo (Vite) |
| `pnpm build` | Compila para producción |
| `pnpm preview` | Previsualiza build local |
| `pnpm lint` | Ejecuta ESLint |
| `pnpm lint:fix` | Corrige errores ESLint |

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `https://admin.gotravelandtours.com/publicEliecer/api/` |

Archivos: `.env.development` (desarrollo), `.env.production` (producción). Para usar un API local durante desarrollo, crear `.env.development.local` (ignorado por git) con `VITE_API_URL=http://localhost:5000/api/`.

## Estructura

```
src/
├── api/            # Capa HTTP (client.js, barrel export)
├── assets/         # SCSS global, imágenes, iconos
├── components/     # Componentes Vue (shared, index-page, result-lodging, etc.)
├── composables/    # Lógica reutilizable (useForm, useLodging, etc.)
├── mixins/         # Mixins legacy (deprecated, migrar a composables)
├── stores/         # Estado reactivo (authStore, cartStore, etc.)
├── utils/          # Utilidades (logger, errorHandler, helpers, etc.)
├── routes.js       # Configuración de rutas (lazy loading 16/16)
├── App.vue
└── main.js
```

## Migraciones

- Vue CLI (webpack) → **Vite 5** (#28)
- Moment.js → **Day.js** (#12)
- bootstrap-vue → **HTML nativo + CSS** (#29)
- Mixins → **Composition API / composables** (#19)

## Licencia

Propietario - Colibri Viajes
