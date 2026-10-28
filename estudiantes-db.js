// ==========================================
// BASE DE DATOS DE ESTUDIANTES Y ACCESOS
// activo: 1 = Permitido | 0 = Deshabilitado
// ==========================================
const ESTUDIANTES_DB = [
  { codigo: "admin", nombre: "Administrador", activo: 1 },
  { codigo: "docente", nombre: "Profesor", activo: 1 },
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
// PUNTO 2: BLOQUEO DE CÓDIGO FUENTE (INALTERADO)
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
// VERIFICACIÓN DE SEGURIDAD: OPERACIÓN MATEMÁTICA EN MODAL
// Suma o resta de dos cifras sin respuestas negativas
// ==========================================
let currentMathAnswer = 0;

function CETA_GenerarOperacionMatematica() {
  const num1 = Math.floor(Math.random() * 90) + 10; // Dos cifras (10 - 99)
  const num2 = Math.floor(Math.random() * 90) + 10; // Dos cifras (10 - 99)
  const esSuma = Math.random() < 0.5;

  if (esSuma) {
    currentMathAnswer = num1 + num2;
    return `${num1} + ${num2}`;
  } else {
    // Asegurar que no existan respuestas negativas (num1 >= num2)
    const mayor = Math.max(num1, num2);
    const menor = Math.min(num1, num2);
    currentMathAnswer = mayor - menor;
    return `${mayor} - ${menor}`;
  }
}

function CETA_MostrarModalMatematico() {
  return new Promise((resolve) => {
    let modal = document.getElementById('math-security-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'math-security-modal';
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-card" style="text-align: center; max-width: 420px;">
          <div style="display:flex; justify-content:flex-end; margin-bottom:-10px;">
            <button type="button" id="math-modal-close" style="background:none; border:none; cursor:pointer; color:var(--text-muted);"><i data-lucide="x" size="20"></i></button>
          </div>
          <div style="width: 56px; height: 56px; background: rgba(37,99,235,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: var(--primary);">
            <i data-lucide="shield-check" size="28"></i>
          </div>
          <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin-bottom: 4px;">Verificación de seguridad</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">Resuelve la operación para iniciar sesión.</p>
          
          <div style="background: var(--input-bg); border: 1px solid var(--border); border-radius: 16px; padding: 1.2rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.2rem;">
            <span id="math-problem-display" style="font-size: 1.8rem; font-weight: 800; color: var(--primary); letter-spacing: 2px;"></span>
            <button type="button" id="math-refresh-btn" title="Cambiar operación" style="background: none; border: none; cursor: pointer; color: var(--primary); padding: 8px;">
              <i data-lucide="refresh-cw" size="20"></i>
            </button>
          </div>

          <div class="input-group" style="text-align: left; margin-bottom: 1.2rem;">
            <label class="input-label">¿Cuál es el resultado?</label>
            <input type="number" id="mathAnswerInput" class="input-field" placeholder="Ingresa tu respuesta" style="text-align: center; font-size: 1.1rem; font-weight: 700;">
          </div>

          <div id="math-error-msg" style="color: #ef4444; font-size: 0.82rem; margin-bottom: 1rem; display: none; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); padding: 8px; border-radius: 8px; font-weight: 600;"></div>

          <div style="display: flex; gap: 10px;">
            <button type="button" id="math-cancel-btn" style="flex: 1; padding: 12px; background: transparent; border: 1px solid var(--border); color: var(--text-muted); border-radius: 12px; font-weight: 700; cursor: pointer;">Cancelar</button>
            <button type="button" id="math-submit-btn" style="flex: 1; padding: 12px; background: var(--primary); border: none; color: white; border-radius: 12px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(37,99,235,0.3);">Continuar</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const problemDisplay = document.getElementById('math-problem-display');
    const answerInput = document.getElementById('mathAnswerInput');
    const errorMsg = document.getElementById('math-error-msg');
    const submitBtn = document.getElementById('math-submit-btn');
    const cancelBtn = document.getElementById('math-cancel-btn');
    const closeBtn = document.getElementById('math-modal-close');
    const refreshBtn = document.getElementById('math-refresh-btn');

    function actualizarProblema() {
      problemDisplay.textContent = CETA_GenerarOperacionMatematica() + " = ?";
      answerInput.value = "";
      errorMsg.style.display = 'none';
      answerInput.focus();
    }

    actualizarProblema();
    modal.classList.add('active');
    if (window.lucide) lucide.createIcons();

    refreshBtn.onclick = actualizarProblema;

    const cerrarModal = (resultado) => {
      modal.classList.remove('active');
      resolve(resultado);
    };

    cancelBtn.onclick = () => cerrarModal(false);
    closeBtn.onclick = () => cerrarModal(false);

    submitBtn.onclick = () => {
      const val = parseInt(answerInput.value.trim(), 10);
      if (isNaN(val) || val !== currentMathAnswer) {
        errorMsg.textContent = "Respuesta incorrecta. Inténtalo de nuevo.";
        errorMsg.style.display = 'block';
        answerInput.focus();
        return;
      }
      cerrarModal(true);
    };

    answerInput.onkeypress = (e) => {
      if (e.key === 'Enter') submitBtn.click();
    };
  });
}

async function CETA_ValidarAcceso(codigoIngresado) {
  const user = ESTUDIANTES_DB.find(u => u.codigo === codigoIngresado);

  if (!user) {
    return { ok: false, msg: "Código de acceso no válido." };
  }

  if (user.activo === 0) {
    return { ok: false, msg: "Tu acceso ha sido deshabilitado. Contacta con administración de CETA Preuniversitario." };
  }

  // Activar verificación por operación matemática emergente
  const verificacionExitosa = await CETA_MostrarModalMatematico();
  if (!verificacionExitosa) {
    return { ok: false, msg: "Verificación de seguridad cancelada o incorrecta." };
  }

  return { ok: true, user: user };
}