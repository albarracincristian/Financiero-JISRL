# Financiero JISRL – App Web (HTML/CSS/JS)

Aplicación web estática para gestión financiera. Incluye una matriz mensual editable, calendario de feriados con importación/exportación a Excel y un panel de navegación entre secciones. No requiere backend: los datos persisten en el navegador con localStorage.

## Estructura del Proyecto

- `nuevo-proyecto/index.html`: Panel inicial y navegación.
- `nuevo-proyecto/flujo-caja.html`: Tesorería / Flujo de caja.
- `nuevo-proyecto/input.html`: Operaciones (captura de datos).
- `nuevo-proyecto/data-entry.html`: Presupuesto mensual (matriz editable e import/export Excel).
- `nuevo-proyecto/feriados.html`: Calendario laboral (alta/baja de feriados e import/export Excel).
- `nuevo-proyecto/styles.css`: Estilos globales.
- `nuevo-proyecto/script.js`: Lógica de Feriados y utilidades generales.
- `nuevo-proyecto/vendor/xlsx.full.min.js`: Librería local para manejar Excel (SheetJS).
- `.vscode/launch.json`: Configuraciones para abrir con Edge/Chrome desde VS Code.

## Cómo Ejecutar

- Opción rápida: abrir `nuevo-proyecto/index.html` en el navegador.
- VS Code Live Server: click derecho en `index.html` → “Open with Live Server”.
- Servidor local:
  - Python: `cd nuevo-proyecto` y `python -m http.server 5500` → abrir `http://localhost:5500`
  - Node: `npx http-server nuevo-proyecto -p 5500 -o`

## Secciones

- Panel: accesos a todas las vistas.
- Tesorería (`flujo-caja.html`): visualización del flujo de caja. (WIP)
- Operaciones (`input.html`): captura de operaciones. (WIP)
- Presupuesto Mensual (`data-entry.html`):
  - Matriz mensual con columnas configurables (agregar, renombrar, eliminar).
  - Celdas editables con formato de moneda opcional y promedio/total por fila y pie.
  - Importar desde Excel: detecta cabeceras “MES” y “TOTALES” y mapea a columnas conocidas.
  - Exportar a Excel: hoja “Matriz” y hoja de “Resumen” por rubro con totales/promedios.
  - Persistencia de datos, columnas y título de totales en localStorage.
- Calendario de Feriados (`feriados.html`):
  - Alta de feriados con validación y orden automático (próximos primero, luego pasados).
  - Eliminación con ícono de tacho.
  - Importar/Exportar a Excel (XLSX) con SheetJS.
  - Fechas en horario local para evitar desfases.

## Persistencia (localStorage)

- `feriados`: arreglo de feriados `{ date: 'YYYY-MM-DD', name: string }`.
- `finapp_month_grid_v1`: datos de la matriz mensual.
- `finapp_month_grid_v1_cols`: metadatos de columnas (id, label, currency).
- `finapp_month_grid_v1_formula`: configuración/encabezados y fórmulas del Excel importado.
- `finapp_month_grid_v1_totals_label`: título personalizado de la columna de totales.

## Requisitos

- Navegador moderno. Sin dependencias externas obligatorias.
- Para import/export Excel, se usa `nuevo-proyecto/vendor/xlsx.full.min.js` (incluida).

## Desarrollo

- Código HTML/CSS/JS simple en `nuevo-proyecto/`.
- Para depurar en VS Code: usar `.vscode/launch.json` (perfiles Edge/Chrome).

## Notas

- El proyecto trabaja 100% en cliente. Si limpias almacenamiento/caché del navegador se pierden los datos.
- Las secciones Tesorería y Operaciones pueden requerir datos/ajustes adicionales según necesidades.

## Licencia

Proyecto interno. No se ha definido licencia pública.

