/* ===================================================
   BASE DE DATOS DE VIDEOS Y RECURSOS AUDIOVISUALES
   CETA Preuniversitario - Derechos Reservados
   0 = Desactivado (Oculto en plataforma)
   1 = Activado (Visible para los estudiantes)
   =================================================== */

const VIDEOS_DB = [
  { 
    id: 101, 
    modulo: "R. Lógico", 
    fecha: "2026-10-17", 
    duracion: "12 min",
    titulo: "Porcentajes y Descuentos: Introducción y Métodos Rápidos", 
    url: "https://cetapreuniversitario.github.io/COMO%20CALCULAR%20DESCUENTOS%20-%20Ofertas%20Super%20facil%20-%20Para%20principiantes.mp4", 
    youtubeId: "RE3XoDORMys", 
    type: "mp4",
    activo: 1 
  },
  { 
    id: 102, 
    modulo: "R. Lógico", 
    fecha: "2026-10-17", 
    duracion: "18 min",
    titulo: "Porcentajes y Descuentos Sucesivos: Ejercicios Resueltos", 
    url: "https://cetapreuniversitario.github.io/C%C3%93MO%20CALCULAR%20UN%20PORCENTAJE%20_%20Superf%C3%A1cil%20-%20Para%20principiantes%20%F0%9F%98%8E.mp4", 
    youtubeId: "jjyJ4p3E4KM", 
    type: "mp4",
    activo: 1 
  },
  { 
    id: 103, 
    modulo: "R. Lógico", 
    fecha: "2026-10-24", 
    duracion: "4 min",
    titulo: "PROBLEMAS DE ORDEN DE INFORMACIÓN", 
    url: "https://www.youtube.com/watch?v=fNEVu5rbYNk", 
    youtubeId: "fNEVu5rbYNk", 
    type: "mp4",
    activo: 1 
  },
  { 
    id: 104, 
    modulo: "R. Lógico", 
    fecha: "2026-10-24", 
    duracion: "4 min",
    titulo: "RAZONES Y PROPORCIONES Ejercicio 1 Super facil - Para principiantes", 
    url: "http://youtube.com/watch?v=3eYwW4sDlxM", 
    youtubeId: "3eYwW4sDlxM", 
    type: "mp4",
    activo: 1 
  },
  { 
    id: 105, 
    modulo: "R. Lógico", 
    fecha: "2026-10-24", 
    duracion: "4 min",
    titulo: "MENOR QUE Y MAYOR QUE Super facil Para principiantes", 
    url: "", 
    youtubeId: "0B05Uy0Cj-c", 
    type: "mp4",
    activo: 1 
  },
  { 
    id: 106, 
    modulo: "R. Lógico", 
    fecha: "2026-10-31", 
    duracion: "4 min",
    titulo: "PLANTEAR Y RESOLVER ECUACIONES LINEALES", 
    url: "https://www.youtube.com/watch?v=NAIjmDMNF10", 
    youtubeId: "NAIjmDMNF10", 
    type: "mp4",
    activo: 1 
  },
  { 
    id: 107, 
    modulo: "R. Lógico", 
    fecha: "2026-10-31", 
    duracion: "45 min",
    titulo: "PLANTEO DE ECUACIONES PROBLEMAS RESUELTOS RAZONAMIENTO MATEMÁTICO", 
    url: "https://www.youtube.com/watch?v=1b4_4Y0UP8Q", 
    youtubeId: "1b4_4Y0UP8Q", 
    type: "mp4",
    activo: 1 
  },
  { 
    id: 108, 
    modulo: "R. Lógico", 
    fecha: "2026-10-24", 
    duracion: "19 min",
    titulo: "Solución de problemas con Ecuaciones de Primer Grado ", 
    url: "https://www.youtube.com/watch?v=3HCTOOQVbu0&list=PLeySRPnY35dGx5FUtAikZ6UUuHQLaI9_E&index=1", 
    youtubeId: "3HCTOOQVbu0&list=PLeySRPnY35dGx5FUtAikZ6UUuHQLaI9_E&index=1", 
    type: "mp4",
    activo: 1 
  },
  { 
    id: 1, 
    modulo: "Matemáticas", 
    fecha: "2026-04-15", 
    duracion: "25 min",
    titulo: "Ecuaciones Logarítmicas Complejas", 
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", 
    type: "hls",
    activo: 0 
  },
  { 
    id: 2, 
    modulo: "Física", 
    fecha: "2026-04-12", 
    duracion: "30 min",
    titulo: "Dinámica: Leyes de Newton Aplicadas", 
    url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8", 
    type: "hls",
    activo: 0 
  },
  { 
    id: 3, 
    modulo: "Química", 
    fecha: "2026-04-10", 
    duracion: "22 min",
    titulo: "Estequiometría y Balanceo", 
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", 
    type: "hls",
    activo: 0 
  },
  { 
    id: 4, 
    modulo: "R. Verbal", 
    fecha: "2026-04-05", 
    duracion: "15 min",
    titulo: "Analogías y Comprensión Lectora", 
    url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8", 
    type: "hls",
    activo: 0 
  }
];