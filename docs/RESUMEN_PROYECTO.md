# Colibrí Viajes — Resumen del proyecto

## 1. Cambios realizados

### 1.1 Migración Vue 2 → Vue 3

| Antes (Vue 2) | Después (Vue 3) |
|---|---|
| Webpack + vue-cli | Vite (dev server + build) |
| Options API (`data/methods/computed`) | Composition API `<script setup lang="ts">` |
| Mixins | Composables (`useLodging`, `useBooking`, `useForm`, `useModal`, `useCartItem`) |
| Stores propios / event-bus | Pinia + TypeScript (`authStore`, `cartStore`, `filtersStore`, `scrollStore`) |
| vee-validate v2 | vee-validate v4 + reglas en `utils/vee-validate-setup.ts` |
| Bootstrap-vue + jQuery | Bootstrap CSS solo (`bootstrap/dist/css` en `main.ts`) |
| v-calendar (Vue 2) | Inputs nativos `<input type="date">` |
| Moment.js | Day.js (alias `moment` → `src/utils/momentShim.js`) |
| ESLint 8 (.eslintrc.js) | ESLint 9 flat config (`eslint.config.js`) |
| JS plano | 40 archivos JS → TypeScript; 98 componentes a `<script setup>` |

- **Estados globales**: `src/stores/*` (Pinia) reemplazan los stores/event-bus previos; la sesión se restaura en `main.ts` con `getUser()` + `authStore.login()`.
- **Servicios**: `src/utils/lodgingSearchService.ts`, `searchPersistenceService.ts` (IndexedDB con `idb`), `roomBuilder.ts`, `accommodationValidator.ts`, `visitorTransformer.ts`.
- **Sintaxis corregida**: `.sync` → `v-model:`, `slot="x"` → `#x`, `@click.native` → `@click`, eventos `input` → `update:modelValue` (en GttInput/GttSelectDate).

### 1.2 Mejoras visuales / UX / accesibilidad
- Navbar fija con `position: fixed; z-index: 10` (`NavBar1.vue`), `box-sizing: border-box` global, `overflow-x: hidden`.
- Skip-link "Ir al contenido principal" + `#main-content` en `App.vue`.
- Contraste WCAG (color primario `#7fa300`), ARIA en selectores (combobox/listbox/aria-expanded), navegación por teclado (Enter/Espace/Escape).
- Diseño responsive: breakpoints 480 / 768 / 1024 px.
- Swiper 11 para carruseles (`IndexBanner`, `DestiniesCarousel`, `LodgingDetail`…).
- Toasts con `vue3-toastify` ("El servicio no está disponible en estos momentos", "Próximamente" en traslados/excursiones).
- Componentes reutilizables: `GttCarousel`, `GttSkeleton`, `GttEmptyState`, `GttErrorState`, `GttModal`, `GttInput`.

### 1.3 Calidad y limpieza
- Código muerto eliminado; dependencias sin uso removidas; v-calendar fuera del bundle.
- Cabeceras de seguridad en Vite (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) y CSP en `index.html`.
- Suite de pruebas Vitest + Vue Test Utils + jsdom (29 specs sobre stores, utils y composables).

## 2. Problemas pendientes del formulario de búsqueda de alojamientos

Al migrar los componentes Gtt* a Vue 3 quedaron bugs de sincronización y validación en `LodgingForm.vue`:

1. **`@click.native` ya no existe en Vue 3** → `loadDestinies()` nunca se ejecuta.
   - `LodgingForm.vue:40`: `<gtt-select @click.native="loadDestinies" …>`
   - Resultado: la lista de destinos no se carga al abrir el selector "Destino".
   - Mismo fallo en `RentForm.vue`, `GttEditRentModal.vue`, `GttEditLodgingModal.vue`, `LodgingDetail.vue`, `IndexLoggedBanner.vue`, `IndexLoggedRentSearch.vue` (15 usos).

2. **`v-model` roto en `gtt-select` y `gtt-select-form`** (usan prop `value` + evento `input`, patrón Vue 2).
   - `LodgingForm.vue:41` `v-model="selectedLodgingDestinyValue"` y `:97` `v-model="selectedRoomLayout"`.
   - En Vue 3 `v-model` enlaza `modelValue`/`update:modelValue`, que estos componentes no declaran → el valor seleccionado no llega al padre; `selectedLodgingDestinyValue` puede quedar `undefined` y romper el flujo de búsqueda (`activateModal` accede a `.type`/`.id`).

3. **`GttSelectDate` sí soporta `modelValue`** (API doble `value` + `modelValue`), por eso las fechas funcionan, pero mantiene código duplicado y `console.log` de depuración en `onMounted`.

4. **Validación rota**: `gttValidate()`/`renderValid()` dependían de `this.$refs`/`$children` (Vue 2).
   - `LodgingForm.vue:382` y `:502` llaman con `{ $el: null, $refs: {} }` → los mensajes `.gtt-errors` nunca se muestran y la validación falla en silencio.

5. **Código heredado inactivo** en `src/utils/validation.ts` (`Validator.length == 8` y `$children`, específico de Vue 2).

6. **Watcher de destino** en `LodgingForm.vue:298` deja un `console.info("watch", i)` de depuración.

## 3. Pendientes generales
- ~296 errores de typecheck pre-existentes en ~58 archivos (deuda de la migración TS).
- Migrar `App.vue` (único componente Options API restante) a `<script setup>`.
- Migrar a TypeScript los archivos JS restantes: `useBooking.js`, `momentShim.js`.
- Limpiar `package.json` (`v-calendar` sin uso) y `index.html`/`public/` (jquery 3.4.1, bootstrap.bundle.min.js, slick-master, owlcarousel, MDI duplicados).
- `origin/main` (yuniertilan1) queda 8 commits detrás de `main` local.
- Revocar token de GitHub que quedó filtrado en una URL de remote durante la migración (acción del propietario).