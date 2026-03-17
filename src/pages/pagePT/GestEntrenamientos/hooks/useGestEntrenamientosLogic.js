import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Swal from 'sweetalert2';
import { entrenamientosApi } from '@/api/entrenamientosApi';
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'; // Import Store


export function useGestEntrenamientosLogic() {
    const [clienteSel, setClienteSel] = useState(null);
    const [catalogo, setCatalogo] = useState([]);
    const [tiposEjercicio, setTiposEjercicio] = useState([]);
    const [turnos, setTurnos] = useState([]); // New state for turnos
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [saving, setSaving] = useState(false);

    const [showModalCat, setShowModalCat] = useState(false);
    const [showModalEditCat, setShowModalEditCat] = useState(false);
    const [showModalHistorial, setShowModalHistorial] = useState(false);
    const [showModalTurno, setShowModalTurno] = useState(false); // New modal state
    const [turnoToEdit, setTurnoToEdit] = useState(null); // State for editing turno
    const [lastUsedTurno, setLastUsedTurno] = useState(null); // <--- RESTORED STATE
    const [turnoPreferido, setTurnoPreferido] = useState(''); // <--- NUEVO ESTADO
    const [valGeneral, setValGeneral] = useState(null);
    const [valHistorial, setValHistorial] = useState(null);
    const { DataSemanaPGM, obtenerSemanasPorPrograma } = useTerminoStore(); // Use Store

    const [vigentes, setVigentes] = useState([]);

    // Stable refs for lookups to avoid stale closure issues in AgGrid callbacks
    const catalogoRef = useRef([]);
    const tiposRef = useRef([]);
    const vigentesRef = useRef([]);
    const dataSemanaRef = useRef([]);

    useEffect(() => { catalogoRef.current = catalogo; }, [catalogo]);
    useEffect(() => { tiposRef.current = tiposEjercicio; }, [tiposEjercicio]);
    useEffect(() => { vigentesRef.current = vigentes; }, [vigentes]);
    useEffect(() => { dataSemanaRef.current = DataSemanaPGM; }, [DataSemanaPGM]);

    const syncAttendanceCount = useCallback((rows) => {
        if (!rows || !Array.isArray(rows)) return;
        const uniqueDays = new Set(rows.map(r => r.fecha?.substring(0, 10)).filter(Boolean));
        setClienteSel(prev => {
            if (!prev) return null;
            if (prev.asistencias_realizadas === uniqueDays.size) return prev;
            return { ...prev, asistencias_realizadas: uniqueDays.size };
        });
    }, []);

    const loadCatalogo = useCallback(() => {
        Promise.all([
            entrenamientosApi.getCatalogo(),
            entrenamientosApi.getTiposEjercicio(),
            entrenamientosApi.getTurnos()
        ]).then(([resCat, resTipos, resTurnos]) => {
            if (resCat.ok) setCatalogo(resCat.data || []);
            if (resTipos) setTiposEjercicio(resTipos.data || resTipos || []);
            if (resTurnos && resTurnos.ok) setTurnos(resTurnos.data || []);
        }).catch(console.error);
    }, []);

    useEffect(() => {
        loadCatalogo();
        obtenerSemanasPorPrograma(4);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount to avoid infinite loops from unstable store functions

    const clienteId = clienteSel?.value;

    const fetchHistorial = useCallback(async () => {
        if (!clienteId) return;
        try {
            const res = await entrenamientosApi.getHistorial(clienteId);
            if (res.ok) {
                const rows = (res.data || []).map(r => ({ ...r, _existing: true }));
                setRowData(rows);

                const lastTurnoEntry = rows.find(r => r.id_turno);
                if (lastTurnoEntry) {
                    setLastUsedTurno(lastTurnoEntry.id_turno);
                } else {
                    setLastUsedTurno(null);
                }
                syncAttendanceCount(rows);
            }
            setHasUnsavedChanges(false);
        } catch (err) {
            console.error(err);
            setRowData([]);
        }
    }, [clienteId, syncAttendanceCount]);

    useEffect(() => {
        if (clienteId) fetchHistorial();
        else setRowData([]);
    }, [clienteId, fetchHistorial]);

    const onCellValueChanged = useCallback(async (params) => {
        const { data, colDef, newValue, oldValue, node } = params;

        console.log("onCellValueChanged Fired:", { field: colDef.field, newValue, oldValue });

        // Skip if value hasn't changed
        if (newValue === oldValue) return;

        // 1. FIX PRINCIPAL: Asegurar que el nuevo valor se asigne al objeto
        let updatedData = { ...data, [colDef.field]: newValue };

        // 2. FIX SECUNDARIO: Sincronizar el ID con el objeto visual del catálogo de entrenamientos
        if (colDef.field === 'id_entrenamiento') {
            // Si tu columna devuelve el ID, buscamos el objeto completo para que la tabla lo muestre bien
            const exerciseObj = catalogo.find(c => c.id === newValue || c.value === newValue);
            if (exerciseObj) updatedData.CatalogoEntrenamiento = exerciseObj;
        } else if (colDef.field === 'CatalogoEntrenamiento' || colDef.field === 'entrenamiento') {
            // Si tu columna devuelve el objeto completo, extraemos el ID para que la API no falle al guardar
            if (newValue && (newValue.id || newValue.value)) {
                updatedData.id_entrenamiento = newValue.id || newValue.value;
            }
        }

        // Check if it's an existing record (has ID from DB)
        if (data._existing) {
            // SPECIAL CASE: 'comentario'
            if (colDef.field === 'comentario') {
                try {
                    await entrenamientosApi.updateHistorial(data.id, { comentario: newValue });

                    Swal.fire({
                        toast: true, position: 'top-end', icon: 'success',
                        title: 'Comentario actualizado', showConfirmButton: false, timer: 1500
                    });

                    node.setData(updatedData); // <-- Ahora actualiza con el valor correcto
                    setRowData(prev => prev.map(r => r.id === data.id ? updatedData : r));
                    return;

                } catch (error) {
                    console.error("Error auto-saving comment:", error);
                    Swal.fire({
                        toast: true, position: 'top-end', icon: 'error',
                        title: 'Error al guardar comentario', showConfirmButton: false, timer: 2000
                    });
                    updatedData = { ...updatedData, _modified: true };
                    node.setData(updatedData);
                }
            } else {
                // DEFAULT BEHAVIOR for other columns (Numeric fields, dates, etc.)
                updatedData = { ...updatedData, _modified: true }; // <-- Ahora sí conserva el newValue
                node.setData(updatedData);
            }
        } else {
            // Si es una fila nueva (_new: true), también debemos actualizar el nodo
            node.setData(updatedData);
        }

        // CRITICAL: Always synchronize rowData state
        setRowData(prev => {
            const updated = prev.map(r => r.id === data.id ? updatedData : r);
            if (colDef.field === 'fecha') {
                syncAttendanceCount(updated);
            }
            return updated;
        });

        setHasUnsavedChanges(true);

        // 3. IMPORTANTE: Añadir 'catalogo' a las dependencias del hook
    }, [syncAttendanceCount, catalogo]);


    const [showModalSelectTurno, setShowModalSelectTurno] = useState(false);

    // Ref to store client context while waiting for Turno selection
    const pendingClientRef = useRef(null);

    // Helper to execute the actual row addition
    const executeAddRow = (turnoId, clientContext) => {
        const client = clientContext || pendingClientRef.current || clienteSel;
        if (!client) return;

        // El usuario solicitó que la fecha nazca vacía para forzar la selección manual
        const defaultDate = '';

        // Find turno info for display
        const turnoObj = turnos.find(t => t.id === turnoId);

        const newRow = {
            id: `temp_${Date.now()}`,
            fecha: defaultDate,
            id_cliente: client.value,
            id_st: client.id_semana,
            id_turno: turnoId,
            TurnoGimnasio: turnoObj, // Fill object for display
            id_pgm: client.id_pgm,
            id_detalle_membresia: client.id_detalle_membresia,
            name_pgm: client.name_pgm,
            _new: true,
            _existing: false,
            series: 4,
            repeticiones: 12,
            peso: 2.5,
            tiempo: ''
        };

        if (gridApi) {
            gridApi.applyTransaction({ add: [newRow], addIndex: 0 });
            setRowData(prev => [newRow, ...prev]);
            setHasUnsavedChanges(true); // Enable Save button
        }

        // Clear pending ref
        pendingClientRef.current = null;
    };

    const handleConfirmTurnoSelection = useCallback(async (turnoObjOrId) => {
        const turnoId = turnoObjOrId?.id || turnoObjOrId?.value || turnoObjOrId;
        setShowModalSelectTurno(false);

        // WARN USER: This action binds the membership to this schedule
        const result = await Swal.fire({
            title: '¿Confirmar Horario?',
            html: "Durante la vigencia de esta membresía, <b>solo podrá usar este horario</b>.<br/>Solo un administrador podrá cambiarlo después.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            setLastUsedTurno(turnoId);
            // Open History Modal to start populating the session
            setShowModalHistorial(true);
        } else {
            pendingClientRef.current = null;
            setLastUsedTurno(null); // Reset if cancelled
        }

    }, [gridApi, turnos]);
    const handleSave = async () => {
        if (!gridApi) return;
        gridApi.stopEditing();

        const newRows = [];
        const modifiedRows = [];

        gridApi.forEachNode((node) => {
            if (node.data._existing === false) newRows.push(node.data);
            else if (node.data._modified) modifiedRows.push(node.data);
        });

        if (newRows.length === 0 && modifiedRows.length === 0) return Swal.fire('Información', "No hay cambios para guardar", 'info');

        const now = new Date();
        const hasFutureDates = [...newRows, ...modifiedRows].some(row => new Date(row.fecha) > now);
        if (hasFutureDates) {
            return Swal.fire('Error', 'No se pueden guardar registros con fecha futura. Revisa los campos de fecha.', 'error');
        }

        try {
            const result = await Swal.fire({
                title: '¿Guardar Cambios?',
                text: `Se guardarán: ${newRows.length} nuevos y ${modifiedRows.length} modificados.`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, guardar',
                cancelButtonText: 'Cancelar',
                width: window.innerWidth < 768 ? '10%' : '22em',
                heightAuto: false,
                padding: '1.25rem',
                customClass: { popup: 'swal2-centered' }
            });

            if (!result.isConfirmed) return;

            setSaving(true);
            let successCount = 0;
            let errorCount = 0;

            let addedCount = 0; // Track newly added sessions for UI update

            for (const row of newRows) {
                try {
                    const cleanDate = new Date(row.fecha).toISOString().split('T')[0];
                    await entrenamientosApi.saveHistorial({
                        id_cliente: row.id_cliente,
                        id_entrenamiento: row.id_entrenamiento,
                        fecha: cleanDate, // Clean String
                        series: Number(row.series),
                        repeticiones: Number(row.repeticiones),
                        peso: Number(row.peso),
                        tiempo: row.tiempo || null,
                        id_turno: row.id_turno,
                        id_pgm: row.id_pgm,
                        id_detalle_membresia: row.id_detalle_membresia,
                        comentario: row.comentario
                    });
                    successCount++;
                    addedCount++;
                } catch (e) {
                    console.error("Error guardando nuevo:", e);
                    errorCount++;
                }
            }

            // OPTIMISTIC UPDATE: Increment attendance count
            if (addedCount > 0 && clienteSel) {
                setClienteSel(prev => ({
                    ...prev,
                    asistencias_realizadas: (prev.asistencias_realizadas || 0) + addedCount
                }));
            }

            for (const row of modifiedRows) {
                try {
                    const cleanDate = new Date(row.fecha).toISOString().split('T')[0];
                    await entrenamientosApi.updateHistorial(row.id, {
                        id_entrenamiento: row.id_entrenamiento,
                        fecha: cleanDate, // Clean String
                        series: Number(row.series),
                        repeticiones: Number(row.repeticiones),
                        peso: Number(row.peso),
                        tiempo: row.tiempo || null,
                        id_pgm: row.id_pgm,
                        id_turno: row.id_turno,
                        id_detalle_membresia: row.id_detalle_membresia,
                        comentario: row.comentario
                    });
                    successCount++;
                } catch (e) {
                    console.error("Error actualizando:", e);
                    errorCount++;
                }
            }

            await fetchHistorial();
            setHasUnsavedChanges(false);

            if (errorCount > 0) {
                Swal.fire('Atención', `Se guardaron ${successCount} registros, pero hubo ${errorCount} errores.`, 'warning');
            } else {
                Swal.fire('Guardado', 'Todos los cambios se guardaron exitosamente.', 'success');
            }

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Ocurrió un error al guardar los cambios.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const loadClientes = useCallback(async (search, prevOptions, { page }) => {
        const limit = 20;
        const p = page || 1;

        const { rows: historyRows, hasMore } = await entrenamientosApi.getClientesConHistorial({ search: search, page: p, limit });

        let historyOptions = historyRows.map(r => {
            const idSt = r.id_st || r.id_semana;
            let planDisplay = "Sin Plan";
            let semanasSt = 0;
            let sesionesSt = 0;
            let calculatedEnd = null;

            if (idSt && dataSemanaRef.current.length > 0) {
                const foundPlan = dataSemanaRef.current.find(p => (p.id || p.value) === idSt);
                if (foundPlan) {
                    const label = foundPlan.label; // e.g., "12 Semanas"
                    const match = label.match(/(\d+)\s*Semana/i);
                    if (match) semanasSt = parseInt(match[1]);

                    sesionesSt = foundPlan.sesiones || (semanasSt * 5);
                    planDisplay = `${semanasSt} Semanas - ${sesionesSt} Sesiones`;

                    // Calculate End Date
                    if (r.fecha_inicio) {
                        const start = new Date(r.fecha_inicio);
                        start.setDate(start.getDate() + (semanasSt * 7));
                        calculatedEnd = start.toISOString();
                    }
                }
            }

            if (planDisplay === "Sin Plan" && r.name_pgm) planDisplay = r.name_pgm;

            return {
                value: Number(r.value),
                label: (r.nombre || r.nombre_cli || r.label || '').split('|')[0].trim(), // Clean Label (Frontend Force)
                ...r,
                id_semana: idSt,
                name_pgm_original: r.name_pgm, // Keep original for reference if needed
                name_pgm: planDisplay, // OVERWRITE as requested ("elimina rastro")
                calculated_end_date: calculatedEnd
            };
        });

        historyOptions = historyOptions.filter(h => h.id_pgm == 4);

        let finalOptions = historyOptions;

        if (p === 1) {
            const lowerSearch = (search || '').toLowerCase();

            const matchingVigentes = vigentesRef.current.filter(v => {
                const matchesSearch = !lowerSearch || (v.cliente || v.nombre || '').toLowerCase().includes(lowerSearch);
                const matchesProgram = v.id_pgm == 4;
                return matchesSearch && matchesProgram;
            }).map(v => {
                const idSt = v.id_st || v.id_semana;
                let planDisplay = "Sin Plan";
                let semanasSt = 0;
                let sesionesSt = 0;
                let calculatedEnd = null;

                if (idSt && dataSemanaRef.current.length > 0) {
                    const foundPlan = dataSemanaRef.current.find(p => (p.id || p.value) === idSt);
                    if (foundPlan) {
                        const label = foundPlan.label;
                        const match = label.match(/(\d+)\s*Semana/i);
                        if (match) semanasSt = parseInt(match[1]);

                        sesionesSt = foundPlan.sesiones || (semanasSt * 5);
                        planDisplay = `${semanasSt} Semanas - ${sesionesSt} Sesiones`;

                        // Calculate End Date
                        if (v.fecha_inicio) {
                            const start = new Date(v.fecha_inicio);
                            start.setDate(start.getDate() + (semanasSt * 7));
                            calculatedEnd = start.toISOString();
                        }
                    }
                }

                // Fallback
                if (planDisplay === "Sin Plan" && (v.plan || v.name_pgm)) planDisplay = v.plan || v.name_pgm;

                return {
                    ...v,
                    value: Number(v.id_cli),
                    label: `${v.cliente || v.nombre || 'Cliente'} (Vigente)`, // Solo Nombre
                    nombre_cli: v.cliente || v.nombre,
                    name_pgm: planDisplay, // OVERWRITE
                    name_pgm_original: v.name_pgm,
                    id_pgm: v.id_pgm,
                    id_semana: idSt,
                    semanas_st: semanasSt || v.semanas_st,
                    id_detalle_membresia: v.id_detalle_membresia || v.id_detalle || v.id,
                    calculated_end_date: v.fec_fin_mem || v.fec_fin || calculatedEnd
                };
            });

            const map = new Map();

            matchingVigentes.forEach(opt => map.set(opt.value, opt));
            historyOptions.forEach(opt => map.set(opt.value, opt));

            finalOptions = Array.from(map.values());
        }

        return {
            options: finalOptions,
            hasMore,
            additional: { page: p + 1 }
        };
    }, []); // Removed dependencies to prevent loop
    const loadClientesHistorial = useCallback(async (search, prevOptions, { page }) => {
        const limit = 20;
        const p = page || 1;

        // Llamada a la API
        const response = await entrenamientosApi.getClientesConHistorial({ search: search, page: p, limit });

        // Validación de seguridad por si la API falla
        const historyRows = response?.rows || [];
        const hasMore = response?.hasMore || false;

        const historyOptions = historyRows.map(r => {
            // ... (Toda tu lógica de mapeo y cálculo de fechas se mantiene IGUAL) ...
            const idSt = r.id_st || r.id_semana;
            let planDisplay = "Sin Plan";
            let semanasSt = r.semanas_st || 0;
            let calculatedEnd = r.fec_fin_mem || r.fec_fin || r.fec_fin_mem_oftime || r.fecha_fin;

            if (idSt && dataSemanaRef.current.length > 0) {
                const foundPlan = dataSemanaRef.current.find(p => (p.id || p.value) === idSt);
                if (foundPlan) {
                    const label = foundPlan.label;
                    const match = label.match(/(\d+)\s*Semana/i);
                    if (match && !semanasSt) semanasSt = parseInt(match[1]);
                    // ... resto de lógica de nombre ...
                    const sesionesSt = foundPlan.sesiones || (semanasSt * 5);
                    planDisplay = `${semanasSt} Semanas - ${sesionesSt} Sesiones`;
                }
            }

            if (!calculatedEnd && r.fecha_inicio && semanasSt > 0) {
                const start = new Date(r.fecha_inicio);
                start.setDate(start.getDate() + (semanasSt * 7));
                calculatedEnd = start.toISOString();
            }

            if (planDisplay === "Sin Plan" && r.name_pgm) planDisplay = r.name_pgm;

            let labelSuffix = "";
            if (r.id_pgm == 4) {
                labelSuffix = "(Vigente)";
            } else {
                labelSuffix = ` - ${planDisplay || 'Sin Plan'}`;
            }

            return {
                value: Number(r.value),
                label: `${(r.nombre || r.nombre_cli || r.label || '').split('|')[0].trim()} ${labelSuffix}`, // Clean Label
                ...r,
                id_semana: idSt,
                name_pgm: planDisplay,
                name_pgm_original: r.name_pgm,
                calculated_end_date: calculatedEnd
            };
        });

        // Filtrado inicial (solo PGM 4)
        let finalOptions = historyOptions.filter(h => h.id_pgm == 4);

        // Lógica de mezcla con Vigentes (Solo en página 1 para no duplicar lógica en scroll)
        if (p === 1) {
            const lowerSearch = (search || '').toLowerCase();
            const matchingVigentes = vigentesRef.current.filter(v => {
                if (!lowerSearch) return true;
                const name = (v.cliente || v.nombre_cli || '').toLowerCase();
                return name.includes(lowerSearch);
            }).map(v => {
                // ... (Tu lógica de mapeo de vigentes se mantiene IGUAL) ...
                // Asegúrate de calcular la fecha aquí también
                let semanasSt = v.semanas_st || 0;
                let calculatedEnd = v.fec_fin_mem || v.fec_fin || v.fec_fin_mem_oftime;

                // Fallback fecha vigentes
                if (!calculatedEnd && v.fecha_inicio && semanasSt > 0) {
                    const start = new Date(v.fecha_inicio);
                    start.setDate(start.getDate() + (semanasSt * 7));
                    calculatedEnd = start.toISOString();
                }

                let labelSuffix = "";
                // Explicit rule: "solo vigente es para el id_pgm=4"
                if (v.id_pgm == 4) {
                    labelSuffix = "(Vigente)";
                } else {
                    // "y los demas deben salir su nombre_pgm"
                    // Determine Plan Name for non-PGM 4
                    let planName = 'Sin Plan';
                    if (v.id_st && dataSemanaRef.current.length > 0) { // SAFE REF ACCESS
                        const foundPlan = dataSemanaRef.current.find(p => (p.id || p.value) === v.id_st);
                        if (foundPlan) planName = foundPlan.label;
                    } else if (v.plan || v.name_pgm) {
                        planName = v.plan || v.name_pgm;
                    }

                    labelSuffix = ` - ${planName}`;
                }

                return {
                    ...v,
                    value: Number(v.id_cli),
                    label: `${v.cliente || v.nombre || 'Cliente'} ${labelSuffix}`,
                    // ... resto de campos ...
                    calculated_end_date: calculatedEnd
                };
            });

            const map = new Map();
            finalOptions.forEach(opt => map.set(opt.value, opt));
            matchingVigentes.forEach(opt => {
                const existing = map.get(opt.value);
                map.set(opt.value, { ...existing, ...opt, calculated_end_date: opt.calculated_end_date || existing?.calculated_end_date });
            });

            finalOptions = Array.from(map.values());
        }

        return {
            options: finalOptions,
            hasMore: hasMore,
            additional: { page: p + 1 }
        };
    }, []);

    const enrichAndSetClient = async (client) => {
        if (!client) {
            setClienteSel(null);
            return;
        }

        let enrichedClient = { ...client };

        // 1. Try to find in Vigentes Store (Fastest & Confirmed Data source for Date)
        const vigentesEntry = vigentes.find(v => v.id_cli === client.value || v.value === client.value);
        if (vigentesEntry && vigentesEntry.fechaFin) {
            enrichedClient.calculated_end_date = vigentesEntry.fechaFin;
        }

        try {
            const res = await entrenamientosApi.getMembresiasActivas(client.value);
            if (res.ok && res.data && res.data.length > 0) {
                const activePlan = res.data.find(p => p.id === client.id_detalle_membresia) || res.data[0];

                if (activePlan) {
                    enrichedClient = {
                        ...enrichedClient,
                        calculated_end_date: activePlan.fechaFin || activePlan.fec_fin_mem || activePlan.fec_fin || enrichedClient.calculated_end_date,
                        dias_congelamiento: activePlan.dias_congelamiento,
                        citas_nutricionales: activePlan.citas_nutricionales,

                        id_detalle_membresia: activePlan.id,
                        id_pgm: activePlan.id_pgm,
                        id_semana: activePlan.id_st,

                        // If API has full name, use it?
                        // name_pgm_original: activePlan.name_pgm
                        fecha_inicio: activePlan.fecha_inicio || enrichedClient.fecha_inicio,

                        // CRITICAL: Map attendance count and total sessions explicitly
                        asistencias_realizadas: activePlan.asistencias_realizadas !== undefined ? activePlan.asistencias_realizadas : enrichedClient.asistencias_realizadas,
                        sesiones_totales: activePlan.sesiones || (activePlan.semanas_st * 5) || enrichedClient.sesiones_totales
                    };
                }
            }
        } catch (error) {
            console.error("Error enriching client data:", error);
        }

        setClienteSel(enrichedClient);
    };

    const handleSelectGeneral = (val) => {
        setValGeneral(val);
        setValHistorial(null);
        enrichAndSetClient(val);
    };

    const handleSelectHistorial = (val) => {
        setValHistorial(val);
        setValGeneral(null);
        enrichAndSetClient(val);
    };

    const textoTurno = useMemo(() => {
        if (!lastUsedTurno || turnos.length === 0) return '';

        // Buscamos el objeto completo usando el ID que ya detectaste
        const t = turnos.find(item => item.id === lastUsedTurno || item.value === lastUsedTurno);

        if (!t) return '';

        // Formateamos el texto (Igual que en la columna que borraste)
        if (t.hora_inicio && t.hora_fin) {
            const inicio = t.hora_inicio.split('T')[1]?.substring(0, 5) || t.hora_inicio.substring(0, 5);
            const fin = t.hora_fin.split('T')[1]?.substring(0, 5) || t.hora_fin.substring(0, 5);
            return `${inicio} - ${fin}`;
        }
        return t.nombre;
    }, [lastUsedTurno, turnos]);

    const handleHistorialSaved = (savedData) => {
        fetchHistorial();
        if (savedData && savedData.id_turno) {
            setLastUsedTurno(savedData.id_turno);
        }
        Swal.fire('Agregado', 'El entrenamiento se agregó correctamente.', 'success');

        // OPTIMISTIC UPDATE
        if (clienteSel) {
            setClienteSel(prev => ({
                ...prev,
                asistencias_realizadas: (prev.asistencias_realizadas || 0) + 1
            }));
        }
    };

    const onCatalogoSaved = (newItem) => {
        setCatalogo(prev => [...prev, newItem]);
        Swal.fire('Creado', `Entrenamiento "${newItem.nombre}" creado.`, 'success');
    };

    const handleCreateTurno = () => {
        setTurnoToEdit(null);
        setShowModalTurno(true);
    };

    const handleEditTurno = (turno) => {
        setTurnoToEdit(turno);
        setShowModalTurno(true);
    };



    // Modified to use session state if available
    const handleAddRow = async () => {
        if (!clienteSel) return Swal.fire('Atención', "Seleccione un cliente primero", 'warning');
        if (catalogo.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Sin Ejercicios',
                text: 'No hay ejercicios en el catálogo. ¿Deseas crear uno?',
                showCancelButton: true,
                confirmButtonText: 'Sí, crear',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    setShowModalCat(true);
                }
            });
            return;
        }

        // 1. Create a local effective client object (starting with current state)
        let effectiveSel = { ...clienteSel };

        // --- OVERLAP CHECK (New Logic) ---
        try {
            // 1. Fetch Active Memberships for NOW
            const nowISO = new Date().toISOString();
            const resMem = await entrenamientosApi.getMembresiasActivas(clienteSel.value, nowISO);

            if (resMem.ok && resMem.data && resMem.data.length > 0) {
                const activeMems = resMem.data;
                const uniquePlans = [...new Map(activeMems.map(m => [m.id, m])).values()]; // Unique by ID detail

                let selectedMem = null;

                if (uniquePlans.length > 1) {
                    // Overlap Detected -> Prompt User
                    const options = {};
                    uniquePlans.forEach(m => {
                        options[m.id] = `${m.name_pgm} (Inicio: ${new Date(m.fecha_inicio).toLocaleDateString()})`;
                    });

                    const { value: membId } = await Swal.fire({
                        title: 'Múltiples Planes Activos',
                        text: 'El cliente tiene varios planes activos hoy. ¿A cuál corresponde este entrenamiento?',
                        input: 'select',
                        inputOptions: options,
                        inputPlaceholder: 'Seleccione un plan...',
                        showCancelButton: true,
                        confirmButtonText: 'Seleccionar',
                        cancelButtonText: 'Cancelar',
                        inputValidator: (value) => {
                            return !value && 'Debe seleccionar un plan';
                        }
                    });

                    if (!membId) return; // User cancelled
                    selectedMem = uniquePlans.find(m => m.id == membId);

                } else if (uniquePlans.length === 1) {
                    // Single Active Plan
                    selectedMem = uniquePlans[0];
                }

                // Update Context if Plan Found
                if (selectedMem) {
                    let planDisplay = selectedMem.name_pgm;
                    let calculatedEnd = null;
                    let semanasSt = 0;
                    let sesionesSt = 0;

                    // Apply Formatting Logic (Same as loadClientes)
                    if (selectedMem.id_st && DataSemanaPGM.length > 0) {
                        const foundPlan = DataSemanaPGM.find(p => (p.id || p.value) === selectedMem.id_st);
                        if (foundPlan) {
                            const label = foundPlan.label;
                            const match = label.match(/(\d+)\s*Semana/i);
                            if (match) semanasSt = parseInt(match[1]);

                            sesionesSt = foundPlan.sesiones || (semanasSt * 5);
                            planDisplay = `${semanasSt} Semanas - ${sesionesSt} Sesiones`;

                            // Calculate End Date
                            if (selectedMem.fecha_inicio) {
                                const start = new Date(selectedMem.fecha_inicio);
                                start.setDate(start.getDate() + (semanasSt * 7));
                                calculatedEnd = start.toISOString();
                            }
                        }
                    }

                    // Update Local Variable
                    effectiveSel.id_detalle_membresia = selectedMem.id;
                    effectiveSel.name_pgm = planDisplay; // Use formatted name
                    effectiveSel.id_pgm = selectedMem.id_pgm;
                    effectiveSel.id_semana = selectedMem.id_st;
                    effectiveSel.calculated_end_date = calculatedEnd; // Add calculated date
                    effectiveSel.fecha_inicio = selectedMem.fecha_inicio; // Capture Start Date

                    // Also update global state for UI/Modal consistency
                    setClienteSel(prev => ({
                        ...prev,
                        id_detalle_membresia: selectedMem.id,
                        name_pgm: planDisplay, // Use formatted name
                        id_pgm: selectedMem.id_pgm,
                        id_semana: selectedMem.id_st,
                        fecha_inicio: selectedMem.fecha_inicio,
                        calculated_end_date: selectedMem.fechaFin || selectedMem.fec_fin_mem || selectedMem.fec_fin || calculatedEnd
                    }));
                }
            }
        } catch (error) {
            console.error("Error checking memberships:", error);
            // Non-blocking error, proceed with existing client selection
        }
        // --- TURNO LOCK LOGIC ---
        // Check if there is already a turno assigned for this Membership ID in the loaded history
        const existingTurnoRow = rowData.find(r => r.id_detalle_membresia === effectiveSel.id_detalle_membresia && r.id_turno);

        if (existingTurnoRow) {
            // LOCK: Use existing turno
            executeAddRow(existingTurnoRow.id_turno, effectiveSel);
        } else {
            // FIRST TIME for this membership: Ask for Turno
            pendingClientRef.current = effectiveSel; // Save context
            setShowModalSelectTurno(true);
        }
    };

    const onTurnoSaved = async (savedTurno, isUpdate = false) => {
        if (isUpdate) {
            setTurnos(prev => prev.map(t => (t.id === savedTurno.id || t.value === savedTurno.id) ? savedTurno : t));
            Swal.fire('Actualizado', `Turno "${savedTurno.nombre}" actualizado.`, 'success');
        } else {
            setTurnos(prev => [...prev, savedTurno]);
            Swal.fire('Creado', `Turno "${savedTurno.nombre}" creado.`, 'success');
        }
    };


    const onCatalogoUpdated = (updatedItem) => {
        setCatalogo(prev => prev.map(c => c.id === updatedItem.id ? updatedItem : c));
        Swal.fire('Actualizado', `Entrenamiento "${updatedItem.nombre}" actualizado.`, 'success');
    };
    const handleAddRowFromFirst = useCallback((node) => {
        if (!gridApi) return;
        const sourceNode = node; // Use the clicked node as source
        if (!sourceNode || !sourceNode.data) {
            return Swal.fire('Error', 'No hay datos en la fila para copiar.', 'warning');
        }
        const dataToCopy = sourceNode.data;

        // --- TURNO LOCK LOGIC (Duplication) ---
        // 1. Identify membership context
        const membershipId = clienteSel?.id_detalle_membresia || dataToCopy.id_detalle_membresia;

        // 2. Search for any row in this membership that has a turno
        const existingTurnoRow = rowData.find(r => r.id_detalle_membresia === membershipId && r.id_turno);

        // 3. Determine the effective Turno
        const effectiveTurnoId = existingTurnoRow?.id_turno || lastUsedTurno || dataToCopy.id_turno;
        const effectiveTurnoObj = existingTurnoRow?.TurnoGimnasio || dataToCopy.TurnoGimnasio;

        // 4. Extract Muscle Group context accurately
        const sourceTypeId = dataToCopy.id_tipo_temp || dataToCopy.CatalogoEntrenamiento?.id_tipo_ejercicio || dataToCopy.CatalogoEntrenamiento?.id_tipo;
        const sourceTypeName = dataToCopy.nombre_tipo_temp || dataToCopy.CatalogoEntrenamiento?.TipoEjercicio?.nombre;

        const newRow = {
            id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            // FECHA: Empty to force manual selection (User request: duplicate everything EXCEPT date)
            fecha: '',
            id_cliente: clienteSel?.value || dataToCopy.id_cliente,
            id_entrenamiento: dataToCopy.id_entrenamiento,
            CatalogoEntrenamiento: dataToCopy.CatalogoEntrenamiento,
            id_tipo_temp: sourceTypeId,
            nombre_tipo_temp: sourceTypeName,
            series: dataToCopy.series,
            repeticiones: dataToCopy.repeticiones,
            peso: dataToCopy.peso,
            tiempo: dataToCopy.tiempo,
            // Use locked/previous turno
            id_turno: effectiveTurnoId,
            TurnoGimnasio: effectiveTurnoObj,
            id_pgm: clienteSel?.id_pgm || dataToCopy.id_pgm,
            id_st: clienteSel?.id_semana || dataToCopy.id_st,
            id_detalle_membresia: membershipId,
            name_pgm: clienteSel?.name_pgm || dataToCopy.name_pgm,
            _new: true,
            _existing: false,
            _modified: true
        };

        const targetIndex = (node.rowIndex !== null && node.rowIndex !== undefined) ? node.rowIndex + 1 : 0;
        gridApi.applyTransaction({ add: [newRow], addIndex: targetIndex });

        // CRITICAL: Synchronize rowData state so it survives re-renders
        setRowData(prev => {
            const updated = [...prev];
            updated.splice(targetIndex, 0, newRow);
            return updated;
        });

        setHasUnsavedChanges(true);

    }, [gridApi, clienteSel, rowData, lastUsedTurno]);

    const handleSaveSingleRow = useCallback(async (node) => {
        console.log("handleSaveSingleRow [START] for node ID:", node.id, "Current data.fecha:", node.data?.fecha);
        // Force commit any pending edits (crucial for mobile)
        if (gridApi) {
            console.log("handleSaveSingleRow: Forcing gridApi.stopEditing(false)...");
            gridApi.stopEditing(false);
        }

        const dataFromNode = node.data;
        console.log("handleSaveSingleRow: Data from node after stopEditing:", { ...dataFromNode });

        const row = { ...dataFromNode }; // Get fresh data copy
        const tempId = row.id;

        // Validaciones básicas
        if (!row.id_entrenamiento) return Swal.fire('Error', 'Debe seleccionar un entrenamiento', 'error');
        if (!row.fecha) {
            console.error("Missing Date in row data object. Data present:", row);
            return Swal.fire('Falta Fecha', 'Debe seleccionar una fecha para el entrenamiento', 'warning');
        }

        // Validation: Future Date
        if (row.fecha && new Date(row.fecha) > new Date()) return Swal.fire('Error', 'Fecha futura no permitida', 'error');

        // Validation: Membership Range
        if (clienteSel && clienteSel.fecha_inicio) {
            const rowDate = new Date(row.fecha);
            const memStart = new Date(clienteSel.fecha_inicio);
            // Normalize times
            rowDate.setHours(0, 0, 0, 0);
            memStart.setHours(0, 0, 0, 0);

            if (rowDate < memStart) {
                return Swal.fire('Fuera de Rango', `La fecha debe ser posterior al inicio de la membresía (${clienteSel.fecha_inicio.split('T')[0]})`, 'warning');
            }

            if (clienteSel.calculated_end_date) {
                const memEnd = new Date(clienteSel.calculated_end_date);
                memEnd.setHours(23, 59, 59, 999);
                if (rowDate > memEnd) {
                    return Swal.fire('Fuera de Rango', `La fecha debe estar dentro de la membresía (hasta ${clienteSel.calculated_end_date.split('T')[0]})`, 'warning');
                }
            }
        }

        // 1. CONFIRMACIÓN CON SWEETALERT
        const actionText = row._new ? 'Se registrará' : 'Se actualizará';
        const titleText = row._new ? '¿Guardar Registro?' : '¿Actualizar Registro?';
        const confirmText = row._new ? 'Sí, guardar' : 'Sí, actualizar';

        const result = await Swal.fire({
            title: titleText,
            html: `${actionText}: <b>${row.CatalogoEntrenamiento?.nombre || 'Ejercicio'}</b><br/>
                   Series: ${row.series} | Reps: ${row.repeticiones} | Peso: ${row.peso}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#198754', // Verde
            cancelButtonColor: '#6c757d',
            confirmButtonText: confirmText,
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
            setSaving(true);

            // CLEAN DATE & LOG
            const cleanDate = new Date(row.fecha).toISOString().split('T')[0];

            let response;

            if (row._new) {
                // Nuevo registro
                response = await entrenamientosApi.saveHistorial({
                    id_cliente: row.id_cliente,
                    id_entrenamiento: row.id_entrenamiento,
                    fecha: cleanDate,
                    series: Number(row.series),
                    repeticiones: Number(row.repeticiones),
                    peso: Number(row.peso),
                    tiempo: row.tiempo || null,
                    id_turno: row.id_turno,
                    id_pgm: row.id_pgm,
                    id_detalle_membresia: row.id_detalle_membresia,
                    comentario: row.comentario
                });
            } else {
                // Actualizar registro existente
                response = await entrenamientosApi.updateHistorial(row.id, {
                    id_entrenamiento: row.id_entrenamiento,
                    fecha: cleanDate,
                    series: Number(row.series),
                    repeticiones: Number(row.repeticiones),
                    peso: Number(row.peso),
                    tiempo: row.tiempo || null,
                    id_turno: row.id_turno,
                    id_pgm: row.id_pgm,
                    comentario: row.comentario
                });
            }

            if (response && response.ok) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Registro guardado correctamente',
                    showConfirmButton: false,
                    timer: 1500
                });

                const updatedRowData = {
                    ...row,
                    ...response.data,
                    // FORCE LOCAL DATE: The server's echo response after insert/update might shift the date backwards
                    // due to Node.js timezone handling, but the actual DB DATEONLY value is correct (hence F5 works).
                    // By keeping our local cleanDate, we prevent the UI from temporarily showing the wrong day.
                    fecha: cleanDate || row.fecha,
                    _new: false,
                    _modified: false,
                    _existing: true
                };

                // PERSIST TURNO: Ensure future duplicates/adds use this turno
                if (updatedRowData.id_turno) {
                    setLastUsedTurno(updatedRowData.id_turno);
                }

                // Sync the state and attendance
                setRowData(prev => {
                    const updated = prev.map(r => r.id === tempId ? updatedRowData : (r.id === updatedRowData.id ? updatedRowData : r));
                    syncAttendanceCount(updated);
                    return updated;
                });

                if (gridApi) {
                    // CRITICAL: If the ID changed (from temp to real), we MUST remove and add to avoid key collisions or losing the node
                    if (row._new) {
                        gridApi.applyTransaction({
                            remove: [{ id: tempId }],
                            add: [updatedRowData],
                            addIndex: node.rowIndex
                        });
                    } else {
                        gridApi.applyTransaction({ update: [updatedRowData] });
                    }
                }

                // (Transaction already updated the grid, state sync handled above)

            } else {
                throw new Error(response.msg || "Error en la respuesta del servidor");
            }

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo guardar el registro: ' + error.message, 'error');
        } finally {
            setSaving(false);
        }
    }, [gridApi, fetchHistorial, clienteSel, syncAttendanceCount]); // Added syncAttendanceCount

    const handleDeleteRow = useCallback(async (node) => {
        const row = node.data;

        const result = await Swal.fire({
            title: '¿Eliminar?',
            text: "Se eliminará este registro.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        if (row._new) {
            // Just remove from grid
            if (gridApi) gridApi.applyTransaction({ remove: [row] });
            setHasUnsavedChanges(checkUnsaved(gridApi));
        } else {
            try {
                setSaving(true);

                await entrenamientosApi.deleteHistorial(row.id);

                await fetchHistorial();
                Swal.fire('Eliminado', 'Registro eliminado.', 'success');
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'Error al eliminar', 'error');
            } finally {
                setSaving(false);
            }
        }
    }, [gridApi, fetchHistorial, syncAttendanceCount]);

    // Helper to check unsaved
    const checkUnsaved = (api) => {
        if (!api) return false;
        let unsaved = false;
        api.forEachNode(node => {
            if (node.data._new || node.data._modified) unsaved = true;
        });
        return unsaved;
    };

    const displayPlanInfo = useMemo(() => {
        let displayPlanName = clienteSel?.name_pgm_original || clienteSel?.name_pgm || clienteSel?.plan;
        let displayEndDate = clienteSel?.calculated_end_date;

        if (clienteSel?.id_semana && DataSemanaPGM && DataSemanaPGM.length > 0) {
            const foundPlan = DataSemanaPGM.find(p => (p.id || p.value) == clienteSel.id_semana);
            if (foundPlan) {
                displayPlanName = foundPlan.label;

                if (!displayEndDate && clienteSel.fecha_inicio) {
                    let weeks = foundPlan.semanas;
                    
                    if (!weeks) {
                        const match = foundPlan.label.match(/SEMANAS\s+(\d+)/i) || foundPlan.label.match(/(\d+)\s*Semana/i);
                        if (match) weeks = parseInt(match[1]);
                    }

                    if (weeks > 0) {
                        const start = new Date(clienteSel.fecha_inicio);
                        start.setDate(start.getDate() + (weeks * 7));
                        displayEndDate = start.toISOString();
                    }
                }
            }
        }
        return { displayPlanName, displayEndDate };
    }, [clienteSel, DataSemanaPGM]);

    return {
        clienteSel, setClienteSel,
        catalogo, setCatalogo,
        tiposEjercicio, setTiposEjercicio,
        turnos, setTurnos,
        rowData, setRowData,
        gridApi, setGridApi,
        hasUnsavedChanges, setHasUnsavedChanges,
        saving, setSaving,
        showModalCat, setShowModalCat,
        showModalEditCat, setShowModalEditCat,
        showModalHistorial, setShowModalHistorial,
        showModalTurno, setShowModalTurno,
        turnoToEdit,
        valGeneral, setValGeneral,
        valHistorial, setValHistorial,
        loadClientes,
        textoTurno,
        loadClientesHistorial,
        handleSelectGeneral,
        handleSelectHistorial,
        handleAddRow,

        handleSave,
        handleHistorialSaved,
        onCatalogoSaved,
        handleCreateTurno,
        handleEditTurno,
        onTurnoSaved,
        onCatalogoUpdated,
        onCellValueChanged,
        planOptions: DataSemanaPGM,

        showModalSelectTurno, setShowModalSelectTurno,
        handleConfirmTurnoSelection,
        lastUsedTurno,

        // Export New Handlers
        handleAddRowFromFirst,
        handleSaveSingleRow,
        handleDeleteRow,

        // Derived Rendering Information
        displayPlanName: displayPlanInfo.displayPlanName,
        displayEndDate: displayPlanInfo.displayEndDate
    };
}
