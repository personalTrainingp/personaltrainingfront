import { useState, useEffect, useCallback } from 'react';
import PTApi from '@/common/api/PTApi';

export const useConflictsHistory = (id_empresa, show) => {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch for years 2024, 2025, 2026 (covering relevant history)
            // We must fetch ALL months because the endpoint filters by month.
            const years = [2024, 2025, 2026];
            const months = Array.from({ length: 12 }, (_, i) => i + 1);

            // Create a promise for every year-month combination
            const promises = [];
            years.forEach(y => {
                months.forEach(m => {
                    promises.push(
                        PTApi.get('/parametros/renovaciones/por-rango-fechas', {
                            params: {
                                empresa: id_empresa || 598,
                                year: y,
                                selectedMonth: m,
                                initDay: 1,
                                cutDay: new Date(y, m, 0).getDate(), // Automatically correct date
                            }
                        }).then(res => res.data?.cruces || [])
                            .catch(e => {
                                console.warn(`Error fetching history for ${y}-${m}`, e);
                                return [];
                            })
                    );
                });
            });

            const results = await Promise.all(promises);
            const all = results.flat();

            // Deduplicate by unique key just in case
            const unique = [];
            const ids = new Set();
            all.forEach(item => {
                const key = `${item.cliente_id}-${item.inicio_A}-${item.inicio_B}`;
                if (!ids.has(key)) {
                    ids.add(key);
                    unique.push(item);
                }
            });

            // Sort by most recent start date
            unique.sort((a, b) => new Date(b.inicio_B) - new Date(a.inicio_B));

            setHistoryData(unique);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    }, [id_empresa]);

    useEffect(() => {
        if (show) {
            fetchHistory();
        }
    }, [show, fetchHistory]);

    return {
        historyData,
        loading,
        fetchHistory
    };
};
