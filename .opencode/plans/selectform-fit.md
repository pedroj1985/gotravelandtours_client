# GttSelectForm / GttSelectForm2: contenido siempre dentro de .gtt__list_area_wrapper

## Objetivo
El panel interno (`.gtt__form`) de los componentes `GttSelectForm` y `GttSelectForm2`
debe ajustarse siempre al ancho de su contenedor `.gtt__list_area_wrapper` (que mide lo
mismo que el campo/toggle) sin desbordarse a la derecha.

## Diagnóstico
- `.gtt__list_area_wrapper` en ambos componentes: `position: absolute; left: 0; right: 0`,
  por lo que su ancho = ancho del campo (ej. ~271px en desktop, ~140px en móvil en /lodgings).
- El problema: `.gtt__form` tiene **`min-width: 450px`** (GttSelectForm.vue:264 y
  GttSelectForm2.vue:367). Como ese mínimo es mayor que el wrapper, la tarjeta del
  dropdown se sale por la derecha del contenedor.
- **Agravante**: el grid interno usa filas Bootstrap 5 (`row` + `col-md-6/2/1/2`):
  - `.row` con márgenes negativos (-12px) → las columnas se extienden 24px fuera.
  - Botones `.gtt__picker_button` de ancho fijo (48px base, 36px en <1440px) → su
    `min-content` (48px) impide que su `col-md-2` (16.66% ≈ 40px en 271px) se encoja,
    forzando overflow aunque exista `overflow-x: hidden` (Form2).
- En GttSelectForm2 el `.gtt__form` ya aplica `max-height: 500px; overflow: auto;
  overflow-x: hidden` (líneas 424-428), así que **el recorte interior ya existe**; lo que
  sobra soy la caja y el contenido que se salen del wrapper.

## Cambios propuestos

### `src/components/custom-elements/GttSelectForm.vue` (y los equivalentes en `GttSelectForm2.vue`)
1. **Quitar el ancho mínimo** en `.gtt__form`:
   - `min-width: 450px` → `min-width: 0`
   - Añadir `width: 100%; max-width: 100%`
   - Conservar `min-height: 150px` (GttSelectForm) y `height: 350px/max-height: 500px
     + overflow` (GttSelectForm2).
2. **Contener las filas Bootstrap** dentro `.gtt__form`:
   - `.gtt__form .row { margin-left: 0; margin-right: 0; }` (anula el margen negativo).
   - `.gtt__form .row > [class*="col-"] { min-width: 0; padding-left: 4px; padding-right: 4px; }`
     → las columnas pueden encogerse y no arrastran contenido fuera.
3. **Hacer escalables los botones +/-**:
   - `.gtt__picker_button { width: 100%; max-width: 48px; height: auto; aspect-ratio: 1 / 1; }`
     (se mantiene el círculo, pero si la columna es más estrecha, el botón se encoge).
   - En el media `(max-width: 1440px)` mantener el tope en 36px (`max-width: 36px`).
4. Alineación: `align-items: center` en `.gtt__item.row` / `.gtt__room_row` para que
   label y botones queden verticalmente centrados cuando las celdas cambian de tamaño.

### Sin cambios
- Estructura/scripts de ambos componentes (lógica de add/remove, kids, rooms).
- Ancho/posición del `.gtt__list_area_wrapper` (ya es `left:0; right:0` = 100%).
- Mixin `dropdown-wrapper` y variables.

## Cómo se verifica (tras implementar)
1. Headless en `/lodgings` (el campo "Visitantes" usa `GttSelectForm`):
   abrir el dropdown a 1280 / 768 / 390px y comprobar:
   - `.gtt__form` contenido en `.gtt__list_area_wrapper`
     (`form.right <= wrapper.right && form.left >= wrapper.left`).
   - `document.documentElement.scrollWidth === clientWidth`.
   - Botones `+/-` visibles dentro del wrapper (rect dentro del rect del wrapper).
2. `GttSelectForm2`: si es alcanzable desde una ruta accesible, medir igual; si no,
   se valida por paridad de cambios + build (misma regla CSS aplicada).
3. Suite: `pnpm vitest run` (pool forks ya configurado), `vue-tsc --noEmit`, eslint,
   `pnpm build`.
4. Commit + push (flujo habitual: `fix(dropdown): ...` o `style(dropdown): ...`).

## Archivos tocados
- `src/components/custom-elements/GttSelectForm.vue`
- `src/components/custom-elements/GttSelectForm2.vue`

## Nota / decisión
El cambio cubre los dos componentes con `.gtt__form` (`GttSelectForm` y `GttSelectForm2`).
Si solo se quería uno, se ajusta el alcance.