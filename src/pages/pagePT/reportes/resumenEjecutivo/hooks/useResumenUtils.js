import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import config from '@/config';

dayjs.extend(utc);

// === CONSTANTES ===
export const MESES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

export const avataresDeProgramas = [
    { urlImage: "/change_negro.png", name_image: "CHANGE 45" },
    { urlImage: "/fs45_negro.png", name_image: "FS 45" },
    { urlImage: "/fisio_muscle_negro.png", name_image: "FISIO MUSCLE" },
    { urlImage: "/vertikal_negro.png", name_image: "VERTIKAL CHANGE" },
];

export const originMap = {
    "693": "Instagram", "694": "Facebook", "695": "TikTok", "690": "Referidos", "691": "RENOVACIONES",
    "692": "REINSCRIPCIONES", "696": "EX-PT ", "686": "Walking", "instagram": "Instagram",
    "facebook": "Facebook", "tiktok": "TikTok", "meta": "Meta", "1514": "TikTok", "1515": "Meta",
    0: "OTROS", "": "OTROS", null: "OTROS", undefined: "OTROS"
};

// === FECHAS ===
export function limaFromISO(iso) {
    if (!iso) return null;
    const d = new Date(iso);
    if (isNaN(d)) return null;
    const utcTime = d.getTime() + d.getTimezoneOffset() * 60000;
    return new Date(utcTime - 5 * 60 * 60000);
}

export function limaStartOfDay(d) {
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 5, 0, 0, 0));
}

export function limaEndOfDay(d) {
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999));
}

export const parseBackendDate = (s) => {
    if (!s) return null;
    const normalized = String(s).replace(" ", "T").replace(" -", "-");
    const d = new Date(normalized);
    return Number.isNaN(d.getTime()) ? null : d;
};

export const parseDateOnly = (s) => {
    if (!s) return null;
    const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
};

export function getFechaFin(m) {
    return (
        parseDateOnly(m?.fec_fin_mem) ||
        parseDateOnly(m?.fec_fin_mem_oftime) ||
        parseDateOnly(m?.fec_fin_mem_viejo) ||
        null
    );
}

export const isBetween = (d, start, end) => !!(d && start && end && d >= start && d <= end);

export const norm = (s) => String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

// === HELPERS DE LOGICA ===
export function agruparPorVenta(data) {
    if (!Array.isArray(data)) return [];
    const resultado = data?.reduce((acc, item) => {
        const idVenta = item?.tb_ventum?.id;
        if (!acc.has(idVenta)) acc.set(idVenta, item);
        return acc;
    }, new Map());
    return Array.from(resultado?.values());
}