import { useState, useEffect, useMemo, useCallback } from 'react';
import { entrenamientosApi } from '@/api/entrenamientosApi';
import { DetailCellRenderer } from '../DetailCellRenderer';
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
export function useHistorialEntrenamientosLogic() {
    const { DataSemanaPGM, obtenerSemanasPorPrograma } = useTerminoStore();

    useEffect(() => {
        if (!DataSemanaPGM || DataSemanaPGM.length === 0) {
            obtenerSemanasPorPrograma(4);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [initDay, setInitDay] = useState(1);
    const [cutDay, setCutDay] = useState(today.getDate());

    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [gridApi, setGridApi] = useState(null);
    const [viewingClient, setViewingClient] = useState(null); // ID del cliente para ver detalles
    const [selectedClient, setSelectedClient] = useState(null);
    const [membresias, setMembresias] = useState([]);
    const [selectedMembresia, setSelectedMembresia] = useState(null);

    useEffect(() => {
        if (selectedClient) {
            entrenamientosApi.getVentasCliente(selectedClient.value).then(res => {
                if (res.ok) {
                    setMembresias(res.data);
                    if (res.data.length > 0) {

                        setSelectedMembresia(res.data[0]);
                    } else {
                        setSelectedMembresia(null);
                    }
                }
            });
        } else {
            setMembresias([]);
            setSelectedMembresia(null);
        }
    }, [selectedClient]);

    const filteredRowData = useMemo(() => {
        if (!selectedMembresia) return rowData;

        const idDetalle = selectedMembresia.detalle_ventaMembresia?.[0]?.id;
        if (!idDetalle) return rowData;

        return rowData.filter(r => r.id_detalle_membresia === idDetalle);
    }, [rowData, selectedMembresia]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            if (selectedClient) {
                const res = await entrenamientosApi.getHistorial(selectedClient.value);
                if (res.ok) {
                    setRowData(res.data || []);
                } else {
                    setRowData([]);
                }
            } else {
                let fromDate, toDate;
                const y = year;
                const m = selectedMonth - 1;

                if (initDay <= cutDay) {
                    fromDate = new Date(y, m, initDay);
                    toDate = new Date(y, m, cutDay, 23, 59, 59);
                } else {
                    fromDate = new Date(y, m - 1, initDay);
                    toDate = new Date(y, m, cutDay, 23, 59, 59);
                }

                const res = await entrenamientosApi.getHistorialGlobal({
                    from: fromDate.toISOString(),
                    to: toDate.toISOString()
                });

                if (res.ok) {
                    setRowData(res.data || []);
                } else {
                    setRowData([]);
                }
            }
        } catch (error) {
            console.error(error);
            setRowData([]);
        } finally {
            setLoading(false);
        }
    }, [selectedClient, year, selectedMonth, initDay, cutDay]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const loadClientesHistorial = async (search, prevOptions, { page }) => {
        const limit = 20;
        const p = page || 1;
        const { rows, hasMore } = await entrenamientosApi.getClientesConHistorial({ search: search, page: p, limit, onlyWithHistory: true });
        return {
            options: rows.map(r => {
                const idSt = r.id_st || r.id_semana;
                let finalPlanName = r.name_pgm;
                if (idSt && DataSemanaPGM && DataSemanaPGM.length > 0) {
                    const found = DataSemanaPGM.find(w => w.id == idSt || w.value == idSt);
                    if (found) finalPlanName = found.label;
                }

                return {
                    value: Number(r.value),
                    label: `${r.label || r.nombre} ${r.email_cli ? '- ' + r.email_cli : ''}`,
                    ...r,
                    name_pgm: finalPlanName
                };
            }),
            hasMore,
            additional: { page: p + 1 }
        };
    };

    const colDefs = useMemo(() => [


        {
            field: 'fecha',
            headerName: 'DIA / FECHA',
            colId: 'fecha',
            flex: 1,
            cellStyle: { fontSize: '20px', whiteSpace: 'pre-wrap', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'left' },
            autoHeight: true,
            wrapText: true,
            valueFormatter: (params) => {
                const val = params.value;
                if (!val) return '';

                let localDate;
                if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}/)) {
                    // Safe parse YYYY-MM-DD
                    const [y, m, d] = val.substring(0, 10).split('-').map(Number);
                    localDate = new Date(y, m - 1, d); // Local Midnight
                } else {
                    const d = new Date(val);
                    if (isNaN(d.getTime())) return val;
                    // If it was UTC string, convert to local date parts
                    localDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
                }

                const dayName = localDate.toLocaleDateString('es-ES', { weekday: 'long' });
                const fullDate = localDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

                return `${dayName}\n${fullDate}`;
            }
        },
        {
            headerName: 'Grupo Muscular',
            colId: 'grupo_muscular',
            flex: 1,
            cellStyle: { fontSize: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
            valueGetter: (params) => {
                return params.data.CatalogoEntrenamiento?.TipoEjercicio?.nombre || '-';
            }
        },
        {
            field: 'CatalogoEntrenamiento.nombre',
            headerName: 'Entrenamiento',
            colId: 'entrenamiento',
            flex: 1.2,
            cellStyle: { fontSize: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }
        },



        { field: 'series', headerName: 'Series', colId: 'series', flex: 0.4, cellStyle: { fontSize: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' } },
        { field: 'repeticiones', headerName: 'Repeticiones', colId: 'repeticiones', flex: 0.6, cellStyle: { fontSize: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' } },
        { field: 'peso', headerName: 'Peso\nalcanzado', colId: 'peso', flex: 0.5, cellStyle: { fontSize: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }, wrapHeaderText: true, autoHeaderHeight: true },
        {
            field: 'comentario',
            headerName: 'Comentario',
            colId: 'comentario',
            flex: 1,
            cellStyle: { fontSize: '16px', whiteSpace: 'pre-wrap', display: 'flex', alignItems: 'center' },
            autoHeight: true,
            wrapText: true
        },
        {
            headerName: 'Detalles',
            colId: 'detalles',
            flex: 0.5,
            cellStyle: { fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
            cellRenderer: DetailCellRenderer
        }
    ], [selectedClient, DataSemanaPGM]);

    return {
        year, setYear,
        selectedMonth, setSelectedMonth,
        initDay, setInitDay,
        cutDay, setCutDay,
        rowData: filteredRowData, // Export filtered rows
        membresias, // Export mships
        selectedMembresia, setSelectedMembresia, // Export selection
        selectedClient, setSelectedClient, loadClientesHistorial,
        loading,
        setGridApi,
        colDefs,
        viewingClient, setViewingClient,
        handleSearch: fetchData
    };
}
