/**
=========================================================
* GestiaSoft - Timeline Builder Utility
=========================================================
* Utility function to build timeline events from API data
*/

/**
 * Construye el timeline basado en los datos del API
 * @param {Object} gestion - Objeto de gestión del API
 * @returns {Array} Array de eventos para el timeline
 */
export const buildTimelineFromAPI = (gestion) => {
    if (!gestion) return [];

    const events = [];

    // Si existe un array timeline en la respuesta, usarlo directamente
    if (gestion.timeline && Array.isArray(gestion.timeline) && gestion.timeline.length > 0) {
        gestion.timeline.forEach((paso, index) => {
            const isLastItem = index === gestion.timeline.length - 1;
            const isPasoCompletado = paso.fecha_fin !== null && paso.fecha_fin !== undefined;

            // Construir badges con unidades
            const badges = [];

            // Agregar número de paso
            if (paso.paso_numero !== null && paso.paso_numero !== undefined && paso.paso_numero !== 0 && paso.paso_numero !== '') {
                badges.push(`Paso #${paso.paso_numero}`);
            }

            // Agregar unidades asignadas a este paso
            if (paso.unidades_asignadas && Array.isArray(paso.unidades_asignadas)) {
                paso.unidades_asignadas.forEach(unidad => {
                    if (unidad && unidad.nombre_unidad && unidad.nombre_unidad.trim() !== '') {
                        badges.push(unidad.nombre_unidad);
                    }
                });
            }

            // Determinar color e icono según el estado del paso
            let color = "warning"; // Pendiente por defecto
            let icon = "schedule";

            if (isPasoCompletado || paso.unidades_asignadas?.every(u => u.completado === true)) {
                color = "success";
                icon = "check_circle";
            } else if (!isLastItem) {
                color = "success"; // Pasos anteriores completados
                icon = "check_circle";
            } else {
                // Paso actual en proceso
                color = "info";
                icon = "schedule";
            }

            // Determinar la fecha a mostrar
            let fechaMostrar = paso.fecha_inicio;
            if (isPasoCompletado && paso.fecha_fin) {
                fechaMostrar = paso.fecha_fin;
            }

            events.push({
                color: color,
                icon: icon,
                title: paso.nombre_paso || `Paso ${paso.paso_numero || index + 1}`,
                dateTime: fechaMostrar
                    ? new Date(fechaMostrar).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                    : "Fecha no disponible",
                description: paso.descripcion || `Paso ${paso.paso_numero || index + 1}: ${paso.nombre_paso || 'Sin descripción'}`,
                badges: badges,
                lastItem: isLastItem
            });
        });
    } else {
        // Fallback: Construir timeline a partir del paso actual si no hay timeline en el API
        if (gestion.nombre_paso) {
            const unidades = gestion.unidades_atendiendo || gestion.unidades_asignadas || [];

            // Construir badges solo con información válida
            const badges = [];

            // Agregar número de paso primero
            if (gestion.paso_numero !== null && gestion.paso_numero !== undefined && gestion.paso_numero !== 0 && gestion.paso_numero !== '') {
                badges.push(`Paso #${gestion.paso_numero}`);
            }

            // Agregar todas las unidades que participaron en este paso
            unidades.forEach(unidad => {
                if (unidad && unidad.nombre_unidad && unidad.nombre_unidad.trim() !== '') {
                    badges.push(unidad.nombre_unidad);
                }
            });

            let color = "warning"; // Pendiente por defecto
            if (gestion.estado_nombre?.toLowerCase() === 'completado' || gestion.estado_nombre?.toLowerCase() === 'finalizado') {
                color = "success";
            } else if (gestion.estado_nombre?.toLowerCase() === 'en progreso' || gestion.estado_nombre?.toLowerCase() === 'activo') {
                color = "info";
            }

            events.push({
                color: color,
                icon: gestion.estado_nombre?.toLowerCase() === 'completado' ? "check_circle" : "schedule",
                title: gestion.nombre_paso,
                dateTime: gestion.fecha_llegada_paso
                    ? new Date(gestion.fecha_llegada_paso).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                    : "Fecha no disponible",
                description: gestion.descripcion_paso || `La gestión se encuentra en el paso "${gestion.nombre_paso}".`,
                badges: badges,
                lastItem: true
            });
        }

        // Si no hay eventos, crear uno por defecto
        if (events.length === 0) {
            events.push({
                color: "info",
                icon: "info",
                title: "Gestión en proceso",
                dateTime: new Date().toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                description: `La gestión "${gestion.nombre || 'Nueva Gestión'}" está en proceso.`,
                badges: [],
                lastItem: true
            });
        }
    }

    return events;
};


