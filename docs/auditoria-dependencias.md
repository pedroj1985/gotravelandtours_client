# Auditoría de Dependencias

**Fecha:** 2026-05-29
**Proyecto:** gotravelandtours_client (Vue 2.6.12)
**Package Manager:** pnpm@10.16.1

## Resumen

| Categoría | Cantidad |
|-----------|----------|
| Dependencias totales | 1,332 (134 prod / 1,199 dev) |
| Vulnerabilidades bajas | 9 |
| Vulnerabilidades medias | 71 |
| Vulnerabilidades altas | 60 |
| Vulnerabilidades críticas | 18 |
| **Total vulnerabilidades** | **158** |

## Vulnerabilidades Críticas

| Paquete | CVE/CWE | Descripción | Ruta |
|---------|---------|-------------|------|
| `shell-quote` | CWE-77 (CVSS 9.8) | RCE en parsing de comandos | Transitiva |
| `sha.js` | CWE-20 (CVSS 9.1) | Hash rewind, datos manipulados | Transitiva |
| `url-parse` | CWE-639 (CVSS 9.1) | Authorization bypass | Transitiva |
| `pbkdf2` | CWE-20 | Memoria predecible/zero-filled | Transitiva |
| `request` | CWE-918 (SSRF) | Deprecado, arrastra 3 sub-vulns | Transitiva via @vue/cli-shared-utils |
| `ejs` | Template injection | RCE via render | Transitiva via webpack-bundle-analyzer |
| `webpack-bundle-analyzer` | vía ejs | Sin fix disponible | Transitiva |

## Dependencias desactualizadas (directas)

| Paquete | Versión actual | Última | Breaking? | Reemplazo propuesto |
|---------|---------------|--------|-----------|---------------------|
| `vue` | 2.7.16 | 3.5.35 | **SÍ** | Toda la Fase 5 |
| `vee-validate` | 2.2.15 | 4.15.1 | **SÍ** | API completamente nueva |
| `vue-router` | 3.6.5 | 5.1.0 | **SÍ** | createRouter API |
| `vue-resource` | 1.5.2 | deprecated | **SÍ** | axios (ya instalado) |
| `moment` | 2.27.0 | deprecated | **SÍ** | dayjs o Intl |
| `axios` | 0.21.4 | 1.16.1 | **SÍ** | Migrar a v1 (interceptors API) |
| `v-calendar` | 1.1.1 | 2.4.2 | **SÍ** | API v2 completamente diferente |
| `eslint` | 7.32.0 | 10.4.0 | **SÍ** | Flat config + plugins nuevos |
| `@vue/cli-service` | 4.5.19 | 5.0.9 | **SÍ** | Vite recomendado en Fase 5 |
| `@vue/cli-plugin-babel` | 4.5.19 | 5.0.9 | **SÍ** | Vite recomendado |
| `prettier` | 1.19.1 | 3.8.3 | **SÍ** | Opciones de config cambiadas |
| `sass-loader` | 10.5.2 | 17.0.0 | **SÍ** | Webpack 5+ |
| `vue-multiselect` | 2.1.9 | 3.5.0 | **SÍ** | Vue 3 support |
| `vue-lazyload` | 1.3.5 | 3.0.0 | **SÍ** | Vue 3 plugin |
| `vue-axios` | 2.1.5 | 3.5.2 | **SÍ** | Vue 3 plugin |
| `uuid` | 8.3.2 | 14.0.0 | **SÍ** | Crypto.randomUUID() |
| `fslightbox-vue` | 1.2.0 | 3.0.3 | **SÍ** | Vue 3 wrapper |
| `vue-notification-bell` | 0.8.15 | 0.9.12 | Posible | Verificar compatibilidad |
| `lodash` | 4.17.23 | 4.18.1 | No | Patch segura |
| `sass` | 1.98.0 | 1.100.0 | No | Compatible |
| `chokidar` | 3.6.0 | 5.0.0 | **SÍ** | ESM only |
| `@babel/eslint-parser` | 7.28.6 | 7.29.7 | No | Patch |
| `@vue/eslint-config-prettier` | 6.0.0 | 10.2.0 | **SÍ** | ESLint 9+ |
| `eslint-plugin-prettier` | 3.4.1 | 5.5.6 | **SÍ** | ESLint 9+ |
| `eslint-plugin-vue` | 6.2.2 | 10.9.1 | **SÍ** | Vue 3 rules |

## Dependencias deprecated / sin mantener

| Paquete | Estado | Motivo |
|---------|--------|--------|
| `vue-resource` | Deprecated oficial | Reemplazar por axios (ya instalado) |
| `moment` | Deprecated (2020) | Usar dayjs (2kB) o Intl API |
| `vee-validate` v2 | Sin soporte Vue 3 | Migrar a v4 |
| `eslint` 7 | EOL (2022) | Migrar a 8+ o 9+ |
| `vue-slick-carousel` | Sin Vue 3 support | Reemplazar por swiper/vue |
| `vue-image-lightbox` | Sin Vue 3 support | Usar lightgallery o medium-zoom |
| `@alfsnd/vue-bootstrap-select` | No actualizado | Bootstrap 5 nativo |
| `bootstrap-vue` | No compatible Vue 3 | Bootstrap 5 nativo + componentes propios |
| `vue-click-outside` | No actualizado | Composable directo |
| `vue-notification-bell` | Vulnerabilidad alta | Crear componente propio |
| `vue-toasted` | No actualizado | vue-sonner o componente propio |

## Grupo por prioridad

### Prioridad Alta (Fase actual)
- `vue-resource` → eliminar, usar axios
- `moment` → reemplazar por dayjs
- Axios 0.x → 1.x (API de interceptors cambia)
- Actualizar `uuid` (vuln moderada directa)

### Prioridad Media (Fase 2 - Deuda Técnica)
- ESLint 7 → 8/9
- Prettier 1.x → 3.x
- sass-loader 10 → 17
- vue-slick-carousel → swiper
- vue-image-lightbox → alternativa
- vue-toasted → alternativa

### Prioridad Baja (Fase 5 - Vue 3)
- Vue 2 → 3
- Vue Router 3 → 4
- vee-validate 2 → 4
- v-calendar 1 → 2
- vue-multiselect 2 → 3
- vue-lazyload 1 → 3
- bootstrap-vue → Bootstrap 5 nativo

## Acciones inmediatas (Fase 0)

1. Reemplazar `moment` por `dayjs` (véase tarea Fase 2.1)
2. Eliminar `vue-resource` (véase tarea Fase 2.2)
3. Actualizar `uuid` a versión segura
4. Documentar que el resto de actualizaciones requieren migración a Vue 3 primero
