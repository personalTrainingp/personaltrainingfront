import React from "react";
import styles from "../styles/VigentesResumenMensual.module.css";
import { useVigentesResumenMensual, calcPctForward } from "../hooks/useVigentesResumenMensual";

function renderVariationCell(value) {
  if (value == null || isNaN(value)) return "-";

  const pos = value > 0;
  const neg = value < 0;

  const sign = pos ? "+" : neg ? "-" : "";

  const pct = sign + Math.abs(value).toFixed(1) + "%";

  const color = pos ? "#16a34a" : neg ? "#dc2626" : "#6b7280";

  return (
    <span style={{ color, fontWeight: 700 }}>
      {pct}
    </span>
  );
}

export function VigentesResumenMensual({
  id_empresa,
  year,
  selectedMonth,
  cutDay = null,
  cutMonth = null,
  pgmNameById,
  avataresDeProgramas = [],
}) {
  const {
    isOpenLast,
    setIsOpenLast,
    isOpenCurr,
    setIsOpenCurr,
    loading,
    lastYearCols,
    currentYearCols,
    nextColById,
    allColumnTotals,
    lastYearTable,
    currentYearTable,
  } = useVigentesResumenMensual({
    id_empresa,
    year,
    selectedMonth,
    cutDay,
    cutMonth,
    pgmNameById,
    avataresDeProgramas,
  });

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

                    {lastYearCols.map((c) => {
                      const hasNext = !!nextColById[c.id];
                      return (
                        <React.Fragment key={c.id}>
                          <th className={styles.th}>{c.label}</th>
                          {hasNext && <th className={styles.th}>%</th>}
                        </React.Fragment>
                      );
                    })}

                  </tr>
                </thead>

                <tbody>
                  {lastYearTable.rows.map((row) => (
                    <tr key={row.key}>
                      {renderNameCell(row)}

                      {lastYearCols.map((c) => {
                        const curr = row.perMonth[c.id] || 0;
                        const nextId = nextColById[c.id];
                        const hasNext = !!nextId;

                        const next = nextId ? row.allCounts?.[nextId] || 0 : 0;
                        const variation = calcPctForward(curr, next);

                        return (
                          <React.Fragment key={c.id}>
                            <td className={styles.td}>{curr}</td>
                            {hasNext && (
                              <td className={styles.td}>
                                {renderVariationCell(variation)}
                              </td>
                            )}
                          </React.Fragment>
                        );
                      })}

                    </tr>
                  ))}

                  <tr className={styles.footerRow}>
                    <td className={`${styles.td} ${styles.firstCol}`}>TOTAL</td>

                    {lastYearCols.map((c) => {
                      const currTotal = allColumnTotals[c.id] || 0;
                      const nextId = nextColById[c.id];
                      const hasNext = !!nextId;

                      const nextTotal = nextId ? allColumnTotals[nextId] || 0 : 0;
                      const variation = calcPctForward(currTotal, nextTotal);

                      return (
                        <React.Fragment key={c.id}>
                          <td className={styles.td}>{currTotal}</td>
                          {hasNext && (
                            <td className={styles.td}>
                              {renderVariationCell(variation)}
                            </td>
                          )}
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

                    {currentYearCols.map((c) => {
                      const hasNext = !!nextColById[c.id];
                      return (
                        <React.Fragment key={c.id}>
                          <th className={styles.th}>{c.label}</th>
                          {hasNext && <th className={styles.th}>%</th>}
                        </React.Fragment>
                      );
                    })}

                  </tr>
                </thead>

                <tbody>
                  {currentYearTable.rows.map((row) => (
                    <tr key={row.key}>
                      {renderNameCell(row)}

                      {currentYearCols.map((c) => {
                        const curr = row.perMonth[c.id] || 0;
                        const nextId = nextColById[c.id];
                        const hasNext = !!nextId;

                        const next = nextId ? row.allCounts?.[nextId] || 0 : 0;
                        const variation = calcPctForward(curr, next);

                        return (
                          <React.Fragment key={c.id}>
                            <td className={styles.td}>{curr}</td>
                            {hasNext && (
                              <td className={styles.td}>
                                {renderVariationCell(variation)}
                              </td>
                            )}
                          </React.Fragment>
                        );
                      })}

                    </tr>
                  ))}

                  <tr className={styles.footerRow}>
                    <td className={`${styles.td} ${styles.firstCol}`}>TOTAL</td>

                    {currentYearCols.map((c) => {
                      const currTotal = allColumnTotals[c.id] || 0;
                      const nextId = nextColById[c.id];
                      const hasNext = !!nextId;

                      const nextTotal = nextId ? allColumnTotals[nextId] || 0 : 0;
                      const variation = calcPctForward(currTotal, nextTotal);

                      return (
                        <React.Fragment key={c.id}>
                          <td className={styles.td}>{currTotal}</td>
                          {hasNext && (
                            <td className={styles.td}>
                              {renderVariationCell(variation)}
                            </td>
                          )}
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