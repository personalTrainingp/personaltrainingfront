import { useMemo } from "react";

const DAY_ES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export const fmtMoney = (n) => (Number(n) || 0).toLocaleString("es-PE", { minimumFractionDigits: 0 });
export const sumMonto = (map = {}) => Object.values(map).reduce((a, n) => a + (n || 0), 0);
export const sumSocios = (map = {}) => Object.values(map).reduce((a, s) => a + (s || 0), 0);
export const norm = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

function limaFromISO(iso) {
    if (!iso) return null;
    const s = String(iso).replace(" ", "T").replace(" -", "-");
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return null;
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    return new Date(utc - 5 * 60 * 60000);
}

const getVentaDate = (v) =>
    limaFromISO(
        v?.fecha_venta || v?.fecha || v?.createdAt ||
        v?.tb_ventum?.fecha_venta || v?.tb_ventum?.createdAt
    );

const toNum = (v) => {
    if (typeof v === "number") return Number.isFinite(v) ? v : 0;
    const s = String(v ?? "0").trim().replace(/[^\d,.-]/g, "");
    const commaDecimal = /,\d{1,2}$/.test(s);
    let t = s;
    if (commaDecimal) t = t.replace(/\./g, "").replace(",", ".");
    else t = t.replace(/,/g, "");
    const n = Number(t);
    return Number.isFinite(n) ? n : 0;
};

const getItemsMembresia = (v) => (v?.detalle_ventaMembresia || v?.detalle_ventaMembresium || []);

const isProductItem = (it) => !!(it?.tb_producto || it?.id_producto || it?.nombre_producto);
const isProgramItem = (it) =>
    !!(it?.id_pgm || it?.tb_programa || it?.tb_ProgramaTraining || it?.tb_semana_training || typeof it?.sesiones === "number");

const itemImporte = (it) => {
    const cant = toNum(it?.cantidad ?? 1) || 1;
    const unit =
        toNum(it?.tarifa_monto) ||
        toNum(it?.precio_unitario) ||
        toNum(it?.tb_producto?.prec_venta) ||
        toNum(it?.tb_servicio?.prec_venta) || 0;
    return cant * unit;
};

const ventaEsPrograma = (v) => {
    const mems = getItemsMembresia(v);
    return Array.isArray(mems) && mems.length > 0;
};

const getImporteProgramas = (v) => {
    const items = [
        ...getItemsMembresia(v),
        ...(Array.isArray(v?.items) ? v.items : []),
    ];
    const onlyPrograms = items.filter((it) => isProgramItem(it) && !isProductItem(it));
    if (onlyPrograms.length) return onlyPrograms.reduce((acc, it) => acc + itemImporte(it), 0);
    return toNum(v?.monto_total) || toNum(v?.tb_ventum?.monto_total) || toNum(v?.monto);
};

const getAsesor = (v) => {
    const full = v?.tb_empleado?.nombres_apellidos_empl || v?.empleado || v?.nombre_empl || "";
    return norm((full.split(/\s+/)[0] || ""));
};

// === HOOK ===
export const useVentasDiariasLogic = ({
    ventas = [],
    year,
    month,
    initDay = 1,
    cutDay,
    asesores
}) => {

    const listaAsesores = useMemo(() => {
        if (Array.isArray(asesores) && asesores.length) return asesores;
        const set = new Set();
        for (const v of ventas || []) {
            const full = v?.tb_empleado?.nombres_apellidos_empl || v?.empleado || v?.nombre_empl || "";
            const first = (full.split(/\s+/)[0] || "").trim();
            if (first) set.add(first.toUpperCase());
        }
        return Array.from(set);
    }, [asesores, ventas]);

    const {
        days, labels, dataByAsesor, totalMontoMes,
        lastDay, from, to
    } = useMemo(() => {
        const mIdx = Number(month) - 1;
        const lastDay = new Date(Number(year), mIdx + 1, 0).getDate();
        const from = Math.max(1, Math.min(Number(initDay || 1), lastDay));
        const to = Math.max(from, Math.min(Number(cutDay || lastDay), lastDay));
        const days = Array.from({ length: to - from + 1 }, (_, i) => from + i);

        const labels = days.map(d => {
            const dow = DAY_ES[new Date(Number(year), mIdx, d).getDay()];
            return ` \n${dow.toUpperCase()} ${d}`;
        });

        const wanted = (Array.isArray(listaAsesores) ? listaAsesores : []).map(norm);
        const dataByAsesor = {};
        for (const a of wanted) {
            dataByAsesor[a] = {
                sociosByDay: Object.fromEntries(days.map(d => [d, 0])),
                montoByDay: Object.fromEntries(days.map(d => [d, 0])),
            };
        }

        const EXCLUDED_IDS = [3562];

        for (const v of Array.isArray(ventas) ? ventas : []) {
            if (EXCLUDED_IDS.includes(v?.id_empl) || EXCLUDED_IDS.includes(v?.tb_ventum?.id_empl)) continue;

            const d = getVentaDate(v);
            if (!d || d.getFullYear() !== Number(year) || d.getMonth() !== mIdx) continue;
            const day = d.getDate();
            if (day < from || day > to) continue;

            const a = getAsesor(v);
            if (!dataByAsesor[a]) continue;

            const monto = getImporteProgramas(v);
            if (monto > 0) dataByAsesor[a].montoByDay[day] += monto;

            const mems = getItemsMembresia(v);
            let itemsCount = 0;
            if (mems.length > 0) {
                itemsCount = mems.length;
            } else if (monto > 0) {
                itemsCount = 1;
            }
            if (ventaEsPrograma(v) || monto > 0) {
                dataByAsesor[a].sociosByDay[day] += itemsCount;
            }
        }

        let totalMontoMes = 0;
        for (const a of Object.keys(dataByAsesor)) {
            for (const d of days) totalMontoMes += dataByAsesor[a].montoByDay[d];
        }

        return { days, labels, dataByAsesor, totalMontoMes, lastDay, from, to };
    }, [ventas, year, month, initDay, cutDay, listaAsesores]);

    const asesoresNorm = (Array.isArray(listaAsesores) ? listaAsesores : []).map(norm);

    const asesoresActivos = useMemo(() => asesoresNorm.filter((a) => {
        const monMap = dataByAsesor[a]?.montoByDay || {};
        const socMap = dataByAsesor[a]?.sociosByDay || {};
        return sumMonto(monMap) > 0 || sumSocios(socMap) > 0;
    }), [asesoresNorm, dataByAsesor]);

    const dayTotals = useMemo(() => {
        const totMon = {};
        const totSoc = {};

        for (const d of days) {
            let m = 0;
            let s = 0;

            for (const a of asesoresActivos) {
                m += (dataByAsesor[a]?.montoByDay?.[d] || 0);
                s += (dataByAsesor[a]?.sociosByDay?.[d] || 0);
            }

            totMon[d] = m;
            totSoc[d] = s;
        }

        const sumaMonto = Object.values(totMon).reduce((ac, n) => ac + (n || 0), 0);
        const sumaSocios = Object.values(totSoc).reduce((ac, n) => ac + (n || 0), 0);

        return { totMon, totSoc, sumaMonto, sumaSocios };
    }, [days, asesoresActivos, dataByAsesor]);

    return {
        days, labels, dataByAsesor, totalMontoMes,
        asesoresActivos, dayTotals,
        lastDay, from, to,
        norm
    };
};
