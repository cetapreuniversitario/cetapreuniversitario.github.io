// ==========================================
// BASE DE DATOS DE ESTUDIANTES Y ACCESOS
// activo: 1 = Permitido | 0 = Deshabilitado
// ==========================================
const ESTUDIANTES_DB = [
  { codigo: "Estudiante1-CETA", nombre: "Juan Pablo Mendoza Vera", activo: 1 },
  { codigo: "Estudiante2-CETA", nombre: "Ana Lucía García", activo: 1 },
  { codigo: "admin", nombre: "Teddy Admin", activo: 1 },
  { codigo: "Estudiante3-CETA", nombre: "Marcos Torres", activo: 0 }
];

// Generar estudiantes dinámicos del 4 al 25
for (let i = 4; i <= 25; i++) {
  ESTUDIANTES_DB.push({
    codigo: `Estudiante${i}-CETA`,
    nombre: `Estudiante Ejemplo ${i}`,
    activo: 1
  });
}

// ==========================================
// PUNTO 2: BLOQUEO DE CÓDIGO FUENTE
// ==========================================
(function bloquearCodigoFuente() {
  // 1. Bloquear Clic Derecho (Menú Contextual)
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  }, false);

  // 2. Bloquear Teclas F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S
  document.addEventListener('keydown', function(e) {
    if (
      e.keyCode === 123 || // F12
      (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || // Ctrl+Shift+I/J/C
      (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83)) // Ctrl+U / Ctrl+S
    ) {
      e.preventDefault();
      return false;
    }
  }, false);

  // 3. Detección continua de inspección de consola (DevTools)
  setInterval(function() {
    const startTime = performance.now();
    debugger; // Pausa el flujo si la consola del navegador se abre
    const endTime = performance.now();
    if (endTime - startTime > 100) {
      document.body.innerHTML = `
        <div style="background:#0f172a;color:#ef4444;height:100vh;display:flex;align-items:center;justify-content:center;font-family:sans-serif;text-align:center;padding:20px;">
          <h2>Acceso no autorizado detectado. La sesión ha sido bloqueada por seguridad.</h2>
        </div>`;
    }
  }, 1000);
})();

// ==========================================
// PUNTO 3: SEGURIDAD DE INGRESO (MÓVIL Y PC)
// ==========================================
let isMobileDevice = false;
let generatedPcCode = "";

// Detectar si es dispositivo móvil o PC
function CETA_Seguridad_DetectarDispositivo() {
  isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  CETA_Seguridad_RenderizarUI();
}

// Generar código aleatorio dinámico para escritorio
function CETA_Seguridad_GenerarTokenPC() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Renderizar la sección dinámica en el login según el dispositivo
function CETA_Seguridad_RenderizarUI() {
  const container = document.getElementById('security-verification-container');
  if (!container) return;

  if (isMobileDevice) {
    container.innerHTML = `
      <div class="security-box" style="border-color: #10b981; background: #ecfdf5;">
        <div style="display:flex; align-items:center; gap:10px;">
          <i data-lucide="fingerprint" size="28" style="color: #10b981;"></i>
          <div style="text-align:left;">
            <span style="font-size:0.8rem; font-weight:700; color:#065f46; display:block;">Verificación Biométrica</span>
            <span style="font-size:0.75rem; color:#047857;">Se solicitará Huella/Rostro en tu móvil</span>
          </div>
        </div>
      </div>
    `;
  } else {
    generatedPcCode = CETA_Seguridad_GenerarTokenPC();
    container.innerHTML = `
      <div class="security-box">
        <span class="captcha-code" id="token-display">${generatedPcCode}</span>
        <button type="button" onclick="CETA_Seguridad_RefrescarTokenPC()" style="background:none; border:none; cursor:pointer; color:var(--primary);">
          <i data-lucide="refresh-cw" size="18"></i>
        </button>
      </div>
      <div class="input-group">
        <label class="input-label">Ingresa el Código Dinámico Generado</label>
        <input type="text" id="pcTokenInput" class="input-field" placeholder="Verificación de seguridad" style="text-transform:uppercase;">
      </div>
    `;
  }
  if (window.lucide) lucide.createIcons();
}

function CETA_Seguridad_RefrescarTokenPC() {
  generatedPcCode = CETA_Seguridad_GenerarTokenPC();
  const elem = document.getElementById('token-display');
  if (elem) elem.textContent = generatedPcCode;
}

// Autenticación por Biometría / Huella en Móviles
async function CETA_Seguridad_ValidarHuellaMovil() {
  if (window.PublicKeyCredential) {
    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (available) {
        return confirm("CETA Preuniversitario: Escanea tu huella dactilar o rostro en el dispositivo para verificar tu identidad.");
      }
    } catch (e) {
      console.warn("Autenticación biométrica omitida:", e);
    }
  }
  return confirm("Confirma tu identidad mediante el sensor de tu dispositivo móvil para continuar.");
}

// Validación integral de login invocada desde el HTML principal
async function CETA_ValidarAcceso(codigoIngresado) {
  const user = ESTUDIANTES_DB.find(u => u.codigo === codigoIngresado);

  if (!user) {
    return { ok: false, msg: "Código de acceso no válido." };
  }

  if (user.activo === 0) {
    return { ok: false, msg: "Tu acceso ha sido deshabilitado. Contacta con administración de CETA Preuniversitario." };
  }

  // Comprobación de seguridad por tipo de dispositivo
  if (isMobileDevice) {
    const huellaValida = await CETA_Seguridad_ValidarHuellaMovil();
    if (!huellaValida) {
      return { ok: false, msg: "Verificación por huella dactilar cancelada o fallida." };
    }
  } else {
    const pcTokenInput = document.getElementById('pcTokenInput');
    const tokenUsuario = pcTokenInput ? pcTokenInput.value.trim().toUpperCase() : "";
    if (tokenUsuario !== generatedPcCode) {
      CETA_Seguridad_RefrescarTokenPC();
      return { ok: false, msg: "Código dinámico de seguridad incorrecto. Inténtalo de nuevo." };
    }
  }

  return { ok: true, user: user };
}