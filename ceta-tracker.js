/**
 * CETA Tracker - Sistema de Control y Sincronización de Calificaciones
 */

const CETA_Tracker = {
    STORAGE_KEY: "ceta_global_student_records",

    registrarIntento: function(student, moduleName, score, total) {
        if (!student || !student.codigo) return;

        try {
            const records = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
            
            const nuevoRegistro = {
                codigo: student.codigo,
                nombre: student.nombre || "Estudiante CETA",
                modulo: moduleName,
                aciertos: score,
                totalPreguntas: total,
                calificacion10: ((score / total) * 10).toFixed(2),
                fechaHora: new Date().toISOString()
            };

            records.push(nuevoRegistro);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
            
            // Sincronización silenciosa opcional con el servidor/repositorio
            this._sincronizarConRepo(nuevoRegistro);
        } catch (e) {
            console.error("Error al registrar métrica:", e);
        }
    },

    _sincronizarConRepo: function(registro) {
        // En una implementación con backend o base de datos ligera (como Firebase, Supabase o un endpoint propio), 
        // aquí se realiza el envío HTTP POST. Para GitHub puro, los datos se consolidan mediante las Pull Requests o envíos de los simuladores.
        console.debug("Registro preparado para sincronización:", registro);
    },

    obtenerHistorial: function() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    }
};