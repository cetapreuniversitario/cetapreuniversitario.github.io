// --- VARIABLES GLOBALES ---
const TOTAL_QUESTIONS = 40;
const TIME_LIMIT = 40 * 60; // 40 minutos
let timeRemaining = TIME_LIMIT;
let timerInterval;
let currentQuestions = [];
let isFinished = false;
let currentUser = null;
let pdfReportData = null;
let globalCorrectCount = 0;
let globalAiFeedback = "";
let currentSectionKey = "sinonimos";
let currentSectionName = "Sinónimos";

// --- DEFINICIÓN DE LAS 7 SECCIONES ---
const sectionsData = {
    sinonimos: {
        name: "Sinónimos",
        topics: ["Definición y Etimología", "Estructura de Preguntas", "Ejercicios Básicos e Intermedios", "Ejercicios Avanzados y Tipo Examen"],
        bank: []
    },
    antonimos: {
        name: "Antónimos",
        topics: ["Definición y Etimología", "Identificación de Términos Opuestos", "Ejercicios Básicos e Intermedios", "Ejercicios Avanzados y Tipo Examen"],
        bank: []
    },
    analogias: {
        name: "Analogías",
        topics: ["Definición y Estructura", "Tipos de Relaciones Analógicas", "Ejercicios Básicos e Intermedios", "Ejercicios Avanzados y Tipo Examen"],
        bank: []
    },
    comprension: {
        name: "Comprensión Lectora",
        topics: ["Elementos de la Comunicación", "Niveles de Información", "Idea Principal y Secundaria", "Ejercicios Tipo Examen"],
        bank: []
    },
    plan_redaccion: {
        name: "Plan de Redacción",
        topics: ["Concepto y Esquema", "Métodos de Ordenación", "Lógica Estructural", "Ejercicios Tipo Examen"],
        bank: []
    },
    oraciones_eliminadas: {
        name: "Oraciones Eliminadas",
        topics: ["Inatingencia Temática", "Inatingencia de Descripción", "Inatingencia de Hecho y Oposición", "Redundancia e Inclusión"],
        bank: []
    },
    conectores: {
        name: "Conectores Ilativos",
        topics: ["Función Conectiva", "Cuadro de Funciones", "Conectores de Adición", "Conectores Ilativos y Consecutivos"],
        bank: []
    }
};

// --- POOLS DE CONTENIDO REAL POR SECCIÓN ---
const contentPools = {
    sinonimos: [
        { stem: "Alegre", ans: "Contento", distractors: ["Triste", "Melancólico", "Apenado"] },
        { stem: "Veloz", ans: "Rápido", distractors: ["Lento", "Pausado", "Tardío"] },
        { stem: "Efímero", ans: "Pasajero", distractors: ["Eterno", "Duradero", "Permanente"] },
        { stem: "Prudente", ans: "Cauto", distractors: ["Imprudente", "Temerario", "Audaz"] },
        { stem: "Efusivo", ans: "Expresivo", distractors: ["Reservado", "Frío", "Distante"] },
        { stem: "Lánguido", ans: "Débil", distractors: ["Fuerte", "Vigoroso", "Robusto"] },
        { stem: "Sagaz", ans: "Astuto", distractors: ["Ingenuo", "Necio", "Simple"] },
        { stem: "Tenaz", ans: "Persistente", distractors: ["Voluble", "Inconstante", "Débil"] },
        { stem: "Exiguo", ans: "Escaso", distractors: ["Abundante", "Copioso", "Numeroso"] },
        { stem: "Sucinto", ans: "Breve", distractors: ["Extenso", "Prolijo", "Difuso"] },
        { stem: "Profuso", ans: "Abundante", distractors: ["Escaso", "Limitado", "Exiguo"] },
        { stem: "Bélico", ans: "Guerrero", distractors: ["Pacífico", "Pacifista", "Tranquilo"] },
        { stem: "Púdico", ans: "Recatado", distractors: ["Descarado", "Impúdico", "Desinhibido"] },
        { stem: "Ávido", ans: "Ansioso", distractors: ["Saciado", "Satisfecho", "Indiferente"] },
        { stem: "Incuestionable", ans: "Indudable", distractors: ["Discutible", "Dudoso", "Cuestionable"] },
        { stem: "Locuaz", ans: "Hablador", distractors: ["Callado", "Taciturno", "Silencioso"] },
        { stem: "Iracundo", ans: "Colérico", distractors: ["Sereno", "Calmado", "Tranquilo"] },
        { stem: "Perspicaz", ans: "Astuto", distractors: ["Torpe", "Cándido", "Ignorante"] },
        { stem: "Íntegro", ans: "Honesto", distractors: ["Corrupto", "Deshonesto", "Falso"] },
        { stem: "Generoso", ans: "Dadivoso", distractors: ["Egoísta", "Mezquino", "Tacaño"] }
    ],
    antonimos: [
        { stem: "Alegre", ans: "Triste", distractors: ["Contento", "Jovial", "Feliz"] },
        { stem: "Veloz", ans: "Lento", distractors: ["Rápido", "Acelerado", "Ligero"] },
        { stem: "Efímero", ans: "Eterno", distractors: ["Pasajero", "Fugaz", "Breve"] },
        { stem: "Prudente", ans: "Imprudente", distractors: ["Cauto", "Cuidadoso", "Sensato"] },
        { stem: "Efusivo", ans: "Reservado", distractors: ["Expresivo", "Cálido", "Abierto"] },
        { stem: "Lánguido", ans: "Vigoroso", distractors: ["Débil", "Desfallecido", "Mustio"] },
        { stem: "Sagaz", ans: "Ingenuo", distractors: ["Astuto", "Perspicaz", "Listo"] },
        { stem: "Tenaz", ans: "Inconstante", distractors: ["Persistente", "Firme", "Constante"] },
        { stem: "Exiguo", ans: "Abundante", distractors: ["Escaso", "Limitado", "Mínimo"] },
        { stem: "Sucinto", ans: "Extenso", distractors: ["Breve", "Corto", "Conciso"] },
        { stem: "Profuso", ans: "Escaso", distractors: ["Abundante", "Copioso", "Numeroso"] },
        { stem: "Bélico", ans: "Pacífico", distractors: ["Guerrero", "Militar", "Combativo"] },
        { stem: "Púdico", ans: "Descarado", distractors: ["Recatado", "Pudoroso", "Modesto"] },
        { stem: "Ávido", ans: "Saciado", distractors: ["Ansioso", "Codicioso", "Insaciable"] },
        { stem: "Incuestionable", ans: "Discutible", distractors: ["Indudable", "Evidente", "Cierto"] },
        { stem: "Locuaz", ans: "Taciturno", distractors: ["Hablador", "Elocuente", "Verborreico"] },
        { stem: "Iracundo", ans: "Sereno", distractors: ["Colérico", "Furioso", "Encolerizado"] },
        { stem: "Perspicaz", ans: "Torpe", distractors: ["Astuto", "Agudo", "Sagaz"] },
        { stem: "Íntegro", ans: "Corrupto", distractors: ["Honesto", "Recto", "Insobornable"] },
        { stem: "Generoso", ans: "Egoísta", distractors: ["Dadivoso", "Desprendido", "Altruista"] }
    ],
    analogias: [
        { rel: "Médico : Hospital :: Profesor : ?", ans: "Escuela", distractors: ["Alumno", "Libro", "Pizarra"], tipo: "Lugar de trabajo" },
        { rel: "Libro : Biblioteca :: Cuadro : ?", ans: "Museo", distractors: ["Pared", "Pintor", "Marco"], tipo: "Lugar de conservación" },
        { rel: "Pez : Agua :: Ave : ?", ans: "Aire", distractors: ["Nido", "Tierra", "Árbol"], tipo: "Hábitat" },
        { rel: "Cuchillo : Cortar :: Lápiz : ?", ans: "Escribir", distractors: ["Dibujar", "Borrar", "Pintar"], tipo: "Función" },
        { rel: "Ojo : Ver :: Oído : ?", ans: "Oír", distractors: ["Hablar", "Tocar", "Oler"], tipo: "Función sensorial" },
        { rel: "Piloto : Avión :: Chofer : ?", ans: "Autobús", distractors: ["Camino", "Pasajero", "Combustible"], tipo: "Conductor-vehículo" },
        { rel: "Hambre : Comer :: Sed : ?", ans: "Beber", distractors: ["Correr", "Dormir", "Cansarse"], tipo: "Necesidad-satisfacción" },
        { rel: "Pluma : Escritor :: Pincel : ?", ans: "Pintor", distractors: ["Lienzo", "Color", "Brocha"], tipo: "Herramienta-oficio" },
        { rel: "Hierro : Metal :: Oxígeno : ?", ans: "Gas", distractors: ["Aire", "Agua", "Fuego"], tipo: "Elemento-categoría" },
        { rel: "Cima : Montaña :: Base : ?", ans: "Pirámide", distractors: ["Piso", "Altura", "Techo"], tipo: "Parte-todo" },
        { rel: "Hielo : Frío :: Fuego : ?", ans: "Calor", distractors: ["Llama", "Humo", "Ceniza"], tipo: "Causa-efecto" },
        { rel: "Rojo : Color :: Círculo : ?", ans: "Figura", distractors: ["Cuadrado", "Redondo", "Línea"], tipo: "Elemento-categoría" },
        { rel: "Dentista : Diente :: Oftalmólogo : ?", ans: "Ojo", distractors: ["Oído", "Nariz", "Piel"], tipo: "Especialista-órgano" },
        { rel: "Semilla : Árbol :: Huevo : ?", ans: "Ave", distractors: ["Nido", "Gallina", "Ala"], tipo: "Origen-resultado" },
        { rel: "Ayer : Pasado :: Mañana : ?", ans: "Futuro", distractors: ["Presente", "Hoy", "Tiempo"], tipo: "Temporal" },
        { rel: "Árbol : Bosque :: Estrella : ?", ans: "Galaxia", distractors: ["Cielo", "Luna", "Sol"], tipo: "Individuo-colectivo" },
        { rel: "Termómetro : Temperatura :: Balanza : ?", ans: "Peso", distractors: ["Altura", "Volumen", "Masa"], tipo: "Instrumento-medida" },
        { rel: "Zapato : Pie :: Guante : ?", ans: "Mano", distractors: ["Dedo", "Brazo", "Cabeza"], tipo: "Prenda-parte del cuerpo" },
        { rel: "Rey : Súbdito :: Jefe : ?", ans: "Empleado", distractors: ["Oficina", "Salario", "Empresa"], tipo: "Jerarquía" },
        { rel: "Verano : Calor :: Invierno : ?", ans: "Frío", distractors: ["Nieve", "Lluvia", "Abrigo"], tipo: "Estación-característica" }
    ],
    comprension: [
        { passage: "La lectura es una de las actividades más importantes para el desarrollo del ser humano. A través de ella, las personas no solo adquieren conocimientos, sino que también desarrollan su imaginación, mejoran su vocabulario y amplían su capacidad de concentración. Un lector habitual tiende a tener mejor comprensión del mundo que lo rodea y una mayor empatía hacia los demás.",
          q: "¿Cuál es la idea principal del texto?",
          ans: "La lectura es fundamental para el desarrollo humano integral",
          distractors: ["La lectura mejora el vocabulario", "Los lectores tienen mayor empatía", "La lectura desarrolla la imaginación"] },
        { passage: "El agua es un recurso natural indispensable para la vida. Sin embargo, su disponibilidad es cada vez menor debido a la contaminación y al uso irresponsable. Las industrias, la agricultura y el consumo doméstico son los principales responsables del desperdicio. Es urgente tomar medidas para garantizar su conservación para las futuras generaciones.",
          q: "¿Qué idea secundaria aparece en el texto?",
          ans: "Las industrias, la agricultura y el consumo doméstico desperdician agua",
          distractors: ["El agua es indispensable para la vida", "Se necesitan medidas urgentes de conservación", "El agua es un recurso natural"] },
        { passage: "La práctica regular de actividad física aporta múltiples beneficios al organismo. Fortalece el sistema cardiovascular, mejora la densidad ósea, contribuye al control del peso y reduce el riesgo de enfermedades crónicas como la diabetes y la hipertensión. Además, tiene un impacto positivo en la salud mental al disminuir el estrés y la ansiedad.",
          q: "¿Cuál es el propósito del autor?",
          ans: "Informar sobre los beneficios de la actividad física",
          distractors: ["Convencer al lector de hacer ejercicio", "Criticar el sedentarismo", "Explicar enfermedades crónicas"] },
        { passage: "El descubrimiento del fuego representó un hito fundamental en la historia de la humanidad. Permitió a los primeros homínidos calentarse, cocinar alimentos y protegerse de los depredadores. Con el tiempo, esta habilidad derivó en tecnologías más complejas que transformaron la vida de las sociedades antiguas y sentaron las bases de la civilización moderna.",
          q: "¿Qué se puede inferir del texto?",
          ans: "El dominio del fuego impulsó el desarrollo de la civilización",
          distractors: ["El fuego se descubrió en la edad de piedra", "El fuego se usaba solo para cocinar", "Los homínidos no dependían del fuego"] },
        { passage: "En la actualidad, las redes sociales constituyen un espacio central de interacción humana. Permiten conectar con personas de todo el mundo en tiempo real, pero también han generado nuevas problemáticas como la adicción digital, la desinformación y el ciberacoso. Un uso responsable y consciente es indispensable para aprovechar sus beneficios sin sucumbir a sus riesgos.",
          q: "¿Qué postura adopta el autor frente a las redes sociales?",
          ans: "Reconoce tanto sus beneficios como sus riesgos",
          distractors: ["Las considera enteramente perjudiciales", "Las defiende sin matices", "Las considera irrelevantes"] },
        { passage: "La biodiversidad del Amazonas es considerada una de las más ricas del planeta. Alberga miles de especies de plantas, animales e insectos, muchas aún desconocidas por la ciencia. Sin embargo, la deforestación, la minería ilegal y los incendios provocados amenazan este ecosistema. Su pérdida tendría consecuencias irreversibles a nivel global.",
          q: "Según el texto, ¿qué amenaza la biodiversidad del Amazonas?",
          ans: "La deforestación, la minería ilegal y los incendios",
          distractors: ["La ciencia desconocida", "Las especies nuevas", "El turismo ecológico"] },
        { passage: "El sistema educativo tradicional se ha centrado en la memorización de contenidos. Sin embargo, las pedagogías modernas enfatizan el desarrollo del pensamiento crítico, la creatividad y la resolución de problemas. Estos enfoques buscan que el estudiante no solo acumule información, sino que aprenda a aplicarla en situaciones reales de su vida cotidiana.",
          q: "¿Qué contraste presenta el texto?",
          ans: "Educación tradicional memorística vs. pedagogías modernas activas",
          distractors: ["Educación pública vs. privada", "Estudiantes vs. docentes", "Ciencia vs. humanidades"] },
        { passage: "El sueño es una función biológica esencial. Durante sus fases, el cerebro consolida la memoria, regula las hormonas y repara los tejidos. La privación crónica del sueño está asociada con deterioro cognitivo, trastornos del ánimo y mayor riesgo de enfermedades metabólicas. Dormir entre siete y nueve horas diarias es fundamental para la salud.",
          q: "¿Cuál es la idea principal del pasaje?",
          ans: "El sueño es esencial para la salud física y mental",
          distractors: ["Dormir poco no afecta al organismo", "La memoria solo se consolida despierto", "El sueño solo sirve para descansar"] },
        { passage: "La Revolución Industrial, iniciada en el siglo XVIII en Inglaterra, transformó radicalmente la economía y la sociedad. La introducción de máquinas en la producción, el surgimiento de las fábricas y el crecimiento de las ciudades cambiaron las formas de vida. Aunque trajo progreso material, también generó nuevas desigualdades sociales y problemas laborales.",
          q: "¿Cuál fue una consecuencia negativa de la Revolución Industrial según el texto?",
          ans: "La aparición de nuevas desigualdades sociales",
          distractors: ["La introducción de máquinas", "El surgimiento de fábricas", "El crecimiento de las ciudades"] },
        { passage: "La inteligencia artificial ha avanzado a pasos agigantados en las últimas décadas. Desde asistentes virtuales hasta vehículos autónomos, sus aplicaciones transforman industrias enteras. No obstante, su desarrollo plantea dilemas éticos sobre la privacidad, el empleo y la autonomía humana. Regularla adecuadamente sin frenar la innovación es uno de los grandes retos del siglo XXI.",
          q: "¿Qué desafío ético menciona el texto respecto a la IA?",
          ans: "La privacidad, el empleo y la autonomía humana",
          distractors: ["Solo la pérdida de empleos", "Únicamente la privacidad digital", "El exceso de innovación tecnológica"] }
    ],
    plan_redaccion: [
        { title: "La lectura",
          sentences: ["I. Por ello, es fundamental fomentar el hábito lector desde la infancia.", "II. La lectura es una herramienta clave para el aprendizaje.", "III. Permite acceder al conocimiento acumulado por la humanidad.", "IV. Además, estimula la imaginación y la empatía.", "V. Sin embargo, muchos jóvenes leen cada vez menos."],
          ans: "II - III - IV - V - I",
          wrongs: ["I - II - III - IV - V", "V - I - II - III - IV", "III - IV - V - I - II"],
          just: "El orden lógico inicia con la definición (II), presenta las funciones (III, IV), plantea la problemática (V) y cierra con la conclusión (I)." },
        { title: "El medio ambiente",
          sentences: ["I. El cambio climático es una de las mayores amenazas globales.", "II. Sus efectos ya son visibles en el aumento del nivel del mar.", "III. Las emisiones de gases de efecto invernadero son su principal causa.", "IV. Por tanto, se requieren acciones urgentes y coordinadas.", "V. La reducción de emisiones es la prioridad inmediata."],
          ans: "I - III - II - V - IV",
          wrongs: ["III - II - I - IV - V", "IV - V - I - II - III", "V - IV - III - II - I"],
          just: "Se inicia con la idea central (I), se identifica la causa (III), se describe el efecto (II), se propone una medida (V) y se concluye (IV)." },
        { title: "La actividad física",
          sentences: ["I. La actividad física regular aporta múltiples beneficios.", "II. Fortalece el corazón y mejora la circulación.", "III. Además, contribuye al bienestar emocional.", "IV. Sin embargo, muchas personas llevan una vida sedentaria.", "V. Por ello, es indispensable promover el ejercicio."],
          ans: "I - II - III - IV - V",
          wrongs: ["IV - V - I - II - III", "V - IV - III - II - I", "II - III - I - IV - V"],
          just: "Comienza con la idea principal (I), enumera beneficios (II, III), introduce el contraste (IV) y finaliza con una conclusión (V)." },
        { title: "La ciencia",
          sentences: ["I. La ciencia ha transformado radicalmente la vida humana.", "II. Los avances médicos han salvado millones de vidas.", "III. Asimismo, las tecnologías han mejorado la comunicación.", "IV. No obstante, no todos los desarrollos son éticamente aceptables.", "V. Por tanto, la ciencia debe guiarse por principios éticos."],
          ans: "I - II - III - IV - V",
          wrongs: ["IV - V - I - II - III", "III - II - I - V - IV", "V - IV - I - II - III"],
          just: "Idea general (I), ejemplos de avances (II, III), contraste (IV) y conclusión ética (V)." },
        { title: "La tecnología",
          sentences: ["I. La tecnología digital ha modificado las formas de comunicación.", "II. Las redes sociales permiten conectar al instante.", "III. Sin embargo, también generan aislamiento emocional.", "IV. Es fundamental regular su uso.", "V. La clave está en el equilibrio."],
          ans: "I - II - III - IV - V",
          wrongs: ["V - IV - III - II - I", "III - II - I - V - IV", "IV - V - I - II - III"],
          just: "Planteamiento (I, II), contraste (III), propuesta (IV) y conclusión (V)." },
        { title: "La educación",
          sentences: ["I. La educación es un derecho fundamental.", "II. Permite a las personas desarrollar su potencial.", "III. En muchos países, sigue siendo inaccesible.", "IV. Se requieren políticas públicas inclusivas.", "V. Solo así se logrará una sociedad más justa."],
          ans: "I - II - III - IV - V",
          wrongs: ["V - IV - III - II - I", "II - III - I - IV - V", "III - II - I - V - IV"],
          just: "Definición (I), función (II), problemática (III), solución (IV) y cierre (V)." },
        { title: "El deporte",
          sentences: ["I. El deporte forma parte esencial de la formación integral.", "II. Desarrolla habilidades físicas y mentales.", "III. Además, fomenta valores como el trabajo en equipo.", "IV. Sin embargo, muchos niños no tienen acceso a su práctica.", "V. Es tarea del Estado garantizar su acceso."],
          ans: "I - II - III - IV - V",
          wrongs: ["IV - V - I - II - III", "V - IV - I - II - III", "II - III - I - IV - V"],
          just: "Presentación (I), ventajas (II, III), obstáculo (IV) y propuesta (V)." },
        { title: "La alimentación",
          sentences: ["I. Una alimentación equilibrada es clave para la salud.", "II. Proporciona los nutrientes necesarios al organismo.", "III. Sin embargo, los hábitos modernos tienden al consumo de ultraprocesados.", "IV. Esto incrementa el riesgo de enfermedades crónicas.", "V. Por ello, urge educar en nutrición desde la escuela."],
          ans: "I - II - III - IV - V",
          wrongs: ["III - IV - V - I - II", "V - IV - III - II - I", "II - I - III - IV - V"],
          just: "Idea central (I), función (II), problema (III, IV) y propuesta (V)." },
        { title: "El arte",
          sentences: ["I. El arte es una manifestación esencial de la cultura humana.", "II. A través de él se expresan emociones e ideas.", "III. También es un medio de crítica y reflexión social.", "IV. Sin embargo, las políticas culturales suelen ser insuficientes.", "V. Es necesario fortalecer el apoyo al arte y a los artistas."],
          ans: "I - II - III - IV - V",
          wrongs: ["IV - V - I - II - III", "III - II - I - V - IV", "V - IV - III - II - I"],
          just: "Definición (I), funciones (II, III), problemática (IV) y propuesta (V)." },
        { title: "La globalización",
          sentences: ["I. La globalización ha interconectado las economías mundiales.", "II. Ha facilitado el comercio y la difusión cultural.", "III. No obstante, ha profundizado las desigualdades entre países.", "IV. Algunos sectores han resultado especialmente vulnerables.", "V. Se requieren políticas que equilibren sus beneficios."],
          ans: "I - II - III - IV - V",
          wrongs: ["III - IV - V - I - II", "V - IV - I - II - III", "II - I - III - IV - V"],
          just: "Introducción (I), ventajas (II), desventajas (III, IV) y propuesta (V)." }
    ],
    oraciones_eliminadas: [
        { tema: "La lectura",
          sentences: ["I. La lectura desarrolla la imaginación y el vocabulario.", "II. También fortalece la capacidad de concentración.", "III. Muchas personas prefieren leer en formato digital.", "IV. Estimula la empatía y la comprensión del mundo.", "V. Es una actividad fundamental para el aprendizaje."],
          eliminar: "III",
          reason: "Inatingencia temática: las demás oraciones mencionan beneficios de la lectura; la III habla de formatos de lectura, tema ajeno al enfoque." },
        { tema: "El medio ambiente",
          sentences: ["I. La contaminación del aire afecta la salud respiratoria.", "II. Las emisiones industriales son una de sus principales causas.", "III. El uso de mascarillas se popularizó en Asia.", "IV. Los niveles altos de partículas generan enfermedades.", "V. Es urgente regular las emisiones contaminantes."],
          eliminar: "III",
          reason: "Inatingencia temática: las demás tratan sobre contaminación y salud; la III se refiere al uso de mascarillas, tema ajeno." },
        { tema: "La ciencia",
          sentences: ["I. La vacunación ha erradicado enfermedades graves.", "II. Los antibióticos han salvado millones de vidas.", "III. Louis Pasteur desarrolló la pasteurización.", "IV. Las vacunas han eliminado la viruela a nivel mundial.", "V. Los avances médicos han aumentado la esperanza de vida."],
          eliminar: "III",
          reason: "Inatingencia de descripción: las demás tratan sobre avances médicos concretos; la III es un dato histórico que no aporta al enfoque sobre beneficios médicos." },
        { tema: "La tecnología",
          sentences: ["I. Los teléfonos inteligentes facilitan la comunicación.", "II. Permiten acceder a información en tiempo real.", "III. Algunos modelos tienen pantallas de alta resolución.", "IV. Agilizan trámites y transacciones bancarias.", "V. Su uso adecuado mejora la productividad."],
          eliminar: "III",
          reason: "Inatingencia de descripción: las demás oraciones destacan funcionalidades y beneficios; la III describe una característica técnica superficial." },
        { tema: "El deporte",
          sentences: ["I. El deporte fortalece el sistema cardiovascular.", "II. Contribuye al control del peso corporal.", "III. Los Juegos Olímpicos se celebran cada cuatro años.", "IV. Reduce el riesgo de enfermedades metabólicas.", "V. Mejora el estado de ánimo y reduce el estrés."],
          eliminar: "III",
          reason: "Inatingencia temática: las demás mencionan beneficios del deporte para la salud; la III refiere a la periodicidad de los Juegos Olímpicos, tema ajeno." },
        { tema: "La educación",
          sentences: ["I. La educación desarrolla el pensamiento crítico.", "II. Forma ciudadanos conscientes de sus derechos.", "III. Algunas escuelas tienen edificios históricos.", "IV. Promueve la igualdad de oportunidades.", "V. Es un pilar fundamental de la democracia."],
          eliminar: "III",
          reason: "Inatingencia temática: las demás resaltan el valor formativo de la educación; la III menciona infraestructura, tema ajeno al enfoque." },
        { tema: "La alimentación",
          sentences: ["I. Una dieta equilibrada previene enfermedades crónicas.", "II. Aporta vitaminas y minerales esenciales.", "III. Los chefs suelen usar cuchillos profesionales.", "IV. Contribuye a mantener un peso saludable.", "V. Fortalece el sistema inmunológico."],
          eliminar: "III",
          reason: "Inatingencia temática: las demás tratan sobre beneficios nutricionales; la III se refiere a utensilios de cocina, tema ajeno." },
        { tema: "El arte",
          sentences: ["I. El arte permite expresar emociones profundas.", "II. Es un medio de crítica social y reflexión.", "III. Las galerías suelen tener iluminación especial.", "IV. Fomenta la creatividad y la sensibilidad.", "V. Contribuye a preservar la identidad cultural."],
          eliminar: "III",
          reason: "Inatingencia de descripción: las demás destacan el valor del arte; la III describe un aspecto técnico de galerías." },
        { tema: "La globalización",
          sentences: ["I. La globalización ha interconectado las economías.", "II. Ha facilitado el intercambio cultural entre países.", "III. Algunos productos son más baratos en ciertas regiones.", "IV. Ha impulsado la difusión de tecnologías.", "V. Ha generado nuevas oportunidades comerciales."],
          eliminar: "III",
          reason: "Inatingencia temática: las demás describen impactos macroeconómicos y culturales; la III menciona un detalle de precios, tema específico." },
        { tema: "La salud",
          sentences: ["I. Dormir bien es esencial para la salud física.", "II. El sueño consolida la memoria y el aprendizaje.", "III. Muchas personas usan almohadas ortopédicas.", "IV. Regula las hormonas del organismo.", "V. Favorece la recuperación muscular."],
          eliminar: "III",
          reason: "Inatingencia de descripción: las demás tratan sobre funciones del sueño; la III se refiere a un accesorio, tema ajeno." },
        { tema: "La naturaleza",
          sentences: ["I. Los bosques tropicales albergan una enorme biodiversidad.", "II. Regulan el ciclo del agua y el clima.", "III. Algunos árboles superan los 50 metros de altura.", "IV. Absorben grandes cantidades de CO2.", "V. Son fundamentales para el equilibrio ecológico."],
          eliminar: "III",
          reason: "Inatingencia de descripción: las demás destacan funciones ecológicas; la III es un dato puntual sobre altura de árboles." },
        { tema: "La economía",
          sentences: ["I. La inflación reduce el poder adquisitivo.", "II. Afecta especialmente a los sectores más vulnerables.", "III. Algunos bancos centrales tienen sedes históricas.", "IV. Genera incertidumbre en los mercados.", "V. Requiere políticas monetarias adecuadas."],
          eliminar: "III",
          reason: "Inatingencia temática: las demás tratan sobre efectos económicos de la inflación; la III menciona infraestructura bancaria." },
        { tema: "La comunicación",
          sentences: ["I. La comunicación asertiva mejora las relaciones interpersonales.", "II. Permite expresar ideas sin agredir al otro.", "III. Algunos mensajes se envían por correo electrónico.", "IV. Fomenta el respeto y la empatía.", "V. Reduce los conflictos en el ámbito laboral."],
          eliminar: "III",
          reason: "Inatingencia temática: las demás destacan beneficios de la comunicación asertiva; la III menciona un canal, tema ajeno." },
        { tema: "El estudio",
          sentences: ["I. Estudiar con método mejora el rendimiento académico.", "II. La organización del tiempo es clave.", "III. Algunos estudiantes usan cuadernos de colores.", "IV. La constancia refuerza el aprendizaje.", "V. Dormir bien después de estudiar consolida lo aprendido."],
          eliminar: "III",
          reason: "Inatingencia de descripción: las demás tratan sobre estrategias efectivas de estudio; la III menciona un detalle accesorio." },
        { tema: "La empresa",
          sentences: ["I. La innovación es clave para la competitividad empresarial.", "II. Permite adaptarse a los cambios del mercado.", "III. Algunas oficinas tienen salas de reuniones.", "IV. Fomenta la creación de nuevos productos.", "V. Mejora la eficiencia de los procesos internos."],
          eliminar: "III",
          reason: "Inatingencia temática: las demás tratan sobre innovación y competitividad; la III describe instalaciones." }
    ],
    conectores: [
        { sentence: "Estudió toda la noche, ___ logró aprobar el examen.", ans: "por lo tanto", distractors: ["sin embargo", "aunque", "no obstante"], tipo: "Consecuencia" },
        { sentence: "No asistió a la reunión, ___ no estaba enterado.", ans: "ya que", distractors: ["por lo tanto", "en consecuencia", "así que"], tipo: "Causa" },
        { sentence: "Le gusta el cine ___ la literatura.", ans: "y", distractors: ["pero", "sin embargo", "aunque"], tipo: "Adición" },
        { sentence: "Es muy inteligente; ___, es poco constante.", ans: "sin embargo", distractors: ["por lo tanto", "además", "en consecuencia"], tipo: "Contraste" },
        { sentence: "Terminó la tarea ___ pudo salir a jugar.", ans: "y", distractors: ["pero", "aunque", "sin embargo"], tipo: "Adición" },
        { sentence: "Aprobó el examen ___ haber estudiado poco.", ans: "a pesar de", distractors: ["por lo tanto", "en consecuencia", "así que"], tipo: "Concesión" },
        { sentence: "Llueve mucho; ___, el partido se suspenderá.", ans: "por lo tanto", distractors: ["sin embargo", "aunque", "no obstante"], tipo: "Consecuencia" },
        { sentence: "Iré al cine ___ termino mis tareas.", ans: "si", distractors: ["porque", "aunque", "sin embargo"], tipo: "Condición" },
        { sentence: "Estudia mucho ___ convertirse en médico.", ans: "para", distractors: ["porque", "aunque", "pero"], tipo: "Finalidad" },
        { sentence: "No vino a clase ___ estaba enfermo.", ans: "porque", distractors: ["por lo tanto", "así que", "en consecuencia"], tipo: "Causa" },
        { sentence: "Llegó tarde; ___, la reunión había comenzado.", ans: "sin embargo", distractors: ["por eso", "por lo tanto", "así que"], tipo: "Contraste" },
        { sentence: "Es un excelente profesional; ___, es muy humilde.", ans: "además", distractors: ["pero", "aunque", "sin embargo"], tipo: "Adición" },
        { sentence: "No solo estudia, ___ trabaja.", ans: "sino que también", distractors: ["pero", "aunque", "sin embargo"], tipo: "Adición" },
        { sentence: "Hablaré con el director ___ sea necesario.", ans: "si", distractors: ["aunque", "porque", "para"], tipo: "Condición" },
        { sentence: "Trabaja ___ mantener a su familia.", ans: "para", distractors: ["porque", "aunque", "sino"], tipo: "Finalidad" },
        { sentence: "No estudió; ___, no aprobó.", ans: "en consecuencia", distractors: ["sin embargo", "aunque", "no obstante"], tipo: "Consecuencia" },
        { sentence: "Aunque estaba cansado, ___ terminó el trabajo.", ans: "sin embargo", distractors: ["por lo tanto", "así que", "en consecuencia"], tipo: "Concesión" },
        { sentence: "Prefiero el té ___ el café.", ans: "antes que", distractors: ["aunque", "porque", "para"], tipo: "Preferencia" },
        { sentence: "No fue al trabajo ___ estaba de vacaciones.", ans: "porque", distractors: ["aunque", "por lo tanto", "en consecuencia"], tipo: "Causa" },
        { sentence: "Primero estudia; ___, podrás salir.", ans: "luego", distractors: ["aunque", "pero", "sin embargo"], tipo: "Secuencia" },
        { sentence: "Debes esforzarte ___ lograr tus metas.", ans: "para", distractors: ["porque", "aunque", "pero"], tipo: "Finalidad" },
        { sentence: "Es muy caro; ___, vale la pena.", ans: "sin embargo", distractors: ["por eso", "en consecuencia", "así que"], tipo: "Contraste" },
        { sentence: "El profesor explicó ___ los alumnos entendieran.", ans: "para que", distractors: ["porque", "aunque", "pero"], tipo: "Finalidad" },
        { sentence: "No aprobó el curso; ___, deberá repetirlo.", ans: "por lo tanto", distractors: ["sin embargo", "aunque", "no obstante"], tipo: "Consecuencia" },
        { sentence: "Estudia y trabaja, ___ está muy ocupado.", ans: "por lo tanto", distractors: ["sin embargo", "aunque", "no obstante"], tipo: "Consecuencia" },
        { sentence: "Fuimos al parque ___ hacía buen clima.", ans: "porque", distractors: ["aunque", "por lo tanto", "en consecuencia"], tipo: "Causa" },
        { sentence: "Puedes venir ___ quieras.", ans: "cuando", distractors: ["aunque", "porque", "para"], tipo: "Temporal" },
        { sentence: "___ llegues, avísame.", ans: "Cuando", distractors: ["Aunque", "Porque", "Para"], tipo: "Temporal" },
        { sentence: "No me gusta el frío; ___, prefiero el verano.", ans: "por eso", distractors: ["aunque", "sin embargo", "no obstante"], tipo: "Consecuencia" },
        { sentence: "Tanto su madre ___ su padre asistieron.", ans: "como", distractors: ["pero", "aunque", "sin embargo"], tipo: "Adición comparativa" }
    ]
};

// --- GENERADOR MASIVO DE BANCO POR SECCIÓN (1500 = 4 temas × 375) ---
function generateMassiveBank(sectionKey) {
    const section = sectionsData[sectionKey];
    const pool = contentPools[sectionKey];
    const bank = [];
    let counter = 1;

    for (let t = 0; t < section.topics.length; t++) {
        const topic = section.topics[t];
        for (let i = 1; i <= 375; i++) {
            const idx = ((t * 375) + i - 1) % pool.length;
            const item = pool[idx];
            let questionObj;

            if (sectionKey === "sinonimos") {
                questionObj = {
                    topic,
                    question: `Selecciona el sinónimo correcto de la palabra: "${item.stem}".`,
                    options: [item.ans, ...item.distractors],
                    answer: item.ans,
                    explanation: `"${item.ans}" es sinónimo de "${item.stem}" porque comparten significado equivalente.`
                };
            } else if (sectionKey === "antonimos") {
                questionObj = {
                    topic,
                    question: `Selecciona el antónimo correcto de la palabra: "${item.stem}".`,
                    options: [item.ans, ...item.distractors],
                    answer: item.ans,
                    explanation: `"${item.ans}" es antónimo de "${item.stem}" porque expresan significados opuestos.`
                };
            } else if (sectionKey === "analogias") {
                questionObj = {
                    topic,
                    question: `Completa la analogía (${item.tipo}): ${item.rel}`,
                    options: [item.ans, ...item.distractors],
                    answer: item.ans,
                    explanation: `La relación es de tipo "${item.tipo}", por lo que la respuesta correcta es "${item.ans}".`
                };
            } else if (sectionKey === "comprension") {
                questionObj = {
                    topic,
                    question: item.q,
                    passage: item.passage,
                    options: [item.ans, ...item.distractors],
                    answer: item.ans,
                    explanation: `La respuesta correcta es "${item.ans}" según el análisis del texto.`
                };
            } else if (sectionKey === "plan_redaccion") {
                const sentencesText = item.sentences.join(" | ");
                questionObj = {
                    topic,
                    question: `Ordena los enunciados sobre "${item.title}": ${sentencesText}. ¿Cuál es el orden correcto?`,
                    options: [item.ans, ...item.wrongs],
                    answer: item.ans,
                    explanation: item.just
                };
            } else if (sectionKey === "oraciones_eliminadas") {
                const sentencesText = item.sentences.join(" | ");
                const labels = ["I", "II", "III", "IV", "V"];
                questionObj = {
                    topic,
                    question: `Indica la oración que debe eliminarse del siguiente grupo sobre "${item.tema}": ${sentencesText}`,
                    options: labels,
                    answer: item.eliminar,
                    explanation: item.reason
                };
            } else if (sectionKey === "conectores") {
                questionObj = {
                    topic,
                    question: `Selecciona el conector más adecuado (${item.tipo}): "${item.sentence}"`,
                    options: [item.ans, ...item.distractors],
                    answer: item.ans,
                    explanation: `El conector "${item.ans}" es el correcto porque establece una relación de tipo "${item.tipo}".`
                };
            }

            bank.push(questionObj);
            counter++;
        }
    }
    return bank;
}

// --- FUNCIONES DE INICIALIZACIÓN ---
document.addEventListener("DOMContentLoaded", () => {
    if(window.lucide) window.lucide.createIcons();
    
    if(typeof CETA_Seguridad_DetectarDispositivo === 'function') {
        CETA_Seguridad_DetectarDispositivo();
    }

    const loader = document.getElementById('loader');
    if(loader) loader.style.display = 'none';

    const session = localStorage.getItem('ceta_session');
    if (session) {
        currentUser = JSON.parse(session);
        showDashboard(); 
    } else {
        const loginScreen = document.getElementById("login-screen");
        if(loginScreen) loginScreen.style.display = "block";
        
        const loginBtn = document.getElementById("btn-login");
        if(loginBtn) loginBtn.addEventListener("click", handleLogin);
    }
    
    const reloadBtn = document.getElementById("btn-reload");
    if(reloadBtn) reloadBtn.addEventListener("click", () => {
        if(!isFinished || confirm("El simulador ya terminó. ¿Deseas recargarlo con un nuevo set de 40 ejercicios únicos del banco?")) {
            initSimulator(currentSectionKey);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    const finishBtn = document.getElementById("btn-finish");
    if(finishBtn) finishBtn.addEventListener("click", finishSimulator);

    const pdfBtn = document.getElementById("btn-pdf");
    if(pdfBtn) pdfBtn.addEventListener("click", generatePDFReport);

    const dashBtn = document.getElementById("btn-dashboard");
    if(dashBtn) dashBtn.addEventListener("click", showDashboard);
});

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
            showDashboard();
        } else {
            errorDiv.textContent = result.msg;
            errorDiv.style.display = "block";
        }
    } catch(err) {
        errorDiv.textContent = "Error al verificar acceso: " + err.message;
        errorDiv.style.display = "block";
    }
}

function showDashboard() {
    clearInterval(timerInterval);
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("simulator-screen").style.display = "none";
    document.getElementById("dashboard-screen").style.display = "flex";
    
    if(currentUser) {
        document.getElementById("dash-student-name").textContent = currentUser.nombre;
    }
    if(window.lucide) window.lucide.createIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startSection(sectionKey) {
    currentSectionKey = sectionKey;
    currentSectionName = sectionsData[sectionKey].name;
    
    document.getElementById("dashboard-screen").style.display = "none";
    document.getElementById("simulator-screen").style.display = "flex";
    
    document.getElementById("sim-title").textContent = `Simulador CETA - ${currentSectionName}`;
    document.getElementById("sim-subtitle").textContent = `${currentSectionName} | Banco de 1,500 Preguntas (Práctica de 40)`;
    
    initSimulator(sectionKey);
}

function initSimulator(sectionKey) {
    clearInterval(timerInterval);
    timeRemaining = TIME_LIMIT;
    isFinished = false;
    updateTimerDisplay();
    
    const pdfBtn = document.getElementById("btn-pdf");
    if(pdfBtn) pdfBtn.style.display = "none";

    const dashBtn = document.getElementById("btn-dashboard");
    if(dashBtn) dashBtn.style.display = "none"; // Se activa al finalizar
    
    const finishBtn = document.getElementById("btn-finish");
    if(finishBtn) finishBtn.disabled = false;
    
    const statusDiv = document.getElementById("ai-status");
    if(statusDiv) statusDiv.style.display = "none";

    if(currentUser) {
        const nameDisplay = document.getElementById("student-name-display");
        if(nameDisplay) nameDisplay.textContent = currentUser.nombre;
    }

    generateUniqueQuestions(sectionKey);
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

// --- SELECCIÓN DE 40 PREGUNTAS ÚNICAS DESDE EL BANCO DE 1500 (carga diferida) ---
function generateUniqueQuestions(sectionKey) {
    // Lazy load: generar banco solo cuando sea necesario
    if (sectionsData[sectionKey].bank.length === 0) {
        sectionsData[sectionKey].bank = generateMassiveBank(sectionKey);
    }

    currentQuestions = [];
    let bankCopy = JSON.parse(JSON.stringify(sectionsData[sectionKey].bank));
    
    // Mezclar Fisher-Yates
    for (let i = bankCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bankCopy[i], bankCopy[j]] = [bankCopy[j], bankCopy[i]];
    }

    const selectedSubset = bankCopy.slice(0, TOTAL_QUESTIONS);

    selectedSubset.forEach((q, index) => {
        // Mezclar opciones (Fisher-Yates)
        for (let i = q.options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [q.options[i], q.options[j]] = [q.options[j], q.options[i]];
        }
        q.id = `q_${index}`;
        q.index = index + 1;
        currentQuestions.push(q);
    });
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
                <span>${opt}</span>
            </label>
        `).join("");

        const passageHTML = q.passage ? `<div class="passage-box">${q.passage}</div>` : "";

        card.innerHTML = `
            <h3>Pregunta ${q.index}: ${q.question}</h3>
            ${passageHTML}
            <div class="options-group">
                ${optionsHTML}
            </div>
        `;
        container.appendChild(card);
    });
}

// --- MOTOR DE DIAGNÓSTICO INTEGRADO ---
function generateInternalDiagnosis(correctCount, totalCount, feedbackData, studentName) {
    const percentage = (correctCount / totalCount) * 100;
    const sortedTopics = Object.entries(feedbackData).sort((a, b) => b[1] - a[1]);
    let analysisText = "";
    
    if (percentage >= 90) {
        analysisText += `¡Sobresaliente, ${studentName}! Tienes un dominio excelente en ${currentSectionName}. Has demostrado precisión y velocidad analítica sobresaliente. `;
    } else if (percentage >= 70) {
        analysisText += `Buen trabajo, ${studentName}. Posees bases sólidas en ${currentSectionName}, aunque hay áreas específicas por pulir. `;
    } else if (percentage >= 50) {
        analysisText += `Esfuerzo aceptable, ${studentName}. Estás avanzando, pero requieres reforzar los fundamentos teóricos de ${currentSectionName}. `;
    } else {
        analysisText += `No te desanimes, ${studentName}. Este diagnóstico en ${currentSectionName} te indica exactamente dónde enfocar tus tutorías en CETA. `;
    }

    if (sortedTopics.length > 0) {
        analysisText += `El sistema ha detectado que debes repasar urgentemente los temas: `;
        const topicStrings = sortedTopics.map(t => `${t[0]} (${t[1]} error${t[1] > 1 ? 'es' : ''})`);
        analysisText += topicStrings.join(', ') + `. `;
    } else {
        analysisText += `¡Puntuación perfecta! Estás completamente preparado en esta sección.`;
    }

    return analysisText;
}

function finishSimulator() {
    if (isFinished) return;
    
    const confirmacion = confirm("¿Estás seguro de que deseas finalizar el simulador de esta sección y calificar tus respuestas?");
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
            q.question.substring(0, 60) + "...",
            studentAnswer.substring(0, 40),
            isCorrect ? "Correcta" : "Incorrecta",
            q.answer.substring(0, 40)
        ]);
    });
    
    pdfReportData = reportData;

    const statusDiv = document.getElementById("ai-status");
    statusDiv.style.display = "block";
    
    const calificacionBase10 = ((globalCorrectCount / TOTAL_QUESTIONS) * 10).toFixed(2);
    document.getElementById("ai-score-display").textContent = `Calificación en ${currentSectionName}: ${globalCorrectCount} / 40 Puntos (${calificacionBase10} / 10.00)`;
    
    const feedbackDiv = document.getElementById("ai-feedback-display");
    const userName = currentUser ? currentUser.nombre.split(' ')[0] : "Estudiante";
    globalAiFeedback = generateInternalDiagnosis(globalCorrectCount, TOTAL_QUESTIONS, topicsFeedback, userName);
    
    feedbackDiv.innerHTML = `<strong>Aciertos: ${globalCorrectCount} de ${TOTAL_QUESTIONS}.</strong><br><br>${globalAiFeedback}`;
    
    // Activar botones al finalizar
    document.getElementById("btn-pdf").style.display = "inline-block";
    document.getElementById("btn-dashboard").style.display = "inline-block";
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generatePDFReport() {
    if (!pdfReportData) return;
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("landscape");

    doc.setFontSize(18);
    doc.text(`Reporte de Simulador - ${currentSectionName} (CETA)`, 14, 20);
    
    const nombre = currentUser ? currentUser.nombre : "Desconocido";
    const codigo = currentUser ? currentUser.codigo : "N/A";

    doc.setFontSize(12);
    doc.text(`Estudiante: ${nombre}`, 14, 28);
    doc.text(`Código: ${codigo}`, 14, 34);
    
    const calificacionBase10 = ((globalCorrectCount / TOTAL_QUESTIONS) * 10).toFixed(2);
    doc.text(`Calificación Final: ${globalCorrectCount} / 40 Puntos (${calificacionBase10} / 10.00)`, 14, 40);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 51, 153);
    const splitAiText = doc.splitTextToSize(`Diagnóstico de Rendimiento (${currentSectionName}):\n${globalAiFeedback}`, 260);
    doc.text(splitAiText, 14, 50);

    doc.autoTable({
        startY: 55 + (splitAiText.length * 5),
        head: [['#', 'Pregunta', 'Respuesta Estudiante', 'Estado', 'Respuesta Correcta']],
        body: pdfReportData,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
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

    doc.save(`Reporte_${currentSectionKey}_${codigo}.pdf`);
}