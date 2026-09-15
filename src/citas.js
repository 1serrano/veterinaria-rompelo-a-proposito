import { buscarServicio } from './catalogo.js';

// Agenda de un consultorio. No conoce ni espera al módulo de avisos.
const agenda = [];
let siguienteId = 1;

function copiar(cita) {
  return { ...cita, servicio: { ...cita.servicio } };
}

export function listarCitas() {
  return agenda.map(copiar).sort((a, b) => a.fecha.localeCompare(b.fecha));
}

export function registrarCita({ mascota, responsable, servicioId, fecha }) {
  if (typeof mascota !== 'string' || !mascota.trim() || mascota.trim().length > 60) {
    throw new Error('Escribe el nombre de la mascota (máximo 60 caracteres).');
  }
  if (typeof responsable !== 'string' || !responsable.trim() || responsable.trim().length > 80) {
    throw new Error('Escribe el nombre del responsable (máximo 80 caracteres).');
  }
  const servicio = buscarServicio(servicioId);
  if (!servicio) throw new Error('Selecciona un servicio del catálogo.');
  const inicio = new Date(fecha).getTime();
  if (!Number.isFinite(inicio) || inicio <= Date.now()) {
    throw new Error('Selecciona una fecha y hora futuras.');
  }
  const fin = inicio + servicio.duracion * 60000;
  const ocupada = agenda.some(cita => {
    const otroInicio = new Date(cita.fecha).getTime();
    return inicio < otroInicio + cita.servicio.duracion * 60000 && fin > otroInicio;
  });
  if (ocupada) throw new Error('El consultorio está ocupado en ese horario. Elige otro.');
  const cita = {
    id: siguienteId++, mascota: mascota.trim(), responsable: responsable.trim(),
    servicio, fecha: new Date(inicio).toISOString(),
  };
  agenda.push(cita);
  return copiar(cita);
}
