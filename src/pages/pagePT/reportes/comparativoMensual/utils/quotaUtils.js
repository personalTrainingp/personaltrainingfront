// LÓGICA DE METAS (Actualizada para Febrero 2026)
export const getQuotaForMonth = (monthIndex, year) => {
    const y = Number(year);
    const m = Number(monthIndex);

    // Caso específico: Febrero (1) de 2026
    if (y === 2026 && m === 1) return 100000;

    // Resto de 2026 en adelante: 110k
    if (y >= 2026) return 110000;

    if (y === 2025) {
        // Enero (0) a Julio (6): 60k
        if (m <= 6) return 60000;
        // Agosto (7): 70k
        if (m === 7) return 70000;
        // Septiembre (8): 75k
        if (m === 8) return 75000;
        // Octubre (9): 85k
        if (m === 9) return 85000;
        // Noviembre (10) y Diciembre (11): 90k
        if (m >= 10) return 90000;
    }

    // Fallback para años anteriores (ej: 2024)
    return 60000;
};
