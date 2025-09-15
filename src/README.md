# Financiero JISRL – Frontend

Esta carpeta contiene la app web estática del proyecto. Para una descripción completa ver `../README.md`.

## Archivos

- `index.html`: Panel y navegación.
- `flujo-caja.html`: Tesorería / Flujo de caja (WIP).
- `input.html`: Operaciones (WIP).
- `data-entry.html`: Presupuesto mensual (matriz editable e import/export Excel).
- `feriados.html`: Calendario laboral con import/export.
- `styles.css`: Estilos.
- `script.js`: Lógica de Feriados y utilidades.
- `vendor/xlsx.full.min.js`: Librería de Excel (SheetJS).

## Ejecutar

- Abrir `index.html` en el navegador, o servir con:
  - `python -m http.server 5500` dentro de `nuevo-proyecto` → `http://localhost:5500`
  - `npx http-server . -p 5500 -o`

## Persistencia

Se usa localStorage: no hay backend. Limpiar almacenamiento del navegador borra los datos.

