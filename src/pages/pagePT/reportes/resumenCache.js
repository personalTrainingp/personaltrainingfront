import { PTApi } from '@/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

function formatDate(date, isStart = true) {
    const base = dayjs.utc(date);
    return isStart
        ? base.startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[-05:00]')
        : base.endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[-05:00]');
}

// GLOBAL CACHE to prevent double-fetching in StrictMode or rapid remounts
// Shared across resumenEjecutivo and resumenEjecutivoOficial
export const globalCache = {
    rangeKey: null,
    promise: null,

    // Cache specific independent data if needed
    monkFitPromise: null,
    monkFitData: null,
    programasPromise: null,

    // Cache for Ventas and Comparativo stores
    ventasPromise: null,
    ventasKey: null,

    comparativoPromise: null,
    comparativoKey: null
};

/**
 * Fetches ventas data, deduplicating concurrent requests for the same date range.
 * Returns the raw `data` object from the API response.
 */
export function fetchVentasCached(arrayDate) {
    const startStr = formatDate(arrayDate[0], true);
    const endStr = formatDate(arrayDate[1], false);
    const cacheKey = `ventas-${startStr}-${endStr}`;

    if (globalCache.ventasPromise && globalCache.ventasKey === cacheKey) {
        console.log(`[resumenCache] CACHE HIT ventas: ${cacheKey}`);
        return globalCache.ventasPromise;
    }

    console.log(`[resumenCache] CACHE MISS ventas, fetching: ${cacheKey}`);
    globalCache.ventasKey = cacheKey;
    globalCache.ventasPromise = PTApi.get('/reporte/reporte-obtener-ventas', {
        params: { arrayDate: [startStr, endStr] },
    })
        .then(res => res.data)
        .catch(err => {
            // Clear cache on error so retries work
            globalCache.ventasPromise = null;
            globalCache.ventasKey = null;
            throw err;
        });

    return globalCache.ventasPromise;
}

/**
 * Fetches comparativo resumen data, deduplicating concurrent requests for the same date range.
 * Returns the raw `data` object from the API response.
 */
export function fetchComparativoCached(arrayDate) {
    const startStr = formatDate(arrayDate[0], true);
    const endStr = formatDate(arrayDate[1], false);
    const cacheKey = `comparativo-${startStr}-${endStr}`;

    if (globalCache.comparativoPromise && globalCache.comparativoKey === cacheKey) {
        console.log(`[resumenCache] CACHE HIT comparativo: ${cacheKey}`);
        return globalCache.comparativoPromise;
    }

    const qs = new URLSearchParams();
    qs.append('arrayDate', startStr);
    qs.append('arrayDate', endStr);

    console.log(`[resumenCache] CACHE MISS comparativo, fetching: ${cacheKey}`);
    globalCache.comparativoKey = cacheKey;
    globalCache.comparativoPromise = PTApi.get(
        `/venta/reporte/obtener-comparativo-resumen?${qs.toString()}`
    )
        .then(res => res.data)
        .catch(err => {
            globalCache.comparativoPromise = null;
            globalCache.comparativoKey = null;
            throw err;
        });

    return globalCache.comparativoPromise;
}

// Cache for vencimientos-mes (keyed by year + empresa)
const vencimientosCache = {};

/**
 * Fetches vencimientos-mes data, deduplicating concurrent requests for the same year/empresa.
 * Returns the raw `data` object from the API response.
 */
export function fetchVencimientosCached(year, id_empresa) {
    const empresa = id_empresa || 598;
    const cacheKey = `vencimientos-${year}-${empresa}`;

    if (vencimientosCache[cacheKey]) {
        console.log(`[resumenCache] CACHE HIT vencimientos: ${cacheKey}`);
        return vencimientosCache[cacheKey];
    }

    console.log(`[resumenCache] CACHE MISS vencimientos, fetching: ${cacheKey}`);
    vencimientosCache[cacheKey] = PTApi.get('/venta/vencimientos-mes', {
        params: { year, id_empresa: empresa }
    })
        .then(res => res.data)
        .catch(err => {
            delete vencimientosCache[cacheKey];
            throw err;
        });

    return vencimientosCache[cacheKey];
}

// Cache for get-ventas (keyed by id_empresa + date range normalized to YYYY-MM-DD)
const tablaVentasCache = {};

/**
 * Fetches get-ventas data, deduplicating concurrent requests for the same empresa/date range.
 * Normalizes dates to YYYY-MM-DD so different Date objects for the same day produce the same key.
 * Returns the raw `data` object from the API response (contains `ventas` array).
 */
export function fetchTablaVentasCached(id_empresa, filterDate = []) {
    const empresa = id_empresa || 598;

    // Normalize to YYYY-MM-DD for a stable cache key regardless of time component
    const dayStart = filterDate && filterDate[0]
        ? dayjs.utc(filterDate[0]).format('YYYY-MM-DD')
        : 'all';
    const dayEnd = filterDate && filterDate[1]
        ? dayjs.utc(filterDate[1]).format('YYYY-MM-DD')
        : 'all';
    const cacheKey = `tablaVentas-${empresa}-${dayStart}-${dayEnd}`;

    if (tablaVentasCache[cacheKey]) {
        console.log(`[resumenCache] CACHE HIT tablaVentas: ${cacheKey}`);
        return tablaVentasCache[cacheKey];
    }

    const params = {};
    if (filterDate && filterDate.length === 2 && filterDate[0] && filterDate[1]) {
        // Always send normalized start-of-day / end-of-day to the backend
        params.fechaInicio = dayjs.utc(filterDate[0]).startOf('day').toISOString();
        params.fechaFin = dayjs.utc(filterDate[1]).endOf('day').toISOString();
    }

    console.log(`[resumenCache] CACHE MISS tablaVentas, fetching: ${cacheKey}`);
    tablaVentasCache[cacheKey] = PTApi.get(`/venta/get-ventas/${empresa}`, { params })
        .then(res => res.data)
        .catch(err => {
            delete tablaVentasCache[cacheKey];
            throw err;
        });

    return tablaVentasCache[cacheKey];
}

// Cache for renovaciones-por-rango-fechas
const renovacionesRangeCache = {};

/**
 * Fetches renovaciones/por-rango-fechas data, deduplicating concurrent requests.
 * @param {Object} params - { empresa, year, selectedMonth, initDay, cutDay }
 * @returns {Promise<Array>} The cruces array
 */
export function fetchParametrosRenovacionesCached({ empresa, year, selectedMonth, initDay, cutDay }) {
    const id = empresa || 598;
    const cacheKey = `renovrange-${id}-${year}-${selectedMonth}-${initDay}-${cutDay}`;

    if (renovacionesRangeCache[cacheKey]) {
        console.log(`[resumenCache] CACHE HIT renovRange: ${cacheKey}`);
        return renovacionesRangeCache[cacheKey];
    }

    console.log(`[resumenCache] CACHE MISS renovRange, fetching: ${cacheKey}`);
    renovacionesRangeCache[cacheKey] = PTApi.get('/parametros/renovaciones/por-rango-fechas', {
        params: {
            empresa: id,
            year,
            selectedMonth,
            initDay,
            cutDay
        }
    })
        .then(res => res.data?.cruces || [])
        .catch(err => {
            console.error("Error fetching overlaps:", err);
            delete renovacionesRangeCache[cacheKey];
            throw err;
        });

    return renovacionesRangeCache[cacheKey];
}
