import { getCuotaMonto } from '@/types/type';

// monthIndex es base 0 (0 = enero); cuotasMonto usa mes base 1.
export const getQuotaForMonth = (monthIndex, year) =>
    getCuotaMonto(Number(monthIndex) + 1, year, Number(year) >= 2026 ? 80000 : 60000);
