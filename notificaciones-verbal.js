/**
 * Archivo independiente de notificaciones para el módulo de R. Verbal
 * CETA Preuniversitario
 */

const NOTIFICACIONES_VERBAL = [
  {
    id: 1,
    titulo: "Bienvenida al Módulo",
    descripcion: "Te damos la bienvenida al módulo de Razonamiento Verbal. Revisa los materiales y empieza a practicar.",
    fecha: "Permanente",
    tipo: "informativo"
  },
  {
    id: 2,
    titulo: "Recordatorio de Sesión",
    descripcion: "Te esperamos en la clase presencial este sábado para continuar con los temas programados.",
    fecha: "Próximo Sábado",
    tipo: "importante"
  }
];

function cargarNotificacionesVerbal() {
  const contenedor = document.getElementById('verbal-notifications-container');
  if (!contenedor) return;

  let htmlContent = '';
  if (NOTIFICACIONES_VERBAL.length === 0) {
    htmlContent = '<p style="text-align:center; color: var(--text-muted); padding: 20px;">No hay notificaciones nuevas.</p>';
  } else {
    NOTIFICACIONES_VERBAL.forEach(notif => {
      const colorTipo = notif.tipo === 'importante' ? '#d97706' : '#2563eb';
      const bgTipo = notif.tipo === 'importante' ? 'rgba(217, 119, 6, 0.1)' : 'rgba(37, 99, 235, 0.1)';
      const borderTipo = notif.tipo === 'importante' ? 'rgba(217, 119, 6, 0.3)' : 'rgba(37, 99, 235, 0.3)';

      htmlContent += `
        <div style="background: ${bgTipo}; border: 1px solid ${borderTipo}; border-radius: 16px; padding: 1.25rem; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="background: ${colorTipo}; color: white; font-size: 0.7rem; font-weight: 800; padding: 3px 8px; border-radius: 6px; text-transform: uppercase;">
              ${notif.tipo}
            </span>
            <span style="font-size: 0.8rem; color: var(--text-main); font-weight: 600;">${notif.fecha}</span>
          </div>
          <h4 style="font-size: 1rem; font-weight: 700; color: ${colorTipo}; margin-bottom: 6px;">${notif.titulo}</h4>
          <p style="font-size: 0.9rem; color: var(--text-main); line-height: 1.45;">
            ${notif.descripcion}
          </p>
        </div>
      `;
    });
  }
  contenedor.innerHTML = htmlContent;
}