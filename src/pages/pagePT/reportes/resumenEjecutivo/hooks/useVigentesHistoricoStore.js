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

    /**
     * Fetches the historical vigentes data for the given empresa and year.
     * @param {number} id_empresa
     * @param {number} year
     * @param {number|null} cutDay  - Day of the month to use as the cut-off snapshot (from the user's UI control)
     * @param {number|null} cutMonth - Month number for which cutDay applies. Defaults to selectedMonth.
     *   The store always requests selectedMonth=12 to get all 12 months, but the backend must know
     *   which specific month the cutDay refers to (e.g. January when user is viewing Jan 2025).
     */
    const fetchVigentesHistorico = async (id_empresa, year, cutDay = null, cutMonth = null) => {
        const empresa = id_empresa || 598;
        const key = `${empresa}-${year}-${cutMonth ?? 'x'}-${cutDay ?? 'last'}`;

        // Evitar peticiones duplicadas si ya está cargando o ya tiene datos
        if (store.loading[key] || store.data[key]) {
            return;
        }

        store.loading[key] = true;
        store.error[key] = null;
        store.notify();

        try {
            // Always request selectedMonth=12 to get all 12 months of the year.
            // cutMonth + cutDay tell the backend which specific month uses the cut-off day.
            const params = {
                empresa,
                year,
                selectedMonth: 12,
            };
            if (cutDay != null) {
                params.cutDay = cutDay;
            }
            if (cutMonth != null) {
                params.cutMonth = cutMonth;
            }

            const { data } = await PTApi.get("/parametros/membresias/vigentes/historico", { params });

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
