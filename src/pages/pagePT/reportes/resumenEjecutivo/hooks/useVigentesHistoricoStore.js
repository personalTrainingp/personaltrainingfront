import { useState, useEffect } from 'react';
import PTApi from '@/common/api/PTApi';

// Global cache outside the hook (acting as a store)
const store = {
    data: {},
    loading: {},
    error: {},
    listeners: new Set(),
    notify: () => {
        store.listeners.forEach(l => l());
    }
};

export const useVigentesHistoricoStore = () => {
    // Local state to force re-render when store updates
    const [, forceUpdate] = useState({});

    useEffect(() => {
        const listener = () => forceUpdate({});
        store.listeners.add(listener);
        return () => {
            store.listeners.delete(listener);
        };
    }, []);

    const fetchVigentesHistorico = async (id_empresa, year) => {
        const empresa = id_empresa || 598;
        const key = `${empresa}-${year}`;

        // Evitar peticiones duplicadas si ya está cargando o ya tiene datos
        if (store.loading[key] || store.data[key]) {
            return;
        }

        store.loading[key] = true;
        store.error[key] = null;
        store.notify();

        try {
            // Request for the full year (selectedMonth=12) to ensure we get all months
            const { data } = await PTApi.get("/parametros/membresias/vigentes/historico", {
                params: {
                    empresa,
                    year,
                    selectedMonth: 12,
                },
            });

            store.data[key] = Array.isArray(data) ? data : [];
            store.loading[key] = false;
            store.notify();
        } catch (error) {
            console.error("Error fetching vigentes historico store", error);
            store.error[key] = error;
            store.loading[key] = false;
            store.notify();
        }
    };

    return {
        fetchVigentesHistorico,
        data: { ...store.data },
        loading: { ...store.loading },
        error: { ...store.error }
    };
};
