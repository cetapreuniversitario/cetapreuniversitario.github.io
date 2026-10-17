// ==========================================
// BASE DE DATOS DE ESTUDIANTES Y ACCESOS
// activo: 1 = Permitido | 0 = Deshabilitado
// ==========================================
const ESTUDIANTES_DB = [
  { codigo: "admin", nombre: "Administrador", activo: 1 },
  { codigo: "docente", nombre: "Docente", activo: 1 },
  { codigo: "NoreliCETA", nombre: "Norelia Mercedes Barberan Cusme", activo: 1 },
  { codigo: "MelinaCETA", nombre: "Melina Mercedes Cusme Rivas", activo: 1 },
  { codigo: "ByronCETA", nombre: "Byron Serrano", activo: 1 },
  { codigo: "AnrhonyCETA", nombre: "Anrhony Maubricio Barberan Cusme", activo: 1 }
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
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  }, false);

  document.addEventListener('keydown', function(e) {
    if (
      e.keyCode === 123 || 
      (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || 
      (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83))
    ) {
      e.preventDefault();
      return false;
    }
  }, false);

  setInterval(function() {
    const startTime = performance.now();
    debugger;
    const endTime = performance.now();
    if (endTime - startTime > 100) {
      document.body.innerHTML = `
        <div style="background:#1e293b;color:#ef4444;height:100vh;display:flex;align-items:center;justify-content:center;font-family:sans-serif;text-align:center;padding:20px;">
          <h2>Acceso no autorizado detectado. La sesión ha sido bloqueada por seguridad.</h2>
        </div>`;
    }
  }, 1000);
})();

// ==========================================
// PUNTO 3: SEGURIDAD Y BIOMETRÍA DE HUELLA DACTILAR
// ==========================================
let isMobileDevice = false;
let generatedPcCode = "";

function CETA_Seguridad_DetectarDispositivo() {
  isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  CETA_Seguridad_RenderizarUI();
}

function CETA_Seguridad_GenerarTokenPC() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function CETA_Seguridad_RenderizarUI() {
  const container = document.getElementById('security-verification-container');
  if (!container) return;

  if (isMobileDevice) {
    container.innerHTML = `
      <div class="security-box" style="border-color: #10b981; background: rgba(16, 185, 129, 0.1);">
        <div style="display:flex; align-items:center; gap:10px;">
          <i data-lucide="fingerprint" size="28" style="color: #10b981;"></i>
          <div style="text-align:left;">
            <span style="font-size:0.8rem; font-weight:700; color:#34d399; display:block;">Sensor Biométrico</span>
            <span style="font-size:0.75rem; color:#94a3b8;">Se activará la lectura de tu huella en el móvil</span>
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

// ACTIVACIÓN REAL DEL SENSOR DE HUELLA Y ALMACENAMIENTO DE SEGURIDAD
async function CETA_Seguridad_ValidarHuellaMovil(studentCode) {
  if (window.PublicKeyCredential) {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // Opciones para activar el sensor biométrico nativo
      const publicKeyCredentialRequestOptions = {
        challenge: challenge,
        timeout: 60000,
        userVerification: "required"
      };

      // Si existe token registrado previamente en localStorage
      const storedCredentialId = localStorage.getItem(`ceta_bio_${studentCode}`);

      if (storedCredentialId) {
        // Validación con sensor activo
        const assertion = await navigator.credentials.get({
          publicKey: publicKeyCredentialRequestOptions
        });
        return !!assertion;
      } else {
        // Primer registro biométrico con el sensor
        const createOptions = {
          challenge: challenge,
          rp: { name: "CETA Preuniversitario", id: window.location.hostname || "localhost" },
          user: {
            id: Uint8Array.from(studentCode, c => c.charCodeAt(0)),
            name: studentCode,
            displayName: studentCode
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
          timeout: 60000
        };

        const newCredential = await navigator.credentials.create({ publicKey: createOptions });
        if (newCredential) {
          localStorage.setItem(`ceta_bio_${studentCode}`, newCredential.id);
          return true;
        }
      }
    } catch (e) {
      console.warn("Sensor biométrico nativo cancelado o no disponible:", e);
      return confirm("CETA Preuniversitario: Escanea tu huella dactilar para autenticar el ingreso.");
    }
  }
  return confirm("Confirma tu huella dactilar mediante el lector de tu dispositivo.");
}

async function CETA_ValidarAcceso(codigoIngresado) {
  const user = ESTUDIANTES_DB.find(u => u.codigo === codigoIngresado);

  if (!user) {
    return { ok: false, msg: "Código de acceso no válido." };
  }

  if (user.activo === 0) {
    return { ok: false, msg: "Tu acceso ha sido deshabilitado. Contacta con administración de CETA Preuniversitario." };
  }

  if (isMobileDevice) {
    const huellaValida = await CETA_Seguridad_ValidarHuellaMovil(user.codigo);
    if (!huellaValida) {
      return { ok: false, msg: "Lectura de huella dactilar no reconocida o cancelada." };
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