import test from 'node:test';
import assert from 'node:assert/strict';
import { listarServicios, buscarServicio } from '../src/catalogo.js';
import { registrarCita, listarCitas } from '../src/citas.js';
import { configurarDisponibilidad, enviarAviso, listarAvisos } from '../src/avisos.js';

test('drivers de negocio, validación y protección de los datos internos', () => {
  const fecha = new Date(Date.now() + 86400000).toISOString();
  const datos = { mascota: 'Luna', responsable: 'Ana', servicioId: 'consulta', fecha };
  const inicial = listarCitas();
  const servicios = listarServicios();
  servicios[0].precio = 1;
  servicios.pop();
  const servicio = buscarServicio('consulta');
  servicio.nombre = 'Alterado';
  assert.equal(listarServicios().length, 3);
  assert.equal(buscarServicio('consulta').precio, 65000);
  assert.equal(buscarServicio('consulta').nombre, 'Consulta general');
  assert.deepEqual(listarCitas(), inicial, 'Consultar el catálogo no modifica citas');

  configurarDisponibilidad(false);
  const cita = registrarCita(datos);
  assert.throws(() => enviarAviso(cita), /fuera de servicio/);
  assert.equal(listarCitas().length, 1, 'La cita sobrevive al fallo de avisos');
  assert.equal(listarAvisos().length, 0);
  cita.mascota = 'Alterada';
  const copia = listarCitas();
  copia[0].servicio.precio = 0;
  copia.pop();
  assert.equal(listarCitas()[0].mascota, 'Luna');
  assert.equal(listarCitas()[0].servicio.precio, 65000);
  const antesConsulta = listarCitas();
  listarServicios(); buscarServicio('control');
  assert.deepEqual(listarCitas(), antesConsulta);

  assert.throws(() => registrarCita(datos), /ocupado/);
  assert.throws(() => registrarCita({ ...datos, fecha: new Date(Date.now() + 86400000 + 600000).toISOString() }), /ocupado/);
  assert.throws(() => registrarCita({ ...datos, mascota: ' ' }), /mascota/);
  assert.throws(() => registrarCita({ ...datos, servicioId: 'inexistente' }), /servicio/);
  assert.throws(() => registrarCita({ ...datos, fecha: 'ayer' }), /futuras/);
  assert.throws(() => registrarCita({ ...datos, fecha: '2020-01-01T10:00:00' }), /futuras/);
  assert.equal(listarCitas().length, 1, 'Los errores no crean citas');

  configurarDisponibilidad(true);
  const otra = registrarCita({ ...datos, mascota: 'Milo', fecha: new Date(new Date(fecha).getTime() + 1800000).toISOString() });
  assert.equal(listarCitas().length, 2, 'Acepta la cita al terminar la anterior');
  assert.equal(enviarAviso(otra).citaId, otra.id);
  const avisos = listarAvisos(); avisos[0].texto = 'Alterado';
  assert.notEqual(listarAvisos()[0].texto, 'Alterado');
});
