
import { useState, useEffect } from "react";
import PTApi from "../../../../../common/api/PTApi";

export const useMultiplesContratos = (show, id_empresa) => {
    const [socios, setSocios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedRows, setExpandedRows] = useState(null);

    useEffect(() => {
        if (show) {
            fetchData();
        }
    }, [show, id_empresa]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await PTApi.get(
                `/parametros/socios/multiples-contratos`,
                { params: { empresa: id_empresa } }
            );

            const sociosData = (response.data.socios || []).map((s) => {
                const contratos = s.contratos || [];
                const monto_total = contratos.reduce(
                    (acc, c) => acc + Number(c.tarifa_monto || 0),
                    0
                );

                // Extraemos fechas válidas para buscar los extremos
                const inicios = contratos
                    .map((c) => new Date(c.fec_inicio_mem))
                    .filter((d) => !isNaN(d.getTime()));
                const fines = contratos
                    .map((c) => new Date(c.fec_fin_mem))
                    .filter((d) => !isNaN(d.getTime()));

                return {
                    ...s,
                    monto_total,
                    fecha_min: inicios.length ? new Date(Math.min(...inicios)) : null,
                    fecha_max: fines.length ? new Date(Math.max(...fines)) : null,
                };
            });

            setSocios(sociosData);
        } catch (error) {
            console.error("Error obteniendo socios multicontrato:", error);
            setSocios([]);
        } finally {
            setLoading(false);
        }
    };

    return {
        socios,
        loading,
        expandedRows,
        setExpandedRows,
        refetch: fetchData,
    };
};
