const fs = require('fs');
const PDFDocument = require('pdfkit');

// 1. Obtener la fecha actual (YYYY-MM-DD)
const fechaHoy = new Date().toISOString().split('T')[0];
const nombreArchivo = `reportes/reporte_${fechaHoy}.pdf`;

// 2. Asegurar que la carpeta 'reportes' exista
if (!fs.existsSync('reportes')) {
    fs.mkdirSync('reportes', { recursive: true });
}

// 3. Leer los registros acumulados desde 'registros.json'
let registros = [];
try {
    if (fs.existsSync('registros.json')) {
        registros = JSON.parse(fs.readFileSync('registros.json', 'utf8'));
    }
} catch (e) {
    console.error("Advertencia: No se pudo leer registros.json, se usará un registro de respaldo.", e);
}

// Si no hay registros aún, agregamos un aviso de control
if (!registros || registros.length === 0) {
    registros = [{
        codigo: "SISTEMA",
        nombre: "Sin registros previos",
        modulo: "General",
        aciertos: 0,
        totalPreguntas: 40,
        calificacion10: "0.00",
        fechaHora: new Date().toISOString()
    }];
}

// 4. Inicializar el documento PDF (Tamaño A4, márgenes de 50 puntos)
const doc = new PDFDocument({ size: 'A4', margin: 50 });
const stream = fs.createWriteStream(nombreArchivo);
doc.pipe(stream);

// --- ENCABEZADO DEL REPORTE ---
doc.fontSize(22).fillColor('#2563eb').text('CETA Preuniversitario', { align: 'center' });
doc.fontSize(14).fillColor('#1e293b').text('Reporte Acumulado de Calificaciones - Simuladores', { align: 'center' });
doc.moveDown(0.5);

doc.fontSize(10).fillColor('#64748b').text(`Fecha de generación automática: ${fechaHoy}`, { align: 'right' });
doc.text(`Total de evaluaciones registradas: ${registros.length}`, { align: 'right' });
doc.moveDown(1.5);

// Línea divisoria
doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
doc.moveDown(1.5);

// --- CUERPO / LISTADO DE REGISTROS ---
doc.fontSize(12).fillColor('#0f172a').text('Detalle de Evaluaciones de Estudiantes:', { underline: true });
doc.moveDown(1);

registros.forEach((reg, index) => {
    // Control básico de espacio para evitar solapamientos al final de la página
    if (doc.y > 700) {
        doc.addPage();
    }

    const fechaFormateada = reg.fechaHora ? reg.fechaHora.replace('T', ' ').substring(0, 19) : 'Fecha no registrada';

    // Caja de diseño para cada estudiante
    doc.rect(50, doc.y, 495, 38).fillAndStroke('#f8fafc', '#e2e8f0');
    
    doc.fillColor('#0f172a').fontSize(10);
    doc.text(`${index + 1}. [${reg.codigo}] ${reg.nombre}`, 60, doc.y - 32, { continued: false });
    
    doc.fillColor('#475569').fontSize(9);
    doc.text(`Módulo: ${reg.modulo}  |  Aciertos: ${reg.aciertos}/${reg.totalPreguntas}  |  Nota: ${reg.calificacion10}/10.00  |  (${fechaFormateada})`, 60, doc.y - 18);
    
    doc.moveDown(1.2);
});

// Finalizar documento PDF
doc.end();

stream.on('finish', () => {
    console.log(`[Éxito] Reporte PDF generado correctamente en: ${nombreArchivo}`);
});