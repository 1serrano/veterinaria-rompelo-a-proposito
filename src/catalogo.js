// Solo consulta: no importa módulos que creen o cambien citas.
const servicios = Object.freeze([
  Object.freeze({ id: 'consulta', nombre: 'Consulta general', duracion: 30, precio: 65000 }),
  Object.freeze({ id: 'vacunacion', nombre: 'Vacunación', duracion: 20, precio: 45000 }),
  Object.freeze({ id: 'control', nombre: 'Control veterinario', duracion: 20, precio: 35000 }),
]);

export function listarServicios() {
  return servicios.map(servicio => ({ ...servicio }));
}

export function buscarServicio(id) {
  const servicio = servicios.find(item => item.id === id);
  return servicio ? { ...servicio } : null;
}
