
import { useState, useEffect } from "react";

const FALLBACK_USD_PEN_RATE = 3.37;

// --- Helper Functions in Hook ---
const formatLimaDate = (value) => {
    if (!value) return null;
    try {
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return null;
        return parsed.toLocaleString("es-PE", {
            timeZone: "America/Lima",
            hour12: false,
        });
    } catch (error) {
        console.error("No se pudo formatear la fecha de actualización", error);
        return null;
    }
};

const norm = (s) =>
    String(s ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();

export const findProgAvatar = (label, avataresDeProgramas = []) => {
    const key = norm(label);
    return (avataresDeProgramas || []).find((p) => norm(p?.name_image) === key);
};

// --- Main Hook ---
export const useTopControls = ({
    selectedMonth,
    setSelectedMonth,
    initDay,
    setInitDay,
    cutDay,
    setCutDay,
    year = new Date().getFullYear(),
    setYear,
    onUseLastDay,
    onChangeTasaCambio,
}) => {
    const MESES = [
        "ENERO",
        "FEBRERO",
        "MARZO",
        "ABRIL",
        "MAYO",
        "JUNIO",
        "JULIO",
        "AGOSTO",
        "SEPTIEMBRE",
        "OCTUBRE",
        "NOVIEMBRE",
        "DICIEMBRE",
    ];

    const daysInMonth = (y, m1to12) => new Date(y, m1to12, 0).getDate();
    const CURRENT_YEAR = new Date().getFullYear();
    const YEARS = Array.from({ length: 7 }, (_, i) => CURRENT_YEAR - i);

    const [usdPenRate, setUsdPenRate] = useState({
        value: null,
        updatedAt: null,
        loading: true,
        error: null,
    });

    const [showMultiContratosModal, setShowMultiContratosModal] = useState(false);

    // --- Fetch USD Rate ---
    useEffect(() => {
        let ignore = false;

        const fetchUsdPen = async () => {
            try {
                if (!ignore) {
                    setUsdPenRate((prev) => ({ ...prev, loading: true, error: null }));
                }
                const response = await fetch("https://open.er-api.com/v6/latest/USD");
                if (!response.ok) {
                    throw new Error(`Estado ${response.status}`);
                }
                const payload = await response.json();
                const value =
                    typeof payload?.rates?.PEN === "number" ? payload.rates.PEN : null;
                const updatedAt =
                    payload?.time_last_update_utc ?? payload?.time_last_update ?? null;

                if (!ignore) {
                    setUsdPenRate({
                        value,
                        updatedAt,
                        loading: false,
                        error: value == null ? "Sin datos" : null,
                    });
                }
            } catch (error) {
                if (!ignore) {
                    setUsdPenRate((prev) => ({
                        ...prev,
                        loading: false,
                        error: error?.message || "No se pudo obtener el tipo de cambio",
                    }));
                }
            }
        };

        fetchUsdPen();
        const intervalId = setInterval(fetchUsdPen, 1000 * 60 * 10);

        return () => {
            ignore = true;
            clearInterval(intervalId);
        };
    }, []);

    const displayRate =
        typeof usdPenRate.value === "number" && Number.isFinite(usdPenRate.value)
            ? usdPenRate.value
            : FALLBACK_USD_PEN_RATE;

    const formattedRate = `S/ ${displayRate.toFixed(3)}`;
    const usingFallback = usdPenRate.value == null;
    const updatedLabel = formatLimaDate(usdPenRate.updatedAt);

    // --- Propagate Rate Change ---
    useEffect(() => {
        if (typeof onChangeTasaCambio === "function") {
            onChangeTasaCambio(displayRate);
        }
    }, [displayRate, onChangeTasaCambio]);

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
        MESES,
        YEARS,
        CURRENT_YEAR,
        fallbackUseLastDay,
        handleClickUseLastDay,
        handleMonthChange,
        handleYearChange,
        formattedRate,
        usingFallback,
        updatedLabel,
        FALLBACK_USD_PEN_RATE,
        showMultiContratosModal,
        setShowMultiContratosModal,
        daysInMonth, // Exposed if needed by UI logic, usually not if handlers cover it
    };
};
