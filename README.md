# Huella · Veterinaria

Taller **Rómpelo a propósito** · Arquitectura de Software · UTadeo.

Sistema mínimo para consultar servicios y registrar citas de mascotas.
JavaScript ES6, HTML y CSS; sin frameworks, npm, build ni base de datos.
Los datos viven en memoria y los avisos son simulados. No usar datos reales.

## Cómo abrir

Los navegadores bloquean habitualmente los imports ES6 al abrir un archivo con
doble clic (`file://`). El taller pide simultáneamente módulos ES6 y apertura
directa; para mantener los módulos sin desactivar la seguridad del navegador,
se sirve la misma carpeta por HTTP. No requiere npm ni compilación.

Desde la carpeta del proyecto:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Abrir **http://127.0.0.1:8000/index.html**. Detener con Ctrl+C.
También puede usarse Live Server en VS Code. `package.json` solo declara ES6
para ejecutar el verificador con Node; no tiene dependencias para instalar.

## Exactamente cuatro archivos en src/

| Archivo | Responsabilidad | Importa |
|---|---|---|
| `app.js` | Coordinar la interfaz y sus operaciones | catálogo, citas, avisos |
| `catalogo.js` | Consultar servicios y tarifas | ninguno |
| `citas.js` | Validar y guardar citas del consultorio | catálogo |
| `avisos.js` | Simular envío y falla de avisos | ninguno |

`index.html` importa `src/app.js`. Se usan llamadas directas, sin bus de eventos.
Los eventos DOM de botones/formulario solo gestionan la interfaz: no son un bus entre módulos.

## Los dos drivers

1. **Consultar el catálogo de servicios nunca debe crear ni modificar citas de las mascotas.**
2. **Si el servicio de avisos falla, la cita de la mascota debe quedar confirmada y conservarse en la agenda.**

Cada driver tiene un ADR con contexto, driver, decisión, alternativa descartada
y qué pagamos, en `arquitectura/`. R1 y R2 los convierten en fronteras verificables.

## Comprobar la arquitectura y el comportamiento

```sh
node tools/verificar.js
node --test tests/comportamiento.test.js
```

El verificador y el pipeline provienen del kit del profesor. El verificador se
conserva sin modificaciones. El pipeline también ejecuta las pruebas de comportamiento
después de comprobar los imports. El primer comando sale con 0 si cumple y 1 si viola.

## Prueba verde → roja → verde

En la rama `main` hay tres commits del ejercicio:

1. **feat: entregar veterinaria sana con dos ADR y reglas verificables** — pipeline verde.
2. **test: violar R2 importando avisos desde citas** — agrega al inicio de `src/citas.js`:

   ```js
   import { enviarAviso } from './avisos.js';
   ```

   Pipeline rojo con R2/ADR-002 y el motivo de negocio del driver 2.
   El import no necesita ejecutarse: la frontera prohíbe la dependencia misma.
3. **fix: retirar import prohibido y recuperar la arquitectura** — elimina esa línea; pipeline verde.

Consultar [Actions](https://github.com/1serrano/veterinaria-rompelo-a-proposito/actions)
y el [historial](https://github.com/1serrano/veterinaria-rompelo-a-proposito/commits/main/).
El commit rojo permanece en el historial: es la evidencia solicitada, no un fallo pendiente.

## Demostración en clase

1. Abrir la aplicación por HTTP y consultar el catálogo varias veces: la agenda no cambia.
2. Registrar una cita con fecha futura: aparece en la agenda y se simula el aviso.
3. Activar **Simular falla de avisos**.
4. Registrar otra cita en un horario diferente: queda confirmada y aparece la advertencia del aviso.
5. Consultar otra vez el catálogo: ambas citas permanecen sin cambios.
6. Mostrar el ADR-002, R2 y las tres ejecuciones de Actions, abriendo el log rojo.

La agenda corresponde a un único consultorio y rechaza citas que se solapen.
Los datos se borran al recargar, como pide el almacenamiento en memoria.

## Entrega

- Este repositorio público con `src/`, los dos ADR y `arquitectura/reglas.json`.
- Tres ejecuciones en Actions: verde, roja, verde.
- Hoja del taller con nombre, dominio veterinaria y los dos drivers; se entrega en papel.

El cambio a un bus de eventos es el punto **opcional** del PDF y no se incluye:
esta versión conserva las llamadas directas requeridas y aísla el fallo de avisos.
