import React, { useEffect, useMemo, useState } from "react";
import PTApi from "@/common/api/PTApi";
import styles from "../styles/VigentesResumenMensual.module.css";
import dayjs from "dayjs";

const norm = (s) =>
    String(s ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();

const MONTH_LABELS = [
    "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
    "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
];

function getLastDayOfMonth(year, month1Based) {
    return new Date(year, month1Based, 0).getDate();
}

function buildColumnsConfig(year, selectedMonth) {
    const prevYear = year - 1;

    // Last 4 months of previous year
    const lastYearCols = [9, 10, 11, 12].map((m) => ({
        id: `${prevYear}-${String(m).padStart(2, "0")}`,
        year: prevYear,
        month: m,
        label: `${MONTH_LABELS[m - 1]} ${String(prevYear).slice(-2)}`,
    }));

    // Current year up to selected month
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

const fmtMoney = (n) =>
    new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(
        n || 0
    );

function buildTableData(cols, productMatrix) {
    const rows = Object.entries(productMatrix).map(([key, obj]) => {
        let rowTotal = 0;
        let rowAmountTotal = 0;
        const perMonth = {};
        const perMonthAmount = {};

        cols.forEach((c) => {
            const v = obj.counts[c.id] || 0;
            const amt = obj.amounts[c.id] || 0;
            perMonth[c.id] = v;
            perMonthAmount[c.id] = amt;
            rowTotal += v;
            rowAmountTotal += amt;
        });

        return {
            key,
            label: obj.label,
            image: obj.image,
            perMonth,
            perMonthAmount,
            total: rowTotal,
            totalAmount: rowAmountTotal,
        };
    });

    const filteredRows = rows.filter((r) => r.total > 0);
    // Sort by total desc
    filteredRows.sort((a, b) => b.total - a.total);

    const footer = { perMonth: {}, perMonthAmount: {}, total: 0, totalAmount: 0 };

    cols.forEach((c) => {
        let colTotal = 0;
        let colAmountTotal = 0;
        filteredRows.forEach((r) => {
            colTotal += r.perMonth[c.id] || 0;
            colAmountTotal += r.perMonthAmount[c.id] || 0;
        });
        footer.perMonth[c.id] = colTotal;
        footer.perMonthAmount[c.id] = colAmountTotal;
        footer.total += colTotal;
        footer.totalAmount += colAmountTotal;
    });

    return { rows: filteredRows, footer };
}

export function ProductosResumenMensual({
    id_empresa,
    year,
    selectedMonth,
}) {
    const [loading, setLoading] = useState(false);
    const [productMatrix, setProductMatrix] = useState({});

    const [isOpenLast, setIsOpenLast] = useState(false);
    const [isOpenCurr, setIsOpenCurr] = useState(true);

    const { lastYearCols, currentYearCols } = useMemo(
        () => buildColumnsConfig(year, selectedMonth),
        [year, selectedMonth]
    );

    const allCols = useMemo(
        () => [...lastYearCols, ...currentYearCols],
        [lastYearCols, currentYearCols]
    );

    const nextColById = useMemo(() => {
        const map = {};
        for (let i = 0; i < allCols.length - 1; i++) {
            map[allCols[i].id] = allCols[i + 1].id;
        }
        return map;
    }, [allCols]);

    // Totals for all columns (units) - though footer handles this logic for displayed columns
    const allColumnTotals = useMemo(() => {
        const totals = {};
        allCols.forEach((c) => (totals[c.id] = 0));
        Object.values(productMatrix).forEach((row) => {
            allCols.forEach((c) => {
                totals[c.id] += row.counts[c.id] || 0;
            });
        });
        return totals;
    }, [productMatrix, allCols]);

    useEffect(() => {
        let isCancelled = false;

        const fetchAll = async () => {
            setLoading(true);

            try {
                const results = await Promise.all(
                    [...lastYearCols, ...currentYearCols].map(async (c) => {
                        const lastDay = getLastDayOfMonth(c.year, c.month);

                        const dStart = new Date(c.year, c.month - 1, 1);
                        const dEnd = new Date(c.year, c.month - 1, lastDay);

                        const fmt = (d, isEnd) => {
                            const Y = d.getFullYear();
                            const M = String(d.getMonth() + 1).padStart(2, '0');
                            const D = String(d.getDate()).padStart(2, '0');
                            const time = isEnd ? "23:59:59.999" : "00:00:00.000";
                            return `${Y}-${M}-${D} ${time} -05:00`;
                        };

                        const arrayDate = [fmt(dStart, false), fmt(dEnd, true)];

                        try {
                            const { data } = await PTApi.get(`/venta/get-ventas-x-fecha/${id_empresa || 598}`, {
                                params: { arrayDate }
                            });

                            return {
                                colId: c.id,
                                ventas: Array.isArray(data?.ventas) ? data.ventas : [],
                            };
                        } catch (err) {
                            console.error(err);
                            return { colId: c.id, ventas: [] };
                        }
                    })
                );

                if (isCancelled) return;

                const nextMatrix = {};

                for (const { colId, ventas } of results) {
                    for (const v of ventas) {
                        const items = v.detalle_ventaProductos || [];
                        for (const item of items) {
                            const prodName = item.tb_producto?.nombre_producto || item.nombre_producto || "DESCONOCIDO";
                            const catId = item.tb_producto?.id_categoria;

                            const key = norm(prodName);
                            if (!nextMatrix[key]) {
                                nextMatrix[key] = {
                                    label: prodName,
                                    image: item.tb_producto?.avatar ? `https://api.personaltraining.com.pe/api/v1/storage/blob/${item.tb_producto.avatar}` : null,
                                    counts: {},
                                    amounts: {}
                                };
                            }
                            // Sum quantity
                            const qty = Number(item.cantidad || 1);
                            const monto = Number(item.tarifa_monto || 0);

                            nextMatrix[key].counts[colId] = (nextMatrix[key].counts[colId] || 0) + qty;
                            nextMatrix[key].amounts[colId] = (nextMatrix[key].amounts[colId] || 0) + monto;
                        }
                    }
                }

                setProductMatrix(nextMatrix);
            } finally {
                if (!isCancelled) setLoading(false);
            }
        };

        fetchAll();
        return () => {
            isCancelled = true;
        };
    }, [id_empresa, year, selectedMonth, lastYearCols, currentYearCols]);

    const lastYearTable = useMemo(
        () => buildTableData(lastYearCols, productMatrix),
        [lastYearCols, productMatrix]
    );

    const currentYearTable = useMemo(
        () => buildTableData(currentYearCols, productMatrix),
        [currentYearCols, productMatrix]
    );

    const renderNameCell = (row) => (
        <td className={`${styles.td} ${styles.firstCol}`}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {row.image && (
                    <img src={row.image} alt="" style={{ width: 32, height: 32, borderRadius: 4, objectFit: "cover" }} onError={e => e.target.style.display = 'none'} />
                )}
                <span>{row.label}</span>
            </div>
        </td>
    );

    return (
        <>
            {/* === AÑO ANTERIOR === */}
            <div className={styles.wrapper}>
                <div className={styles.header} onClick={() => setIsOpenLast(!isOpenLast)}>
                    <span className={styles.headerTitle}>
                        HISTÓRICO PRODUCTOS ({year - 1}) - ÚLTIMOS 4 MESES
                    </span>
                    <span style={{ fontSize: 24 }}>{isOpenLast ? "▲" : "▼"}</span>
                </div>

                {isOpenLast && (
                    <div className={styles.tableContainer}>
                        {loading && <div className={styles.emptyMsg}>Cargando...</div>}

                        {!loading && lastYearTable.rows.length === 0 && (
                            <div className={styles.emptyMsg}>
                                No hay ventas de productos en este periodo.
                            </div>
                        )}

                        {!loading && lastYearTable.rows.length > 0 && (
                            <table className={styles.table}>
                                <thead className={styles.thead}>
                                    <tr>
                                        <th className={styles.th}>Producto</th>
                                        {lastYearCols.map((c) => (
                                            <React.Fragment key={c.id}>
                                                <th className={styles.th}>{c.label}</th>
                                                <th className={styles.th} style={{ minWidth: 90 }}>S/</th>
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {lastYearTable.rows.map((row) => (
                                        <tr key={row.key}>
                                            {renderNameCell(row)}
                                            {lastYearCols.map((c) => {
                                                const curr = row.perMonth[c.id] || 0;
                                                const currAmt = row.perMonthAmount[c.id] || 0;

                                                return (
                                                    <React.Fragment key={c.id}>
                                                        <td className={styles.td}>{curr}</td>
                                                        <td className={styles.td}>
                                                            <span style={{ color: "#000", fontWeight: 700 }}>
                                                                {fmtMoney(currAmt)}
                                                            </span>
                                                        </td>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                    <tr className={styles.footerRow}>
                                        <td className={`${styles.td} ${styles.firstCol}`}>TOTAL</td>
                                        {lastYearCols.map((c) => {
                                            const currTotal = lastYearTable.footer.perMonth[c.id] || 0;
                                            const currTotalAmt = lastYearTable.footer.perMonthAmount[c.id] || 0;
                                            return (
                                                <React.Fragment key={c.id}>
                                                    <td className={styles.td}>{currTotal}</td>
                                                    <td className={styles.td}>
                                                        {fmtMoney(currTotalAmt)}
                                                    </td>
                                                </React.Fragment>
                                            );
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>

            <div style={{ height: 32 }} />

            {/* === AÑO ACTUAL === */}
            <div className={styles.wrapper}>
                <div className={styles.header} onClick={() => setIsOpenCurr(!isOpenCurr)}>
                    <span className={styles.headerTitle}>
                        HISTÓRICO PRODUCTOS ({year}) - HASTA MES ACTUAL
                    </span>
                    <span style={{ fontSize: 24 }}>{isOpenCurr ? "▲" : "▼"}</span>
                </div>

                {isOpenCurr && (
                    <div className={styles.tableContainer}>
                        {loading && <div className={styles.emptyMsg}>Cargando...</div>}
                        {!loading && currentYearTable.rows.length === 0 && (
                            <div className={styles.emptyMsg}>
                                No hay ventas de productos en este periodo.
                            </div>
                        )}
                        {!loading && currentYearTable.rows.length > 0 && (
                            <table className={styles.table}>
                                <thead className={styles.thead}>
                                    <tr>
                                        <th className={styles.th}>Producto</th>
                                        {currentYearCols.map((c) => (
                                            <React.Fragment key={c.id}>
                                                <th className={styles.th}>{c.label}</th>
                                                <th className={styles.th} style={{ minWidth: 90 }}>S/</th>
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentYearTable.rows.map((row) => (
                                        <tr key={row.key}>
                                            {renderNameCell(row)}
                                            {currentYearCols.map((c) => {
                                                const curr = row.perMonth[c.id] || 0;
                                                const currAmt = row.perMonthAmount[c.id] || 0;

                                                return (
                                                    <React.Fragment key={c.id}>
                                                        <td className={styles.td}>{curr}</td>
                                                        <td className={styles.td}>
                                                            <span style={{ color: "#000", fontWeight: 700 }}>
                                                                {fmtMoney(currAmt)}
                                                            </span>
                                                        </td>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                    <tr className={styles.footerRow}>
                                        <td className={`${styles.td} ${styles.firstCol}`}>TOTAL</td>
                                        {currentYearCols.map((c) => {
                                            const currTotal = currentYearTable.footer.perMonth[c.id] || 0;
                                            const currTotalAmt = currentYearTable.footer.perMonthAmount[c.id] || 0;
                                            return (
                                                <React.Fragment key={c.id}>
                                                    <td className={styles.td}>{currTotal}</td>
                                                    <td className={styles.td}>
                                                        {fmtMoney(currTotalAmt)}
                                                    </td>
                                                </React.Fragment>
                                            );
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
