import React, { useMemo } from 'react';
import { ExerciseSelectEditor } from '../ExerciseSelectEditor';
import { VideoThumbnailCellRenderer } from '../VideoThumbnailCellRenderer';

export function useGestEntrenamientosColumns({
    catalogo,
    catalogoMap,
    tiposEjercicio,
    onCellValueChanged,
    handleSaveSingleRow,
    handleDeleteRow,
    handleAddRowFromFirst,
    isMobile
}) {
    const colDefs = useMemo(() => [
        {
            field: 'fecha',
            headerName: 'Fecha\n / Día',
            editable: (params) => !params.data._existing || (params.data.date_edit_count || 0) < 1,
            flex: 1.5,
            cellEditor: 'agDateStringCellEditor',
            cellEditorParams: {
                min: '2024-01-01'
            },
            valueSetter: (params) => {
                console.log("valueSetter: Setting fecha to:", params.newValue);
                if (params.newValue !== params.oldValue) {
                    let finalDate = params.newValue;
                    // Forzamos el formato en YYYY-MM-DD por si acaso lo envia distinto
                    if (finalDate && finalDate.includes('/')) {
                        finalDate = finalDate.replace(/\//g, '-');
                    }
                    params.data.fecha = finalDate;
                    return true;
                }
                return false;
            },
            cellStyle: (params) => {
                const locked = params.data._existing && (params.data.date_edit_count || 0) >= 1;
                return {
                    fontSize: '20px',
                    whiteSpace: 'pre-wrap',
                    backgroundColor: locked ? '#e9ecef' : 'white',
                    color: locked ? '#6c757d' : 'inherit',
                    cursor: locked ? 'not-allowed' : 'text'
                };
            },
            autoHeight: true,
            wrapText: true,
            valueFormatter: (params) => {
                const val = params.value;
                if (!val) return '';

                let dateObj;

                if (typeof val === 'string') {
                    const cleanDate = val.substring(0, 10);

                    // Evaluamos si el string viene en formato YYYY-MM-DD
                    if (cleanDate.match(/^\d{4}-\d{2}-\d{2}/)) {
                        const [y, m, d] = cleanDate.split('-').map(Number);
                        dateObj = new Date(y, m - 1, d, 12, 0, 0);
                    }
                    // Evaluamos si el string viene en formato DD-MM-YYYY o DD/MM/YYYY
                    else if (cleanDate.match(/^\d{2}[\/\-]\d{2}[\/\-]\d{4}/)) {
                        const parts = cleanDate.split(/[\/\-]/).map(Number);
                        const [d, m, y] = parts;
                        dateObj = new Date(y, m - 1, d, 12, 0, 0);
                    } else {
                        return val;
                    }
                } else if (val instanceof Date) {
                    dateObj = val;
                } else {
                    return val;
                }

                // Formateo final visual
                const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'long' });
                const fullDate = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

                return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}\n${fullDate}`;
            }
        },
        {
            headerName: 'Grupo Muscular',
            field: 'tipo_temp',
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellStyle: { fontSize: '20px' },
            cellEditorParams: {
                values: tiposEjercicio.map(t => t.nombre)
            },
            valueGetter: (params) => {
                if (params.data.nombre_tipo_temp) return params.data.nombre_tipo_temp;
                const cat = params.data.CatalogoEntrenamiento;
                if (cat && cat.TipoEjercicio?.nombre) return cat.TipoEjercicio.nombre;
                const exerciseId = params.data.id_entrenamiento;

                if (exerciseId) {
                    const foundEx = catalogo.find(c => c.id == exerciseId);
                    if (foundEx?.TipoEjercicio?.nombre) return foundEx.TipoEjercicio.nombre;
                    const tipoId = foundEx?.id_tipo || foundEx?.id_tipo_ejercicio || params.data.id_tipo_temp;

                    if (tipoId) {
                        const foundType = tiposEjercicio.find(t => t.id == tipoId);
                        if (foundType) return foundType.nombre;
                    }
                }
                return '';
            },
            valueSetter: (params) => {
                const newVal = params.newValue;
                if (params.oldValue === newVal) return false;

                const foundType = tiposEjercicio.find(t => t.nombre === newVal);
                if (!foundType) return false;

                // 1. Mutamos el objeto data directamente
                params.data.id_tipo_temp = foundType.id || foundType.id_tipo_ejercicio || foundType.id_tipo;
                params.data.nombre_tipo_temp = foundType.nombre;

                // Reseteamos los campos dependientes
                params.data.id_entrenamiento = null;
                params.data.CatalogoEntrenamiento = null;
                params.data.peso = 0;
                params.data.tiempo = '';

                // 2. Retornamos TRUE para que AG Grid dispare onCellValueChanged por sí solo
                return true;
            },
            flex: 1
        },
        {
            // CAMBIO CLAVE: Agregamos 'field' en lugar de colId para que onCellValueChanged lo detecte
            field: 'entrenamiento_nombre',
            colId: 'entrenamiento_nombre',
            headerName: 'Entrenamiento',
            editable: (params) => {
                if (params.data._new) return true;
                if (params.data.id_tipo_temp) return true;
                const cat = params.data.CatalogoEntrenamiento;
                if (cat && (cat.id_tipo_ejercicio || cat.id_tipo)) return true;
                if (params.data.id_entrenamiento) {
                    const foundEx = catalogo.find(c => c.id == params.data.id_entrenamiento);
                    if (foundEx && (foundEx.id_tipo || foundEx.id_tipo_ejercicio)) return true;
                }
                return false;
            },
            cellEditor: 'agSelectCellEditor',
            cellStyle: { fontSize: '20px' },
            cellEditorParams: (params) => {
                const fullCatalogo = catalogo || [];
                let currentTypeId = params.data.id_tipo_temp;
                const currentData = params.data;

                if (!currentTypeId) {
                    currentTypeId = currentData.CatalogoEntrenamiento?.id_tipo_ejercicio || currentData.CatalogoEntrenamiento?.id_tipo;
                }

                if (!currentTypeId && currentData.id_entrenamiento) {
                    const foundEx = fullCatalogo.find(c => String(c.id) === String(currentData.id_entrenamiento));
                    if (foundEx) {
                        currentTypeId = foundEx.id_tipo || foundEx.id_tipo_ejercicio;
                    }
                }

                const filtered = fullCatalogo.filter(c => {
                    const typeId = c.id_tipo || c.id_tipo_ejercicio;
                    return String(typeId) === String(currentTypeId);
                });

                return {
                    values: filtered.map(opt => opt.nombre)
                };
            },
            valueGetter: (params) => {
                return params.data.CatalogoEntrenamiento?.nombre || catalogoMap[params.data.id_entrenamiento] || '';
            },
            valueSetter: (params) => {
                const selectedName = params.newValue;
                if (params.oldValue === selectedName) return false;

                const found = catalogo.find(c => c.nombre === selectedName);
                if (!found) return false;

                // 1. Mutamos el data
                params.data.id_entrenamiento = found.id;
                params.data.CatalogoEntrenamiento = found;
                params.data.id_tipo_temp = found.id_tipo || found.id_tipo_ejercicio;
                params.data.nombre_tipo_temp = found.TipoEjercicio?.nombre;

                // Lógica de peso y tiempo
                const valPeso = found.TipoEjercicio?.usa_peso;
                const usaPeso = valPeso != 0 && valPeso != false;
                if (!usaPeso) params.data.peso = 0;

                const valTiempo = found.TipoEjercicio?.usa_tiempo;
                const usaTiempo = valTiempo == 1 || valTiempo == true;
                if (!usaTiempo) params.data.tiempo = '';

                // 2. Retornamos TRUE
                return true;
            },
            flex: 1.8,
            autoHeight: true,
            wrapText: true
        },
        {
            field: 'series',
            headerName: 'Series',
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: [2, 3, 4, 5, 6]
            },
            flex: 0.6,
            cellStyle: { fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }
        },
        {
            field: 'repeticiones',
            headerName: 'Repeticiones',
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            },
            flex: 1,
            cellStyle: { fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }
        },
        {
            field: 'peso',
            headerName: 'Peso Alcanzado',
            editable: (params) => {
                let catInfo = params.data.CatalogoEntrenamiento;
                if (!catInfo?.TipoEjercicio) {
                    catInfo = catalogo.find(c => c.id == params.data.id_entrenamiento);
                }
                if (!catInfo) return true;
                const val = catInfo.TipoEjercicio?.usa_peso;
                return val != 0 && val != false;
            },
            cellEditorSelector: (params) => {
                let catInfo = params.data.CatalogoEntrenamiento;
                if (!catInfo) {
                    catInfo = catalogo.find(c => c.id == params.data.id_entrenamiento);
                }

                // Helper to generate range
                const range = (start, end, step) => {
                    const arr = [];
                    for (let i = start; i <= end; i += step) {
                        arr.push(i);
                    }
                    return arr;
                };

                // Check es_maquina flag (handle 1, '1', true)
                const isMachine = catInfo?.es_maquina == 1 || catInfo?.es_maquina === true;

                if (isMachine) {
                    return {
                        component: 'agSelectCellEditor',
                        params: { values: range(10, 100, 10) }
                    };
                }

                // Default to 2.5 increments for Free Weights (2.5 to 40)
                return {
                    component: 'agSelectCellEditor',
                    params: { values: range(2.5, 40, 2.5) }
                };
            },
            cellStyle: (params) => {
                const baseStyle = { fontSize: '20px', textAlign: 'center' };
                let catInfo = params.data.CatalogoEntrenamiento;
                if (!catInfo?.TipoEjercicio) {
                    catInfo = catalogo.find(c => c.id == params.data.id_entrenamiento);
                }
                const val = catInfo?.TipoEjercicio?.usa_peso;
                const usaPeso = val != 0 && val != false;

                if (!usaPeso) return { ...baseStyle, background: '#e9ecef', color: '#adb5bd', cursor: 'not-allowed' };
                return baseStyle;
            },
            flex: 0.8,
        },
        {
            headerName: 'Video\nTutorial',
            colId: 'video',
            flex: 0.7,
            suppressSizeToFit: true,
            editable: false,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            cellRenderer: VideoThumbnailCellRenderer,
            valueGetter: (params) => {
                const cat = params.data.CatalogoEntrenamiento;
                if (cat && cat.url_video) return cat.url_video;

                const exerciseId = params.data.id_entrenamiento;

                if (exerciseId) {
                    const foundEx = catalogo.find(c => c.id == exerciseId);
                    if (foundEx && foundEx.url_video) return foundEx.url_video;
                }

                return '';
            }
        },
        {
            field: 'comentario',
            headerName: 'Comentario',
            editable: true,
            cellEditor: 'agLargeTextCellEditor',
            cellEditorPopup: true,
            flex: 0.8,
            cellStyle: { fontSize: '14px', whiteSpace: 'pre-wrap', display: 'flex', alignItems: 'center' },
            autoHeight: true,
            wrapText: true
        },
        {
            headerName: 'Atajos',
            colId: 'acciones',
            width: 150, // Increased width
            flex: 0.8, // Optional: so it looks good on desktop
            suppressSizeToFit: true,
            cellRenderer: (params) => {
                const row = params.data;
                const showSave = row._new || row._modified;
                const showDelete = row._new;
                return (
                    <div className="d-flex align-items-center justify-content-center h-100 gap-2">
                        {/* BOTÓN GUARDAR (Check) */}
                        {showSave && (
                            <button
                                className="btn btn-sm btn-outline-success p-1"
                                style={{ width: '30px', height: '30px' }}
                                title="Guardar cambios"
                                onMouseDown={(e) => {
                                    console.log("Save Button onMouseDown fired");
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleSaveSingleRow(params.node);
                                }}
                                onTouchStart={(e) => {
                                    console.log("Save Button onTouchStart fired");
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleSaveSingleRow(params.node);
                                }}
                            >
                                <i className="bi bi-check-lg"></i>
                            </button>
                        )}

                        {/* BOTÓN ELIMINAR (X) - Solo para borradores */}
                        {showDelete && (
                            <button
                                className="btn btn-sm btn-outline-danger p-1"
                                style={{ width: '30px', height: '30px' }}
                                title="Descartar borrador"
                                onClick={() => handleDeleteRow(params.node)}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        )}

                        {/* BOTÓN DUPLICAR (+) - Siempre visible */}
                        <button
                            className="btn btn-sm btn-outline-info p-1"
                            style={{ width: '30px', height: '30px' }}
                            title="Duplicar ejercicio"
                            onClick={() => handleAddRowFromFirst(params.node)}
                        >
                            <i className="bi bi-plus-lg"></i>
                        </button>
                    </div>
                );
            }
        }
    ], [catalogo, catalogoMap, tiposEjercicio, isMobile, onCellValueChanged, handleSaveSingleRow, handleDeleteRow, handleAddRowFromFirst]);

    return colDefs;
}
