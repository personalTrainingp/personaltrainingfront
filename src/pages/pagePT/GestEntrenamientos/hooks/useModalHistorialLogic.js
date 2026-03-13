import { useState, useEffect } from 'react';
import { entrenamientosApi } from '@/api/entrenamientosApi';

export function useModalHistorialLogic({ show, onHide, onSaved, catalogo, tiposEjercicio = [], turnos = [], idCliente, idPgm, namePgm, idDetalleMembresia, initialTurno, fechaInicio }) {
    // Helper para obtener fecha local en formato YYYY-MM-DD
    const getLocalISOString = () => {
        const now = new Date();
        const local = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
        return local.toISOString().split('T')[0];
    };

    const today = getLocalISOString();

    const [fecha, setFecha] = useState('');
    const [selectedTipo, setSelectedTipo] = useState(null);
    const [selectedEjercicio, setSelectedEjercicio] = useState(null);
    const [selectedTurno, setSelectedTurno] = useState(null); // Selected Turno
    const [momentoDia, setMomentoDia] = useState(null); // Nuevo filtro (Restored)
    const [series, setSeries] = useState(6);
    const [repeticiones, setRepeticiones] = useState(2);
    const [peso, setPeso] = useState(10);
    const [tiempo, setTiempo] = useState(''); // Restored
    const [comentario, setComentario] = useState(''); // New State

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const usaPeso = selectedEjercicio?.TipoEjercicio?.usa_peso !== 0 && selectedEjercicio?.TipoEjercicio?.usa_peso !== false;
    const usaTiempo = selectedEjercicio?.TipoEjercicio?.usa_tiempo == 1 || selectedEjercicio?.TipoEjercicio?.usa_tiempo == true;

    useEffect(() => {
        if (show) {
            // Priority: Membership Start Date -> Today
            let initialDate = today;
            if (fechaInicio) {
                const d = new Date(fechaInicio);
                if (!isNaN(d.getTime())) {
                    initialDate = d.toISOString().split('T')[0];
                }
            }
            setFecha(initialDate);

            setSelectedTipo(null);
            setSelectedEjercicio(null);

            // Lógica de Preselección de Turno
            if (initialTurno) {
                const foundTurno = turnos.find(t => t.id === initialTurno);
                if (foundTurno) {
                    let label = foundTurno.nombre;
                    if (foundTurno.hora_inicio && foundTurno.hora_fin) {
                        const getHHMM = (timeVal) => timeVal.includes('T') ? timeVal.split('T')[1].slice(0, 5) : timeVal.slice(0, 5);
                        label = `${getHHMM(foundTurno.hora_inicio)} - ${getHHMM(foundTurno.hora_fin)}`;
                    }
                    setSelectedTurno({ value: foundTurno.id, label });
                } else {
                    setSelectedTurno(null);
                }
            } else {
                setSelectedTurno(null);
            }

            setMomentoDia(null); // Reset filtro
            setSeries(6); // Default 6
            setRepeticiones(2); // Default 2
            setPeso(10); // Default 10
            setTiempo('');
            setComentario(''); // Reset Comentario
            setError(null);
        }
    }, [show, initialTurno, turnos, fechaInicio, today]);

    const typeOptions = tiposEjercicio.map(t => ({ value: t.id, label: t.nombre }));

    const exerciseOptions = catalogo
        .filter(c => {
            if (!selectedTipo) return false;
            const tId = c.id_tipo || c.id_tipo_ejercicio;
            return tId == selectedTipo.value;
        })
        .map(c => ({
            value: c.id,
            label: c.nombre,
            ...c
        }));

    // --- CORRECCIÓN 1: SOLO 2 OPCIONES (AM y PM) ---
    const momentoOptions = [
        { value: 'AM', label: 'AM (Mañana)' },
        { value: 'PM', label: 'PM (Tarde / Noche)' }
    ];

    // --- CORRECCIÓN 2: FILTRO BINARIO ---
    const turnoOptions = turnos
        .filter(t => {
            if (!momentoDia) return true;

            // 1. Obtener hora
            let hour = -1;
            if (t.hora_inicio) {
                const timePart = t.hora_inicio.includes('T') ? t.hora_inicio.split('T')[1] : t.hora_inicio;
                hour = parseInt(timePart.split(':')[0], 10);
            }

            // 2. Fallback por nombre si no hay hora (Búsqueda inteligente)
            if (hour === -1) {
                const nameLower = t.nombre ? t.nombre.toLowerCase() : '';
                if (momentoDia.value === 'AM') {
                    return nameLower.includes('mañana') || nameLower.includes('am');
                }
                if (momentoDia.value === 'PM') {
                    return nameLower.includes('tarde') || nameLower.includes('noche') || nameLower.includes('pm');
                }
                return false;
            }

            // 3. Lógica AM / PM basada en hora
            if (momentoDia.value === 'AM') {
                // Desde las 00:00 hasta las 11:59 es AM
                return hour < 12;
            }

            if (momentoDia.value === 'PM') {
                // Desde las 12:00 en adelante es PM (Incluye tarde y noche)
                return hour >= 12;
            }

            return true;
        })
        .map(t => {
            let label = t.nombre;
            if (t.hora_inicio && t.hora_fin) {
                const getHHMM = (timeVal) => timeVal.includes('T') ? timeVal.split('T')[1].slice(0, 5) : timeVal.slice(0, 5);
                label = `${getHHMM(t.hora_inicio)} - ${getHHMM(t.hora_fin)}`;
            }
            return { value: t.id, label: label };
        });
    const handleSelectTipo = (val) => {
        setSelectedTipo(val);
        setSelectedEjercicio(null); // Reset ejercicio al cambiar tipo
        setPeso(10);
        setTiempo('');
    };

    const handleSelectEjercicio = (val) => {
        setSelectedEjercicio(val);
        if (val) {
            const tipo = val.TipoEjercicio;
            if (tipo && (tipo.usa_peso === 0 || tipo.usa_peso === false)) setPeso(0);
            else setPeso(10); // Restore/Keep default if used
            if (tipo && (tipo.usa_tiempo != 1 && tipo.usa_tiempo != true)) setTiempo('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!idCliente) return setError("No hay cliente seleccionado.");
        if (!selectedEjercicio) return setError("Debes seleccionar un entrenamiento.");
        if (!fecha) return setError("La fecha es obligatoria.");
        if (new Date(fecha) > new Date()) return setError("La fecha no puede ser mayor a hoy.");

        setSaving(true);
        try {
            const payload = {
                id_cliente: idCliente,
                id_entrenamiento: selectedEjercicio.value,
                fecha: fecha, // Send YYYY-MM-DD string directly to avoid timezone issues
                series: Number(series) || 0,
                repeticiones: Number(repeticiones) || 0,
                peso: usaPeso ? (Number(peso) || 0) : 0,
                tiempo: usaTiempo ? tiempo : null,
                id_turno: selectedTurno ? selectedTurno.value : null, // Add id_turno
                comentario: comentario || null // Add Comentario
            };

            // Solo agregar id_pgm si existe
            if (idPgm) {
                payload.id_pgm = idPgm;
            }

            // Agregar id_detalle_membresia si existe
            if (idDetalleMembresia) {
                payload.id_detalle_membresia = idDetalleMembresia;
            }

            const res = await entrenamientosApi.saveHistorial(payload);
            if (res.ok) {
                onSaved(res.data);
                onHide();
            } else {
                setError(res.msg || "Error al guardar");
            }
        } catch (err) {
            console.error(err);
            setError("Error interno al guardar");
        } finally {
            setSaving(false);
        }
    };

    // Calulate Weight Options based on selected exercise
    const weightOptions = (() => {
        if (!selectedEjercicio) return [];
        // Helper
        const range = (start, end, step) => {
            const arr = [];
            for (let i = start; i <= end; i += step) {
                arr.push(i);
            }
            return arr;
        };

        const isMachine = selectedEjercicio.es_maquina == 1 || selectedEjercicio.es_maquina === true;
        const rawValues = isMachine ? range(10, 100, 10) : range(0, 40, 2.5);

        return rawValues.map(v => ({ value: v, label: v.toString() }));
    })();

    return {
        today,
        fecha, setFecha,
        selectedTipo, handleSelectTipo, typeOptions,
        selectedEjercicio, handleSelectEjercicio, exerciseOptions,
        selectedTurno, setSelectedTurno, turnoOptions, // Export turno stuff
        momentoDia, setMomentoDia, momentoOptions, // Export new filter
        series, setSeries,
        repeticiones, setRepeticiones,
        peso, setPeso,
        weightOptions, // EXPORT OPTIONS
        tiempo, setTiempo,
        comentario, setComentario, // EXPORT Comentario
        saving,
        error,
        usaPeso,
        usaTiempo,
        handleSubmit
    };
}
