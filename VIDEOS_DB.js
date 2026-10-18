/* ===================================================
   BASE DE DATOS DE VIDEOS Y RECURSOS AUDIOVISUALES
   CETA Preuniversitario - Derechos Reservados
   0 = Desactivado (Oculto)
   1 = Activado (Visible para estudiantes)
   =================================================== */

const VIDEOS_DB = [
  { 
    id: 101, 
    modulo: "R. Lógico", 
    fecha: "2026-10-17", 
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
    titulo: "Porcentajes y Descuentos Sucesivos: Ejercicios Resueltos", 
    url: "https://cetapreuniversitario.github.io/C%C3%93MO%20CALCULAR%20UN%20PORCENTAJE%20_%20Superf%C3%A1cil%20-%20Para%20principiantes%20%F0%9F%98%8E.mp4", 
    youtubeId: "jjyJ4p3E4KM", 
    type: "mp4",
    activo: 1 
  },
  { 
    id: 1, 
    modulo: "Matemáticas", 
    fecha: "2026-04-15", 
    titulo: "Ecuaciones Logarítmicas Complejas", 
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", 
    type: "hls",
    activo: 0 
  },
  { 
    id: 2, 
    modulo: "Física", 
    fecha: "2026-04-12", 
    titulo: "Dinámica: Leyes de Newton Aplicadas", 
    url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8", 
    type: "hls",
    activo: 0 
  },
  { 
    id: 3, 
    modulo: "Química", 
    fecha: "2026-04-10", 
    titulo: "Estequiometría y Balanceo", 
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", 
    type: "hls",
    activo: 0 
  },
  { 
    id: 4, 
    modulo: "R. Verbal", 
    fecha: "2026-04-05", 
    titulo: "Analogías y Comprensión Lectora", 
    url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8", 
    type: "hls",
    activo: 0 
  }
];