import React, { useEffect, useMemo, useState } from "react";
import PTApi from "@/common/api/PTApi";
import styles from "../styles/VigentesResumenMensual.module.css";

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

const calcPct = (curr, prev, isFirstCol) => {
  if (isFirstCol) return 0;
  if (prev == null || isNaN(prev)) return null;
  if (prev === 0) return 0;
  return ((curr - prev) / prev) * 100;
};

function renderVariationCell(value) {
  if (value == null || isNaN(value)) return "-";

  const pos = value > 0;
  const neg = value < 0;
  const pct = Math.abs(value).toFixed(1) + "%";

  const color = pos ? "#16a34a" : neg ? "#dc2626" : "#6b7280";

  return (
    <span style={{ color, fontWeight: 700 }}>
      {pct}
    </span>
  );
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

export function VigentesResumenMensual({
  id_empresa,
  year,
  selectedMonth,
  pgmNameById,
  avataresDeProgramas = [],
}) {
  const [loading, setLoading] = useState(false);
  const [progMatrix, setProgMatrix] = useState({});

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

  const prevColById = useMemo(() => {
    const map = {};
    for (let i = 1; i < allCols.length; i++) {
      map[allCols[i].id] = allCols[i - 1].id;
    }
    return map;
  }, [allCols]);

  useEffect(() => {
    let isCancelled = false;

    const fetchAll = async () => {
      setLoading(true);

      try {
        const results = await Promise.all(
          [...lastYearCols, ...currentYearCols].map(async (c) => {
            const cutDay = getLastDayOfMonth(c.year, c.month);

            try {
              const { data } = await PTApi.get(
                "/parametros/membresias/vigentes/lista",
                {
                  params: {
                    empresa: id_empresa || 598,
                    year: c.year,
                    selectedMonth: c.month,
                    cutDay,
                  },
                }
              );

              return {
                colId: c.id,
                rows: Array.isArray(data?.vigentes) ? data.vigentes : [],
              };
            } catch {
              return { colId: c.id, rows: [] };
            }
          })
        );

        if (isCancelled) return;

        const nextMatrix = {};

        for (const { colId, rows } of results) {
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

            nextMatrix[key].counts[colId] =
              (nextMatrix[key].counts[colId] || 0) + 1;
          }
        }

        setProgMatrix(nextMatrix);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      isCancelled = true;
    };
  }, [
    id_empresa,
    year,
    selectedMonth,
    lastYearCols,
    currentYearCols,
    pgmNameById,
    avataresDeProgramas,
  ]);

  const lastYearTable = useMemo(
    () => buildTableData(lastYearCols, progMatrix),
    [lastYearCols, progMatrix]
  );

  const currentYearTable = useMemo(
    () => buildTableData(currentYearCols, progMatrix),
    [currentYearCols, progMatrix]
  );

  const renderNameCell = (row) => (
    <td className={`${styles.td} ${styles.firstCol}`}>
      {row.avatar ? (
        <img
          src={row.avatar}
          alt={row.label}
          className={styles.programLogo}
          title={row.label}
        />
      ) : (
        row.label
      )}
    </td>
  );

  return (
    <>
      {/* === AÑO ANTERIOR === */}
      <div className={styles.wrapper}>
        <div className={styles.header} onClick={() => setIsOpenLast(!isOpenLast)}>
          <span className={styles.headerTitle}>
            SOCIOS VIGENTES - ÚLTIMOS 4 MESES AÑO ANTERIOR
          </span>
          <span style={{ fontSize: 24 }}>{isOpenLast ? "▲" : "▼"}</span>
        </div>

        {isOpenLast && (
          <div className={styles.tableContainer}>
            {loading && <div className={styles.emptyMsg}>Cargando...</div>}

            {!loading && lastYearTable.rows.length === 0 && (
              <div className={styles.emptyMsg}>
                No hay datos de socios vigentes para mostrar.
              </div>
            )}

            {!loading && lastYearTable.rows.length > 0 && (
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={styles.th}>Programa</th>

                    {lastYearCols.map((c) => (
                      <React.Fragment key={c.id}>
                        <th className={styles.th}>{c.label}</th>
                        <th className={styles.th}>%</th>
                      </React.Fragment>
                    ))}

                    <th className={styles.th}>TOTAL</th>
                  </tr>
                </thead>

                <tbody>
                  {lastYearTable.rows.map((row) => (
                    <tr key={row.key}>
                      {renderNameCell(row)}

                      {lastYearCols.map((c) => {
                        const curr = row.perMonth[c.id] || 0;
                        const prevId = prevColById[c.id];
                        const prev = prevId ? row.allCounts?.[prevId] || 0 : 0;

                        const isFirstCol = !prevId;
                        const variation = calcPct(curr, prev, isFirstCol);

                        return (
                          <React.Fragment key={c.id}>
                            <td className={styles.td}>{curr}</td>
                            <td className={styles.td}>
                              {renderVariationCell(variation)}
                            </td>
                          </React.Fragment>
                        );
                      })}

                      <td className={styles.td}>{row.total}</td>
                    </tr>
                  ))}

                  <tr className={styles.footerRow}>
                    <td className={`${styles.td} ${styles.firstCol}`}>TOTAL</td>

                    {lastYearCols.map((c) => {
                      const currTotal = lastYearTable.footer.perMonth[c.id] || 0;
                      const prevId = prevColById[c.id];
                      const prevTotal = prevId
                        ? lastYearTable.footer.perMonth[prevId] || 0
                        : 0;

                      const isFirstCol = !prevId;
                      const variation = calcPct(currTotal, prevTotal, isFirstCol);

                      return (
                        <React.Fragment key={c.id}>
                          <td className={styles.td}>{currTotal}</td>
                          <td className={styles.td}>
                            {renderVariationCell(variation)}
                          </td>
                        </React.Fragment>
                      );
                    })}

                    <td className={styles.td}>{lastYearTable.footer.total}</td>
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
            SOCIOS VIGENTES - AÑO ACTUAL ({year})
          </span>
          <span style={{ fontSize: 24 }}>{isOpenCurr ? "▲" : "▼"}</span>
        </div>

        {isOpenCurr && (
          <div className={styles.tableContainer}>
            {loading && <div className={styles.emptyMsg}>Cargando...</div>}

            {!loading && currentYearTable.rows.length === 0 && (
              <div className={styles.emptyMsg}>
                No hay datos de socios vigentes para mostrar.
              </div>
            )}

            {!loading && currentYearTable.rows.length > 0 && (
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={styles.th}>Programa</th>

                    {currentYearCols.map((c) => (
                      <React.Fragment key={c.id}>
                        <th className={styles.th}>{c.label}</th>
                        <th className={styles.th}>%</th>
                      </React.Fragment>
                    ))}

                    <th className={styles.th}>TOTAL</th>
                  </tr>
                </thead>

                <tbody>
                  {currentYearTable.rows.map((row) => (
                    <tr key={row.key}>
                      {renderNameCell(row)}

                      {currentYearCols.map((c) => {
                        const curr = row.perMonth[c.id] || 0;
                        const prevId = prevColById[c.id];

                        let prev = 0;
                        if (prevId) {
                          prev =
                            row.allCounts?.[prevId] ??
                            lastYearTable.footer.perMonth[prevId] ??
                            0;
                        }

                        const isFirstCol = !prevId;
                        const variation = calcPct(curr, prev, isFirstCol);

                        return (
                          <React.Fragment key={c.id}>
                            <td className={styles.td}>{curr}</td>
                            <td className={styles.td}>
                              {renderVariationCell(variation)}
                            </td>
                          </React.Fragment>
                        );
                      })}

                      <td className={styles.td}>{row.total}</td>
                    </tr>
                  ))}

                  <tr className={styles.footerRow}>
                    <td className={`${styles.td} ${styles.firstCol}`}>TOTAL</td>

                    {currentYearCols.map((c) => {
                      const currTotal =
                        currentYearTable.footer.perMonth[c.id] || 0;

                      const prevId = prevColById[c.id];
                      let prevTotal = 0;

                      if (prevId) {
                        prevTotal =
                          currentYearTable.footer.perMonth[prevId] ??
                          lastYearTable.footer.perMonth[prevId] ??
                          0;
                      }

                      const isFirstCol = !prevId;
                      const variation = calcPct(currTotal, prevTotal, isFirstCol);

                      return (
                        <React.Fragment key={c.id}>
                          <td className={styles.td}>{currTotal}</td>
                          <td className={styles.td}>
                            {renderVariationCell(variation)}
                          </td>
                        </React.Fragment>
                      );
                    })}

                    <td className={styles.td}>{currentYearTable.footer.total}</td>
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
