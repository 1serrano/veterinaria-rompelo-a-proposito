# ADR-001 · El catálogo solo consulta servicios

## Contexto
Una persona puede consultar servicios y tarifas varias veces antes de agendar.
Esa consulta no autoriza crear ni cambiar una cita. El módulo `catalogo` es dueño
del catálogo; `citas` es dueño de la agenda y `app` coordina la interfaz.

## Driver que manda
Consultar el catálogo de servicios nunca debe crear ni modificar citas de las mascotas.

## Decisión
`catalogo` NO puede importar `citas`, `avisos` ni `app`.
Solo expone `listarServicios` y `buscarServicio`, y entrega copias de sus datos.
Así, consultar servicios no tiene acceso directo a operaciones que cambian la agenda
ni al coordinador que podría ejecutarlas. `citas` sí puede consultar `catalogo`.
La regla R1 convierte esta frontera en una comprobación de imports.

## Alternativa descartada
Importar `registrarCita` desde el catálogo y reservar automáticamente al consultar
un servicio. Es sencillo, pero una consulta repetida puede producir citas que
nadie confirmó. También se descarta devolver la colección interna mutable.

## Qué pagamos
La interfaz debe coordinar por separado la selección del servicio y el registro
de la cita. Se copian objetos al consultar y hay más funciones explícitas que en
un único archivo. La comprobación de imports no demuestra por sí sola toda la
propiedad de negocio: se complementa con pruebas de comportamiento y revisión.
