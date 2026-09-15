// Simulación local: no envía correos, mensajes ni datos a servicios externos.
let disponible = true;
const enviados = [];

export function configurarDisponibilidad(valor) {
  disponible = Boolean(valor);
}

export function enviarAviso(cita) {
  if (!disponible) throw new Error('El servicio de avisos está temporalmente fuera de servicio.');
  const aviso = { citaId: cita.id, texto: `Aviso de la cita de ${cita.mascota} enviado (simulación).` };
  enviados.push(aviso);
  return { ...aviso };
}

export function listarAvisos() {
  return enviados.map(aviso => ({ ...aviso }));
}
