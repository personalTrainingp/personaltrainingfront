
import { MESES_UPPER } from "../reportes/resumenEjecutivo/hooks/useResumenUtils";

// --- Main Hook ---
export const useHeaderResultados = ({
    selectedMonth,
    setSelectedMonth,
    initDay,
    setInitDay,
    cutDay,
    setCutDay,
    year = new Date().getFullYear(),
    setYear,
    onUseLastDay,
}) => {
    const daysInMonth = (y, m1to12) => new Date(y, m1to12, 0).getDate();
    const CURRENT_YEAR = new Date().getFullYear();
    const YEARS = Array.from({ length: 7 }, (_, i) => CURRENT_YEAR - i);

    // --- Handlers ---
    const handleMonthChange = (newMonth) => {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();

        if (year === currentYear && newMonth > currentMonth) return;

        const lastDayTarget = daysInMonth(year, newMonth);
        let nextCut = Math.min(cutDay, lastDayTarget);
        const nextInit = Math.min(initDay, nextCut);

        setSelectedMonth(newMonth);
        setCutDay(nextCut);
        setInitDay(nextInit);
    };

    const handleYearChange = (newYear) => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;

        if (typeof setYear !== "function") return;

        if (newYear === currentYear && selectedMonth > currentMonth) {
            setSelectedMonth(currentMonth);
        }

        const effectiveMonth =
            newYear === currentYear
                ? Math.min(selectedMonth, currentMonth)
                : selectedMonth;

        const lastDayTarget = daysInMonth(newYear, effectiveMonth);
        const nextCut = Math.min(cutDay, lastDayTarget);
        const nextInit = Math.min(initDay, nextCut);

        setYear(newYear);
        setCutDay(nextCut);
        setInitDay(nextInit);
    };

    const fallbackUseLastDay = () => {
        const today = new Date();
        const isCurrentMonth =
            year === today.getFullYear() && selectedMonth === today.getMonth() + 1;

        const lastDay = daysInMonth(year, selectedMonth);
        const nextCut = isCurrentMonth
            ? Math.min(lastDay, today.getDate())
            : lastDay;

        setCutDay(nextCut);
        if (initDay > nextCut) setInitDay(nextCut);
    };

    const handleClickUseLastDay = () =>
        typeof onUseLastDay === "function" ? onUseLastDay() : fallbackUseLastDay();

    return {
        MESES: MESES_UPPER,
        YEARS,
        CURRENT_YEAR,
        fallbackUseLastDay,
        handleClickUseLastDay,
        handleMonthChange,
        handleYearChange,
        daysInMonth, // Exposed if needed by UI logic, usually not if handlers cover it
    };
};
