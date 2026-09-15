# ADR-002 · Confirmar citas aunque fallen los avisos

## Contexto
El servicio de avisos puede fallar. La recepción debe poder reservar la atención
de la mascota de todas formas. Una llamada directa desde `citas` a `avisos`
haría que un problema al notificar se propagara por la operación de reserva.

## Driver que manda
Si el servicio de avisos falla, la cita de la mascota debe quedar confirmada y conservarse en la agenda.

## Decisión
`citas` NO puede importar `avisos` ni `app`. Guarda y devuelve la cita sin esperar
una respuesta del servicio de avisos. `app` llama directamente a `registrarCita`,
actualiza la agenda y luego llama a `enviarAviso` en un bloque de manejo de errores
independiente. No se revierte una cita si el aviso falla. R2 protege esta frontera.
Se mantienen imports y llamadas directas ES6; no se introduce todavía un bus de eventos.
Esta es la decisión sobre qué módulo no debe depender de que otro responda.

## Alternativa descartada
Importar `enviarAviso` dentro de `citas` y llamarlo como parte obligatoria de la
confirmación. Parece más corto, pero la disponibilidad de avisos determinaría si
la recepción puede completar su trabajo. Se pospone también un bus de eventos:
no hace falta para el alcance mínimo y sería el ejercicio opcional posterior.

## Qué pagamos
Una cita puede quedar confirmada sin aviso enviado. La interfaz debe comunicar
ese resultado parcial y coordinar dos operaciones. Este prototipo no reintenta
avisos ni conserva una cola después de recargar; agregarlas requeriría persistencia
y una política de reintentos. La regla detecta imports prohibidos, no bloqueos
de red ni todas las dependencias indirectas: la prueba de falla verifica el caso real.
