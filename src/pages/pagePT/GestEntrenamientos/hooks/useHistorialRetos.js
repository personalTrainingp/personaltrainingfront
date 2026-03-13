import { useState, useEffect, useCallback } from 'react';
import { entrenamientosApi } from '@/api/entrenamientosApi';

export const useHistorialRetos = (idCliente) => {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchHistorial = useCallback(async () => {
        if (!idCliente) return;
        setLoading(true);
        setError(null);
        try {
            // Fetch Results and Sales in parallel
            const [resResultados, resVentas] = await Promise.all([
                entrenamientosApi.getResultadosReto(idCliente),
                entrenamientosApi.getVentasCliente(idCliente)
            ]);

            const resultados = resResultados.ok ? resResultados.data : [];
            const ventas = resVentas.ok ? resVentas.data : [];

            // Merge Logic: Sales are the "Slots"
            const mergedHistorial = ventas.map((venta) => {
                // Find matching result
                const existingResult = resultados.find(r => r.id_venta === venta.id);
                // Define 'det' here to be accessible in both branches
                const det = venta.detalle_ventaMembresia?.[0];

                if (existingResult) {
                    // Inject membership detail ID from the sale structure if missing
                    return {
                        ...existingResult,
                        id_detalle_membresia: existingResult.id_detalle_membresia || det?.id,
                        asistencias_realizadas: venta.asistencias_realizadas,
                        sesiones_totales: venta.sesiones_totales
                    };
                } else {
                    // Create Virtual/Empty Result based on Sale
                    const semanasInfo = det?.SemanasTraining;
                    const programaInfo = det?.tb_ProgramaTraining;

                    return {
                        id: null, // No ID = New
                        id_venta: venta.id, // Link to Sale
                        id_cliente: idCliente,
                        id_detalle_membresia: det?.id, // CRITICAL: For matching
                        // User pointed out specific DB fields. Map them carefully.
                        fecha_registro_inicial: det?.fecha_inicio || det?.fec_inicio_mem,
                        fecha_registro_final: det?.fec_fin_mem || det?.fec_fin_mem_oftime,
                        semanas_plan: semanasInfo?.semanas_st || 0,
                        nombre_plan: programaInfo?.name_pgm || venta.observacion || "Plan",
                        // Empty metrics
                        peso_inicial: '', grasa_inicial: '', musculo_inicial: '',
                        peso_final: '', grasa_final: '', musculo_final: '',
                        _isNew: true, // Flag for UI
                        asistencias_realizadas: venta.asistencias_realizadas || 0,
                        sesiones_totales: venta.sesiones_totales || 0
                    };
                }
            });

            // Optional: Sort by date descending (though sales are likely sorted)
            // If needed, re-calculate transitions here if backend only calculated them for saved ones.
            // For now, allow backend logic to persist on saved ones, and UI handles new ones.

            setHistorial(mergedHistorial);

        } catch (err) {
            console.error("Error fetching historial retos", err);
            setError("Error de conexión");
        } finally {
            setLoading(false);
        }
    }, [idCliente]);

    useEffect(() => {
        fetchHistorial();
    }, [fetchHistorial]);

    return { historial, loading, error, refetch: fetchHistorial };
};
