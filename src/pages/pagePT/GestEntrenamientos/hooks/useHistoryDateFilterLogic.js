export function useHistoryDateFilterLogic({
    year,
    setYear,
    selectedMonth,
    setSelectedMonth,
    initDay,
    setInitDay,
    cutDay,
    setCutDay
}) {
    const MESES = [
        "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
        "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE",
    ];

    const daysInMonth = (y, m1to12) => new Date(y, m1to12, 0).getDate();

    const CURRENT_YEAR = new Date().getFullYear();
    const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

    const currentMonthIdx = new Date().getMonth() + 1;

    const handleYearChange = (newYear) => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;

        let newMonth = selectedMonth;
        if (newYear === currentYear && selectedMonth > currentMonth) {
            newMonth = currentMonth;
            if (setSelectedMonth) setSelectedMonth(newMonth); // Validación extra si la prop existe
        }

        const lastDayTarget = daysInMonth(newYear, newMonth);
        const nextInit = Math.min(initDay, lastDayTarget);

        if (setYear) setYear(newYear);
        if (setInitDay) setInitDay(nextInit);
    };

    const handleMonthChange = (newMonth) => {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();

        if (year === currentYear && newMonth > currentMonth) return;

        const lastDayTarget = daysInMonth(year, newMonth);
        const nextInit = Math.min(initDay, lastDayTarget);

        if (setSelectedMonth) setSelectedMonth(newMonth);
        if (setInitDay) setInitDay(nextInit);
    };

    return {
        MESES,
        YEARS,
        CURRENT_YEAR,
        currentMonthIdx,
        handleYearChange,
        handleMonthChange
    };
}
