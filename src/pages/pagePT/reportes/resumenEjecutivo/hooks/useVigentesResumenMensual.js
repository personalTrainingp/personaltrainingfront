
import { useMemo, useState, useEffect } from "react";
import { useVigentesHistoricoStore } from "./useVigentesHistoricoStore";
import { norm } from "./useResumenUtils";

const MONTH_LABELS = [
    "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
    "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
];

export function useVigentesResumenMensual({
    id_empresa,
    year,
    selectedMonth,
    cutDay = null,
    cutMonth = null,
    pgmNameById,
    avataresDeProgramas = [],
}) {
    const [isOpenLast, setIsOpenLast] = useState(false);
    const [isOpenCurr, setIsOpenCurr] = useState(false);

    // Store hook
    const { fetchVigentesHistorico, data, loading } = useVigentesHistoricoStore();

    // Loading state specific to this component's data key
    const isLoading = loading[`${id_empresa || 598}-${year}-${cutMonth ?? 'x'}-${cutDay ?? 'last'}`] || false;

    // 1. Trigger fetch on expand/change
    useEffect(() => {
        if (isOpenLast || isOpenCurr) {
            fetchVigentesHistorico(id_empresa, year, cutDay, cutMonth);
        }
    }, [id_empresa, year, cutDay, cutMonth, isOpenLast, isOpenCurr, fetchVigentesHistorico]);

    const { lastYearCols, currentYearCols } = useMemo(
        () => buildColumnsConfig(year, selectedMonth),
        [year, selectedMonth]
    );

    const allCols = useMemo(
        () => [...lastYearCols, ...currentYearCols],
        [lastYearCols, currentYearCols]
    );

    // Map current column ID to NEXT column ID for forward calculation
    const nextColById = useMemo(() => {
        const map = {};
        for (let i = 0; i < allCols.length - 1; i++) {
            map[allCols[i].id] = allCols[i + 1].id;
        }
        return map;
    }, [allCols]);

    // Derived state: Matrix of current year data
    const progMatrix = useMemo(() => {
        if (!isOpenLast && !isOpenCurr) return {}; // Lazy execution

        const dataKey = `${id_empresa || 598}-${year}-${cutMonth ?? 'x'}-${cutDay ?? 'last'}`;
        const results = data[dataKey] || [];
        const nextMatrix = {};

        for (const { colId, rows } of results) {
            if (!Array.isArray(rows)) continue;

            for (const r of rows) {
                const rawName =
                    r?.plan ||
                    pgmNameById?.[r?.id_pgm] ||
                    r?.tb_programa_training?.name_pgm ||
                    r?.tb_programa?.name_pgm ||
                    r?.tb_programaTraining?.name_pgm ||
                    "SIN PROGRAMA";

                const key = norm(rawName);

                const foundAvatar = avataresDeProgramas.find(
                    (item) => item.name_image === rawName
                );

                if (!nextMatrix[key]) {
                    nextMatrix[key] = {
                        label: rawName,
                        avatar: foundAvatar?.urlImage || null,
                        counts: {},
                    };
                }

                nextMatrix[key].counts[colId] = (nextMatrix[key].counts[colId] || 0) + 1;
            }
        }

        return nextMatrix;
    }, [data, id_empresa, year, pgmNameById, avataresDeProgramas, isOpenLast, isOpenCurr]);

    // Calculate totals for ALL columns
    const allColumnTotals = useMemo(() => {
        if (!isOpenLast && !isOpenCurr) return {}; // Lazy execution

        const totals = {};
        allCols.forEach((c) => (totals[c.id] = 0));
        Object.values(progMatrix).forEach((row) => {
            allCols.forEach((c) => {
                totals[c.id] += row.counts[c.id] || 0;
            });
        });
        return totals;
    }, [progMatrix, allCols, isOpenLast, isOpenCurr]);

    const lastYearTable = useMemo(() => {
        if (!isOpenLast) return { rows: [], footer: { perMonth: {}, total: 0 } };
        return buildTableData(lastYearCols, progMatrix);
    }, [lastYearCols, progMatrix, isOpenLast]);

    const currentYearTable = useMemo(() => {
        if (!isOpenCurr) return { rows: [], footer: { perMonth: {}, total: 0 } };
        return buildTableData(currentYearCols, progMatrix);
    }, [currentYearCols, progMatrix, isOpenCurr]);

    return {
        isOpenLast,
        setIsOpenLast,
        isOpenCurr,
        setIsOpenCurr,
        loading: isLoading,
        lastYearCols,
        currentYearCols,
        nextColById,
        allColumnTotals,
        lastYearTable,
        currentYearTable,
        calcPctForward, // Export helper logic
    };
}

// === HELPERS DE NEGOCIO (PURE JS) ===

function buildColumnsConfig(year, selectedMonth) {
    const prevYear = year - 1;

    const lastYearCols = [9, 10, 11, 12].map((m) => ({
        id: `${prevYear}-${String(m).padStart(2, "0")}`,
        year: prevYear,
        month: m,
        label: `${MONTH_LABELS[m - 1]} ${String(prevYear).slice(-2)}`,
    }));

    const currentYearCols = Array.from({ length: selectedMonth }, (_, i) => {
        const m = i + 1;
        return {
            id: `${year}-${String(m).padStart(2, "0")}`,
            year,
            month: m,
            label: `${MONTH_LABELS[m - 1]} ${String(year).slice(-2)}`,
        };
    });

    return { lastYearCols, currentYearCols };
}

function buildTableData(cols, progMatrix) {
    const rows = Object.entries(progMatrix).map(([key, obj]) => {
        let rowTotal = 0;
        const perMonth = {};

        cols.forEach((c) => {
            const v = obj.counts[c.id] || 0;
            perMonth[c.id] = v;
            rowTotal += v;
        });

        return {
            key,
            label: obj.label,
            avatar: obj.avatar,
            perMonth,
            total: rowTotal,
            allCounts: obj.counts || {},
        };
    });

    const filteredRows = rows.filter((r) => r.total > 0);

    const footer = { perMonth: {}, total: 0 };

    cols.forEach((c) => {
        const colTotal = filteredRows.reduce(
            (acc, r) => acc + (r.perMonth[c.id] || 0),
            0
        );
        footer.perMonth[c.id] = colTotal;
        footer.total += colTotal;
    });

    return { rows: filteredRows, footer };
}

export const calcPctForward = (curr, next) => {
    if (curr == null || curr === 0) return 0;
    if (next == null) return 0;
    return ((next - curr) / curr) * 100;
};
