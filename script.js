// --- VARIABLES GLOBALES ---
const TOTAL_QUESTIONS = 90;
const TIME_LIMIT = 90 * 60; // 90 minutos
let timeRemaining = TIME_LIMIT;
let timerInterval;
let currentQuestions = [];
let isFinished = false;
let currentUser = null;
let pdfReportData = null; 
let globalCorrectCount = 0;
let globalAiFeedback = "";

// Base de conocimientos estructurada (El sistema seleccionará de aquí hasta llenar las 90)
const questionBankTemplate = [
    {
        topic: "Porcentajes",
        question: "Una computadora tiene un precio de $600 y se aplica un descuento del 10%. ¿Cuál es el precio final?",
        options: ["$540", "$560", "$600", "$660"],
        answer: "$540",
        explanation: "El 10% de 600 es 60. 600 - 60 = 540."
    },
    {
        topic: "Ordenamiento Lógico",
        question: "Ana llegó antes que Beatriz. Carla llegó después de Beatriz. Diana llegó antes que Ana. ¿Cuál fue el orden de llegada?",
        options: ["Diana - Ana - Beatriz - Carla", "Ana - Diana - Beatriz - Carla", "Beatriz - Ana - Diana - Carla", "Carla - Beatriz - Ana - Diana"],
        answer: "Diana - Ana - Beatriz - Carla",
        explanation: "Diana llega primero, luego Ana, seguida de Beatriz, y finalmente Carla."
    },
    {
        topic: "Regla de Tres Simple",
        question: "Si 8 libros cuestan $120, ¿cuánto costarán 14 libros del mismo precio?",
        options: ["$210", "$180", "$200", "$240"],
        answer: "$210",
        explanation: "Regla de 3 directa: (14 * 120) / 8 = 210."
    },
    {
        topic: "Ecuaciones Lineales",
        question: "La edad de un padre es el cuádruple de la de su hijo. Hace 3 años, la edad del padre era el quíntuplo de la del hijo. ¿Cuál es la edad actual del hijo?",
        options: ["12 años", "10 años", "15 años", "18 años"],
        answer: "12 años",
        explanation: "Planteando 4x - 3 = 5(x - 3) se obtiene x = 12."
    },
    {
        topic: "Conjuntos",
        question: "Si A = {1, 2, 3, 4, 5} y B = {3, 4, 5, 6, 7}, ¿cuántos elementos tiene A U B?",
        options: ["7", "5", "8", "10"],
        answer: "7",
        explanation: "A U B = {1, 2, 3, 4, 5, 6, 7}, que contiene 7 elementos únicos."
    },
    {
        topic: "Fracciones",
        question: "Resuelve: 7/8 - 1/3",
        options: ["13/24", "5/24", "17/24", "6/5"],
        answer: "13/24",
        explanation: "MCM es 24. (21/24) - (8/24) = 13/24."
    }
];

// --- FUNCIONES DE INICIALIZACIÓN (SIN DEMORAS) ---
document.addEventListener("DOMContentLoaded", () => {
    // Renderizar iconos
    if(window.lucide) window.lucide.createIcons();
    
    if(typeof CETA_Seguridad_DetectarDispositivo === 'function') {
        CETA_Seguridad_DetectarDispositivo();
    }

    // ELIMINAR EL RETRASO: Ocultar el loader inmediatamente[cite: 4]
    const loader = document.getElementById('loader');
    if(loader) loader.style.display = 'none';

    // Verificación de sesión de forma instantánea
    const session = localStorage.getItem('ceta_session');
    if (session) {
        currentUser = JSON.parse(session);
        initSimulator(); // Iniciar inmediatamente
    } else {
        // Mostrar Login si no hay sesión heredada
        const loginScreen = document.getElementById("login-screen");
        if(loginScreen) loginScreen.style.display = "block";
        
        const loginBtn = document.getElementById("btn-login");
        if(loginBtn) loginBtn.addEventListener("click", handleLogin);
    }
    
    // Listeners Generales
    const reloadBtn = document.getElementById("btn-reload");
    if(reloadBtn) reloadBtn.addEventListener("click", () => {
        if(!isFinished || confirm("El simulador ya terminó. ¿Deseas recargarlo e iniciar un nuevo intento?")) {
            initSimulator();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    const finishBtn = document.getElementById("btn-finish");
    if(finishBtn) finishBtn.addEventListener("click", finishSimulator);

    const pdfBtn = document.getElementById("btn-pdf");
    if(pdfBtn) pdfBtn.addEventListener("click", generatePDFReport);
});

// --- LÓGICA DE AUTENTICACIÓN MANUAL ---
async function handleLogin() {
    const codeInput = document.getElementById("codigoEstudiante").value.trim();
    const errorDiv = document.getElementById("login-error");
    errorDiv.style.display = "none";
    errorDiv.textContent = "";

    if (!codeInput) {
        errorDiv.textContent = "Por favor ingresa tu código de estudiante.";
        errorDiv.style.display = "block";
        return;
    }

    try {
        const result = await CETA_ValidarAcceso(codeInput);
        if (result.ok) {
            currentUser = result.user;
            localStorage.setItem('ceta_session', JSON.stringify(currentUser));
            
            document.getElementById("student-name-display").textContent = currentUser.nombre;
            document.getElementById("login-screen").style.display = "none";
            document.getElementById("simulator-screen").style.display = "flex";
            
            initSimulator();
        } else {
            errorDiv.textContent = result.msg;
            errorDiv.style.display = "block";
        }
    } catch(err) {
        errorDiv.textContent = "Error al verificar acceso: " + err.message;
        errorDiv.style.display = "block";
    }
}

// --- LÓGICA DEL SIMULADOR ---
function initSimulator() {
    // 1. Limpiar estados previos instantáneamente
    clearInterval(timerInterval);
    timeRemaining = TIME_LIMIT;
    isFinished = false;
    updateTimerDisplay();
    
    // 2. Restaurar UI
    const pdfBtn = document.getElementById("btn-pdf");
    if(pdfBtn) pdfBtn.style.display = "none";
    
    const finishBtn = document.getElementById("btn-finish");
    if(finishBtn) finishBtn.disabled = false;
    
    const statusDiv = document.getElementById("ai-status");
    if(statusDiv) statusDiv.style.display = "none";

    // 3. Renderizar nombre si no se ha hecho
    if(currentUser) {
        const nameDisplay = document.getElementById("student-name-display");
        if(nameDisplay) nameDisplay.textContent = currentUser.nombre;
        
        const loginScreen = document.getElementById("login-screen");
        if(loginScreen) loginScreen.style.display = "none";
        
        const simulatorScreen = document.getElementById("simulator-screen");
        if(simulatorScreen) simulatorScreen.style.display = "flex";
    }

    // 4. Iniciar Examen
    generateQuestions();
    renderQuestions();
    startTimer();
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            finishSimulator();
        } else {
            timeRemaining--;
            updateTimerDisplay();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const display = document.getElementById("timer");
    if(!display) return;
    
    const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
    const seconds = (timeRemaining % 60).toString().padStart(2, '0');
    display.textContent = `${minutes}:${seconds}`;
}

// --- GENERACIÓN Y RENDERIZADO ---
function generateQuestions() {
    currentQuestions = [];
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
        const randomIndex = Math.floor(Math.random() * questionBankTemplate.length);
        const q = JSON.parse(JSON.stringify(questionBankTemplate[randomIndex]));
        
        q.options = q.options.sort(() => Math.random() - 0.5);
        q.id = `q_${i}`;
        q.index = i + 1;
        currentQuestions.push(q);
    }
}

function renderQuestions() {
    const container = document.getElementById("questions-container");
    if(!container) return;
    container.innerHTML = "";

    currentQuestions.forEach((q) => {
        const card = document.createElement("div");
        card.className = "question-card";
        card.id = `card-${q.id}`;
        
        let optionsHTML = q.options.map((opt, optIndex) => `
            <label class="option-label" id="label-${q.id}-o${optIndex}">
                <input type="radio" name="${q.id}" value="${opt}">
                ${opt}
            </label>
        `).join("");

        card.innerHTML = `
            <h3>Pregunta ${q.index}: ${q.question}</h3>
            <div class="options-group">
                ${optionsHTML}
            </div>
        `;
        container.appendChild(card);
    });
}

// --- MOTOR DE ANÁLISIS INTEGRADO ---
function generateInternalDiagnosis(correctCount, totalCount, feedbackData, studentName) {
    const percentage = (correctCount / totalCount) * 100;
    
    const sortedTopics = Object.entries(feedbackData)
        .sort((a, b) => b[1] - a[1]);
        
    let analysisText = "";
    
    if (percentage >= 90) {
        analysisText += `¡Sobresaliente, ${studentName}! Tienes un dominio excelente del Razonamiento Lógico. Has demostrado una gran capacidad deductiva y analítica. `;
    } else if (percentage >= 70) {
        analysisText += `Buen trabajo, ${studentName}. Tienes bases matemáticas y lógicas sólidas, aunque hay un pequeño margen de mejora. `;
    } else if (percentage >= 50) {
        analysisText += `Esfuerzo aceptable, ${studentName}. Estás en buen camino, pero necesitas reforzar algunos conceptos fundamentales para asegurar tu pase en el examen de admisión. `;
    } else {
        analysisText += `No te desanimes, ${studentName}. Este simulador es un punto de partida para identificar tus debilidades y enfocar tu estudio. `;
    }

    if (sortedTopics.length > 0) {
        analysisText += `El sistema ha detectado mediante tu patrón de respuestas que necesitas enfocarte urgentemente en repasar los siguientes temas: `;
        const topicStrings = sortedTopics.map(t => `${t[0]} (tuviste ${t[1]} error${t[1] > 1 ? 'es' : ''})`);
        analysisText += topicStrings.join(', ') + `. `;
        analysisText += `Te sugerimos revisar la teoría de CETA Preuniversitario y realizar ejercicios prácticos específicos en estas áreas antes de tu próximo intento.`;
    } else {
        analysisText += `¡No tuviste ningún error! Estás perfectamente preparado para la prueba real. Sigue manteniendo este nivel.`;
    }

    return analysisText;
}

// --- FINALIZAR SIMULADOR Y CALIFICAR ---
function finishSimulator() {
    if (isFinished) return;
    
    const confirmacion = confirm("¿Estás seguro de que deseas finalizar el simulador y calificar tus respuestas?");
    if (!confirmacion) return;

    isFinished = true;
    clearInterval(timerInterval);
    
    document.getElementById("btn-finish").disabled = true;
    
    const inputs = document.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => input.disabled = true);
    
    globalCorrectCount = 0;
    const reportData = [];
    const topicsFeedback = {}; 

    currentQuestions.forEach((q) => {
        const selectedRadio = document.querySelector(`input[name="${q.id}"]:checked`);
        const studentAnswer = selectedRadio ? selectedRadio.value : "Sin responder";
        const isCorrect = studentAnswer === q.answer;
        
        if (isCorrect) {
            globalCorrectCount++;
        } else {
            topicsFeedback[q.topic] = (topicsFeedback[q.topic] || 0) + 1;
        }

        const optionsLabels = document.querySelectorAll(`input[name="${q.id}"]`);
        optionsLabels.forEach(radio => {
            const parentLabel = radio.parentElement;
            if (radio.value === q.answer) {
                parentLabel.classList.add('correct');
            }
            if (radio.checked && radio.value !== q.answer) {
                parentLabel.classList.add('incorrect');
            }
        });

        reportData.push([
            q.index,
            q.question,
            studentAnswer,
            isCorrect ? "Correcta" : "Incorrecta",
            q.answer,
            q.explanation
        ]);
    });
    
    pdfReportData = reportData;

    const statusDiv = document.getElementById("ai-status");
    statusDiv.style.display = "block";
    
    const calificacionBase10 = ((globalCorrectCount / TOTAL_QUESTIONS) * 10).toFixed(2);
    document.getElementById("ai-score-display").textContent = `Calificación Final: ${calificacionBase10} / 10.00`;
    
    const feedbackDiv = document.getElementById("ai-feedback-display");
    const userName = currentUser ? currentUser.nombre.split(' ')[0] : "Estudiante";
    globalAiFeedback = generateInternalDiagnosis(globalCorrectCount, TOTAL_QUESTIONS, topicsFeedback, userName);
    
    feedbackDiv.innerHTML = `<strong>Aciertos: ${globalCorrectCount} de ${TOTAL_QUESTIONS}.</strong><br><br>${globalAiFeedback}`;
    document.getElementById("btn-pdf").style.display = "inline-block";
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- GENERACIÓN DE PDF ---
function generatePDFReport() {
    if (!pdfReportData) return;
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("landscape");

    doc.setFontSize(18);
    doc.text("Reporte de Simulador - Razonamiento Lógico (CETA)", 14, 20);
    
    const nombre = currentUser ? currentUser.nombre : "Desconocido";
    const codigo = currentUser ? currentUser.codigo : "N/A";

    doc.setFontSize(12);
    doc.text(`Estudiante: ${nombre}`, 14, 28);
    doc.text(`Código: ${codigo}`, 14, 34);
    
    const calificacionBase10 = ((globalCorrectCount / TOTAL_QUESTIONS) * 10).toFixed(2);
    doc.text(`Calificación Final: ${calificacionBase10} / 10.00 (${globalCorrectCount} aciertos)`, 14, 40);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 51, 153);
    const splitAiText = doc.splitTextToSize(`Diagnóstico de Rendimiento:
${globalAiFeedback}`, 260);
    doc.text(splitAiText, 14, 50);

    doc.autoTable({
        startY: 55 + (splitAiText.length * 5),
        head: [['#', 'Pregunta', 'Respuesta Estudiante', 'Estado', 'Respuesta Correcta', 'Explicación']],
        body: pdfReportData,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
            1: { cellWidth: 60 },
            5: { cellWidth: 70 }
        },
        didParseCell: function(data) {
            if (data.section === 'body' && data.column.index === 3) {
                if (data.cell.raw === 'Correcta') {
                    data.cell.styles.textColor = [16, 185, 129]; 
                } else {
                    data.cell.styles.textColor = [239, 68, 68];
                }
            }
        }
    });

    doc.save(`Reporte_Simulador_${codigo}.pdf`);
}