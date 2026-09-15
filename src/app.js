import { listarServicios } from './catalogo.js';
import { registrarCita, listarCitas } from './citas.js';
import { enviarAviso, configurarDisponibilidad } from './avisos.js';

// Coordinación de la interfaz: llamadas directas ES6, sin bus de eventos.
const moneda = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
const fechaVisible = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
const formulario = document.querySelector('#cita-form');
const mensaje = document.querySelector('#mensaje');
const seleccion = document.querySelector('#servicio');

function mostrarAgenda() {
  const citas = listarCitas();
  document.querySelector('#total').textContent = String(citas.length);
  document.querySelector('#sin-citas').hidden = citas.length > 0;
  const lista = document.querySelector('#agenda');
  lista.replaceChildren();
  for (const cita of citas) {
    const fila = document.createElement('li');
    const nombre = document.createElement('strong');
    const detalle = document.createElement('span');
    const horario = document.createElement('time');
    nombre.textContent = `${cita.mascota} · ${cita.servicio.nombre}`;
    detalle.textContent = `${cita.responsable} · ${cita.servicio.duracion} min · ${moneda.format(cita.servicio.precio)}`;
    horario.dateTime = cita.fecha;
    horario.textContent = fechaVisible.format(new Date(cita.fecha));
    fila.append(nombre, detalle, horario);
    lista.append(fila);
  }
}

function mostrarCatalogo() {
  const lista = document.querySelector('#catalogo');
  lista.replaceChildren();
  for (const servicio of listarServicios()) {
    const item = document.createElement('li');
    const nombre = document.createElement('strong');
    const detalle = document.createElement('span');
    nombre.textContent = servicio.nombre;
    detalle.textContent = `${servicio.duracion} min · ${moneda.format(servicio.precio)}`;
    item.append(nombre, detalle);
    lista.append(item);
  }
}

for (const servicio of listarServicios()) {
  const opcion = document.createElement('option');
  opcion.value = servicio.id;
  opcion.textContent = `${servicio.nombre} · ${moneda.format(servicio.precio)}`;
  seleccion.append(opcion);
}

formulario.addEventListener('submit', evento => {
  evento.preventDefault();
  mensaje.className = 'mensaje';
  let cita;
  try {
    cita = registrarCita({
      mascota: formulario.elements.mascota.value,
      responsable: formulario.elements.responsable.value,
      servicioId: seleccion.value,
      fecha: formulario.elements.fecha.value,
    });
  } catch (error) {
    mensaje.textContent = error.message;
    mensaje.classList.add('error');
    return;
  }
  // La cita ya está guardada antes de intentar el aviso. Un fallo no la revierte.
  mostrarAgenda();
  formulario.reset();
  try {
    enviarAviso(cita);
    mensaje.textContent = `Cita #${cita.id} confirmada para ${cita.mascota}. Aviso enviado (simulación).`;
    mensaje.classList.add('exito');
  } catch {
    mensaje.textContent = `Cita #${cita.id} confirmada para ${cita.mascota}. El aviso no se pudo enviar; la cita sigue registrada.`;
    mensaje.classList.add('advertencia');
  }
});

document.querySelector('#fallo-avisos').addEventListener('change', evento => {
  configurarDisponibilidad(!evento.target.checked);
  document.querySelector('#estado-avisos').textContent = evento.target.checked ? 'Avisos fuera de servicio' : 'Avisos disponibles';
});
document.querySelector('#consultar').addEventListener('click', mostrarCatalogo);
mostrarCatalogo();
mostrarAgenda();
document.querySelector('#carga').hidden = true;
document.querySelector('#guardar').disabled = false;
