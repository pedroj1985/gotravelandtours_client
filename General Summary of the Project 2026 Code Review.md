# Informe de Análisis del Proyecto gotravelandtours_client

## 1. Resumen Ejecutivo

El proyecto es un frontend B2B para TourOperadores desarrollado con Vue 2.6.12 + Vue CLI 4, dirigido al mercado cubano (alojamiento, renta de autos, traslados, etc.). Está en un estado funcional pero técnicamente obsoleto:

- Vue 2 con Options API, mixins y event buses como patrón de comunicación
- Sin TypeScript, sin pruebas unitarias/E2E, sin store centralizado (Vuex/Pinia)
- Dependencias severamente desactualizadas (Vue Resource, vee-validate v2, Moment.js, ESLint 7)
- Hardcoded API keys expuestas en el código fuente
- Uso de innerHTML para renderizar errores de validación (XSS potencial)
- No hay separación de capas backend-frontend (todo el API client está en auth.js)

## 2. Análisis por Rol

### 2.1 Arquitectura de Software

**Problemas detectados:**

| Problema | Ubicación | Descripción |
|----------|-----------|--------------|
| Capa API monolítica | `src/utils/auth.js` (421 líneas) | Todas las llamadas API (login, búsqueda, reservas, pagos, hotetec, QuickBooks) viven en un mismo archivo sin separación por dominio |
| Sin separación de responsabilidades | `src/utils/lodgingSearchService.js` | Mezcla lógica de negocio (cálculo de combinaciones de habitaciones) con persistencia (IndexedDB) y llamadas HTTP |
| Event Bus como patrón de comunicación | `src/main.js:117-124` | Uso de 6 `new Vue()` como buses de eventos globales sin tipado ni trazabilidad |
| Mixins en lugar de composición | `src/mixins/` (5 archivos) | Patrón Vue 2 mixins que causan colisiones de nombres y dificultan el testing |
| Sin store de estado | No hay Vuex/Pinia | El estado se maneja via `localStorage` directo y event buses |
| Sin TypeScript | `jsconfig.json` en lugar de `tsconfig.json` | Sin tipado estático, todo es propenso a errores runtime |
| Sin lazy loading en rutas | `src/routes.js` | Todas las rutas importan componentes estáticamente |
| Caché manual con IndexedDB | `src/utils/lodgingSearchService.js:19-25` | Implementación casera sin abstracción |

**Mejoras propuestas:**

- Migrar a Vue 3 + Composition API + Pinia como store
- Implementar patrón repositorio: separar `api/`, `repository/` y `services/`
- Agregar lazy loading en rutas (`import()` dinámico)
- Reemplazar event buses por eventos nativos o Pinia actions
- Extraer lógica de negocio (`roomBuilder.js`, `accommodationValidator.js`) a servicios puros
- Adoptar TypeScript progresivamente

**Escalabilidad:** Baja. Sin modularización ni tipado, el proyecto escalará en deuda técnica exponencialmente.

### 2.2 Seguridad del Software

**Vulnerabilidades encontradas:**

| Severidad | Hallazgo | Ubicación | Evidencia |
|-----------|----------|-----------|------------|
| 🔴 CRÍTICO | Hardcoded API URL con IP pública | `src/utils/auth.js:7` | `baseURL: "http://gottours-001-site4.mtempurl.com/publicEliecer/api/"` - URL hardcodeada con subdirectorio expuesto |
| 🔴 CRÍTICO | Hardcoded producción API URL | `vue.config.js:2` | `process.env.VUE_APP_API_URL = "https://myprodlink.com"` - Dominio de producción hardcodeado |
| 🔴 CRÍTICO | `innerHTML` sin sanitizar | `src/utils/validation.js:150-156` | `ref.querySelector(".gtt-errors").innerHTML += item + "<br>"` - XSS si un mensaje contiene HTML |
| 🟠 ALTO | Token en localStorage | `src/utils/auth.js:13`, `src/utils/storageService.js:111` | JWT almacenado en `localStorage` (vulnerable a XSS) - debería ir en cookie HttpOnly |
| 🟠 ALTO | Datos sensibles en localStorage | `auth.js:28` | `localStorage.getItem("usuarioObjeto")` - objeto completo del usuario en texto plano |
| 🟠 ALTO | CORS laxo | No se encontró configuración CORS específica | El frontend se conecta a un endpoint con IP pública sin validación de origen aparente |
| 🟡 MEDIO | Headers de seguridad ausentes | Falta configuración CSP, Helmet | No hay headers de seguridad configurados (CSP, X-Frame-Options, etc.) |
| 🟡 MEDIO | Logs sensibles | Múltiples archivos | `console.log(searchItem)`, `console.log(resp)`, `console.log(data)` - datos de usuarios y búsquedas expuestos en consola |
| 🟡 MEDIO | Sin rate limiting | No implementado | El endpoint de login (`/Login`) no tiene protección contra fuerza bruta |
| 🟡 MEDIO | Formulario de login sin HTTPS forzado | - | No hay verificación de que las peticiones se hagan sobre HTTPS |
| 🟢 BAJO | Comentarios con URLs internas | `src/utils/auth.js:20` | URL de admin panel comentada: `https://admin.gotravelandtours.com/#/dasboard/admin` |

**Malas prácticas adicionales:**

```javascript
// src/utils/auth.js:28 - Objeto de usuario parseado sin validación
export function getUser() {
  let storageUser = JSON.parse(localStorage.getItem("usuarioObjeto"));
  return storageUser;  // Podria ser cualquier cosa
}

// src/utils/auth.js:399-406 - Header global mutable
export function updateHeader(token) {
  headers = {
    ...headers,
    Authorization: `Bearer ${token}`
  };
}

```

Recomendaciones:

Migrar autenticación a cookies HttpOnly + Secure + SameSite en lugar de localStorage

Implementar CSP via Helmet o meta tags

Eliminar/centralizar console.logs (usar logger condicional)

Reemplazar innerHTML con textContent o slots de Vue

Usar variables de entorno .env reales en lugar de vue.config.js hardcodeado

Agregar rate limiting (API gateway o middleware)

OWASP Top 10 scan periódico

2.3 Frontend (Vue.js)
Problemas detectados:

Problema	Ubicación	Detalle
Vue 2 + vue-cli 4 (EOL)	package.json:26,48-49	Vue 2.6.12 (end of life desde dic 2023), CLI 4 (EOL 2022)
vue-resource deprecated	package.json:35	Reemplazado oficialmente por Axios, pero aún importado en main.js:3
vee-validate v2 deprecated	package.json:25	v2.2.15 - sin soporte, incompatible con Vue 3
Moment.js deprecated	package.json:22	Proyecto recomienda reemplazar por date-fns o Day.js
Options API + mixins	src/mixins/	5 mixins que causan acoplamiento
Componentes sin manejo de errores	src/components/result-lodging/ResultLodging.vue:123-158	created() async que no captura errores de authGetRoomTypes
Fuga de memoria	src/components/shared/NavBar2.vue:51	EventBus listener en created() sin $off en beforeDestroy()
v-html no encontrado	No se usa v-html directamente, pero	innerHTML en validation.js:156 es más peligroso
Sin lazy loading	src/routes.js	18 componentes importados estáticamente al inicio
CSS no scoped con estilos globales	src/assets/styles/	SCSS global sin namespacing
Componentes monolíticos	src/components/custom-elements/GttSelect.vue (457 líneas)	Demasiada responsabilidad en un solo componente
Uso incorrecto de reactividad:

// src/mixins/formMixin.js:10-14
setFieldError(field, message) {
  this.$set(this.formErrors, field, message);  // Vue 2 workaround
}

// src/components/result-lodging/ResultListItem.vue:175-177
localStorage.setItem("searchLodgingFilters", JSON.stringify(f));
localStorage.setItem("searchLodgingAcomodation", JSON.stringify(a));
// Usar localStorage como store es un antipatrón

Pasos concretos para migrar a Vue 3:

Actualizar CLI: npm i -g @vue/cli@latest

Usar vue upgrade o migración manual con Vite

Reemplazar Vue.use → app.use(), new Vue() → createApp()

Migrar mixins a Composition API (composables)

Reemplazar vee-validate v2 por v4 (Vue 3)

Reemplazar vue-resource por Axios (90% ya usa Axios)

Reemplazar Moment.js por Day.js (misma API, 2KB vs 300KB)

Agregar @vue/compat como paso intermedio

2.4 Diseño UI/UX
Fortalezas detectadas:

Sistema de design tokens vía CSS custom properties en _variables.scss (colores, spacing, tipografía, sombras, z-index) - excelente base

SCSS modular con @use y @forward moderno

Componentes reutilizables (GttModal, GttSelect, GttButton)

Responsive parcial en componentes clave (NavBar1, GttSelect)

Problemas de usabilidad:

Problema	Ubicación	Descripción
Sin estado vacío/error	ResultLodging.vue:81-96	Solo loader; no hay estado para "sin resultados" o error
Sin feedback de carga en formularios	Register.vue:89	Solo spinner en botón, no hay skeleton screens
Hardcoded "Buenas tardes"	NavBar1.vue:14	Saludo fijo, sin calcular según hora del día
Sin meta descripción ni a11y	index.html	Sin atributos ARIA, sin lang dinámico, sin skip-to-content
Imágenes sin atributo alt	ResultListItem.vue:19	<img v-bind:src="destinyImage" alt /> alt vacío
Sin breadcrumb responsivo	Breadcrumb.vue (no revisado)	Probablemente quiebre en mobile
Accesibilidad (WCAG):

Contraste: El color primario #bcd01d (verde lima) sobre blanco tiene ratio de contraste ~1.8:1 (mínimo 4.5:1)

Falta skip navigation: Sin enlace "Saltar al contenido"

Navegación por teclado: El modal GttModal no atrapa el foco

ARIA: Prácticamente ausente en toda la aplicación

Mejoras propuestas:

Implementar estados vacío, error y loading en todos los componentes con búsqueda

Agregar skeleton loaders para resultados

Migrar a un Design System con Storybook

Agregar atributos ARIA (aria-label, role, aria-live)

Mejorar contraste de color siguiendo WCAG 2.1 AA

Implementar trap focus en modales

Agregar responsive a la tabla de reservas

3. Plan de Acción Priorizado
Prioridad	Tarea	Esfuerzo
🔴 Alta	Eliminar innerHTML de validation.js (XSS)	1h
🔴 Alta	Mover API URLs a .env real	2h
🔴 Alta	Migrar JWT de localStorage a cookie HttpOnly	8h
🟠 Media	Reemplazar Moment.js por Day.js	2h
🟠 Media	Reemplazar vue-resource por Axios (ya 90% usado)	1h
🟠 Media	Agregar lazy loading en rutas	3h
🟠 Media	Eliminar console.logs en producción	1h
🟡 Baja	Migrar Options API → Composition API (progresivo)	40h+
🟡 Baja	Migrar a Vue 3	60h+
🟡 Baja	Agregar TypeScript	80h+
🟡 Baja	Agregar tests (vitest + cypress)	40h+
🟡 Baja	Implementar Design System y a11y	30h+
4. Recomendaciones para Migración a Versiones Superiores
Stack actual detectado:

Tecnología	Versión actual	Estado
Vue	2.6.12	EOL (Dec 2023)
Vue CLI	4.4.0	EOL (2022)
Node	implícito (CLI 4 requiere Node 8-16)	-
ESLint	7.32.0	EOL
vee-validate	2.2.15	Deprecated
vue-resource	1.5.1	Deprecated
Moment.js	2.27.0	Legacy
Bootstrap	5.3.3	Actual
bootstrap-vue	2.23.1	EOL (BootstrapVue no es compatible con BS5 en Vue 2; requiere Vue 3 con BoostrapVueNext)
Estrategia de migración sugerida:

Fase 1 (Seguridad - 1 semana):

Mover todas las URLs a .env.production / .env.development

Reemplazar innerHTML con textContent

Sanitizar console.logs

Configurar CSP headers

Fase 2 (Deuda técnica - 2 semanas):

Reemplazar Moment.js → Day.js

Reemplazar vue-resource → Axios (ya importado, solo limpiar)

Agregar lazy loading a rutas

Migrar mixins a composables (Composition API)

Fase 3 (Migración Vue 3 - 4 semanas):

Agregar @vue/compat como capa de compatibilidad

Migrar main.js a createApp API

Reemplazar bootstrap-vue por componentes nativos Bootstrap 5 o boostrap-vue-next

Reemplazar vee-validate v2 → v4

Reemplazar vue-carousel, vue-slick (migrar a librerías Vue 3)

Fase 4 (Testing + TypeScript - 4 semanas):

Agregar Vitest + Vue Test Utils v2

Agregar Cypress para E2E

Adoptar TypeScript incrementalmente

Impacto de la migración:

Alto: bootstrap-vue no tiene versión Vue 3 oficial (usar PrimeVue, Naive UI, o Boostrap nativo)

Medio: vee-validate cambia completamente su API de v2 a v4

Bajo: Vue Router v3 → v4 (cambios mínimos en la API)

Medio: ESLint 7 → 9 (cambios en formato de configuración)

Herramientas de análisis automático recomendadas
Herramienta	Propósito
ESLint + eslint-plugin-vue	Análisis estático Vue (ya instalado pero desactualizado)
SonarQube/SonarCloud	Calidad de código, seguridad, duplicación
Lighthouse CI	Performance, accesibilidad, SEO, best practices
OWASP ZAP	Pentesting automático de seguridad
Snyk / npm audit	Vulnerabilidades en dependencias
vue-tsc	Type checking para Vue (post-migración)
vite-plugin-checker	TypeScript + ESLint en tiempo real
WAVE / axe DevTools	Auditoría de accesibilidad
Nota: Falta el archivo .env para conocer las variables de entorno reales. Se recomienda revisar también babel.config.js y jsconfig.json para completar el panorama de configuración.

