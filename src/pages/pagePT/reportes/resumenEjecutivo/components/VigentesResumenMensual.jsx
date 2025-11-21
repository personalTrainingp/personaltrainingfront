  import React, { useEffect, useMemo, useState } from "react";
  import PTApi from "@/common/api/PTApi";

  const norm = (s) =>
    String(s ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();

  const MONTH_LABELS = [
    "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
    "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
  ];

  const styles = {
    wrapper: {
      border: "1px solid #000",
      borderRadius: 12,
      background: "#fff",
      boxShadow: "0 8px 22px rgba(15,23,42,.08)",
      marginTop: 32,
      display: "flex",
      flexDirection: "column",
    },
    titulos:{
      textAlign:"center"
    },
    header: {
      background: "#c00000",
      color: "#f8fafc",
      padding: "16px 20px",
      fontWeight: 800,
      textTransform: "uppercase",
      fontSize: 30,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      userSelect: "none",
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    headerTitle: {
      flex: 1,
      textAlign: "center",
    },
    tableContainer: {
      width: "100%",
      overflowX: "auto",
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "1000px", 
    },
    thead: {
      background: "#c00000",
      color: "#ffffff",
      textTransform: "uppercase",
      fontSize: 25,
    },
    th: {
      padding: "10px 14px",
      border: "1px solid #000",
      fontWeight: 700,
      textAlign: "center",
      whiteSpace: "nowrap",
      color: "#ffffff",
    },
    td: {
      padding: "8px 14px",
      border: "1px solid #000",
      fontSize: 25,
      textAlign: "center",
      verticalAlign: "middle",
    },
    firstCol: {
      textAlign: "left",
      fontWeight: 600,
      borderRight: "1px solid #000",
      position: "sticky",
      left: 0,
      background: "#fff",
      zIndex: 10,
    },
    footerRow: {
      background: "#f9fafb",
      fontWeight: 700,
      height: "65px",
      verticalAlign: "middle",
    },
    programLogo: {
      height: "65px",
      width: "auto",
      objectFit: "contain",
      display: "block",
    },
    emptyMsg: {
      padding: 24,
      textAlign: "center",
      color: "#6b7280",
      fontStyle: "italic",
      fontSize: 18,
    },
  };

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
    const color = pos ? "#16a34a" : neg ? "#dc2626" : "#6b7280";    
    const pct = Math.abs(value).toFixed(1) + "%";
    
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
    const footer = {
      perMonth: {},
      total: 0,
    };
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

    // --- FETCHING ---
    useEffect(() => {
      let isCancelled = false;

      const fetchAll = async () => {
        setLoading(true);
        try {
          const allCols = [...lastYearCols, ...currentYearCols];

          const results = await Promise.all(
            allCols.map(async (c) => {
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
              } catch (e) {
                console.error("Error cargando vigentes:", e?.message);
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
              const avatarUrl = foundAvatar?.urlImage || null;

              if (!nextMatrix[key]) {
                nextMatrix[key] = {
                  label: rawName,
                  avatar: avatarUrl,
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
      <td style={{ ...styles.td, ...styles.firstCol }}>
        {row.avatar ? (
          <img
            src={row.avatar}
            alt={row.label}
            style={styles.programLogo}
            title={row.label}
          />
        ) : (
          row.label
        )}
      </td>
    );

    return (
      <>
        <div style={styles.wrapper}>
          <div style={styles.header} onClick={() => setIsOpenLast(!isOpenLast)}>
            <span style={styles.headerTitle} > SOCIOS VIGENTES - ÚLTIMOS 4 MESES AÑO ANTERIOR</span>
            <span style={{ fontSize: 24 }}>{isOpenLast ? "▲" : "▼"}</span>
          </div>

          {isOpenLast && (
            <div style={styles.tableContainer}>
              {loading && <div style={styles.emptyMsg}>Cargando...</div>}

              {!loading && lastYearTable.rows.length === 0 && (
                <div style={styles.emptyMsg}>
                  No hay datos de socios vigentes para mostrar.
                </div>
              )}

              {!loading && lastYearTable.rows.length > 0 && (
                <table style={styles.table}>
                  <thead style={styles.thead}>
                    <tr>
                      <th style={{ ...styles.th}}>Programa</th>
                      {lastYearCols.map((c) => (
                        <React.Fragment key={c.id}>
                          <th style={styles.th}>{c.label}</th>
                          <th
                            style={{
                              ...styles.th,
                              background: "#a30000",
                              fontSize: 16,
                            }}
                          >
                            % 
                          </th>
                        </React.Fragment>
                      ))}
                      <th style={styles.th}>TOTAL</th>
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
                          
                          // Usamos la nueva lógica
                          const variation = calcPct(curr, prev);

                          return (
                            <React.Fragment key={c.id}>
                              <td style={styles.td}>{curr}</td>
                              <td
                                style={{
                                  ...styles.td,
                                  background: "#fafafa",
                                  fontSize: 20,
                                }}
                              >
                                {renderVariationCell(variation)}
                              </td>
                            </React.Fragment>
                          );
                        })}
                        <td style={{ ...styles.td, fontWeight: 700, fontSize: 28 }}>
                          {row.total}
                        </td>
                      </tr>
                    ))}
                    <tr style={styles.footerRow}>
                      <td style={{ ...styles.td, ...styles.firstCol }}>TOTAL</td>
                      {lastYearCols.map((c) => {
                        const currTotal = lastYearTable.footer.perMonth[c.id] || 0;
                        const prevId = prevColById[c.id];
                        const prevTotal = prevId
                          ? lastYearTable.footer.perMonth[prevId] || 0
                          : 0;
                        const variation = calcPct(currTotal, prevTotal);

                        return (
                          <React.Fragment key={c.id}>
                            <td style={styles.td}>{currTotal}</td>
                            <td
                              style={{
                                ...styles.td,
                                fontWeight: 800,
                                fontSize: 20,
                              }}
                            >
                              {renderVariationCell(variation)}
                            </td>
                          </React.Fragment>
                        );
                      })}
                      <td style={styles.td}>{lastYearTable.footer.total}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        <div style={{ height: 32 }} />

        <div style={styles.wrapper}>
          <div style={styles.header} onClick={() => setIsOpenCurr(!isOpenCurr)}>
            <span style={styles.headerTitle}>SOCIOS VIGENTES - AÑO ACTUAL ({year})</span>
            <span style={{ fontSize: 24 }}>{isOpenCurr ? "▲" : "▼"}</span>
          </div>

          {isOpenCurr && (
            <div style={styles.tableContainer}>
              {loading && (
                <div style={styles.emptyMsg}>Cargando...</div>
              )}
              {!loading && currentYearTable.rows.length === 0 && (
                <div style={styles.emptyMsg}>
                  No hay datos de socios vigentes para mostrar.
                </div>
              )}
              {!loading && currentYearTable.rows.length > 0 && (
                <table style={styles.table}>
                  <thead style={styles.thead}>
                    <tr>
                      <th style={{ ...styles.th}}>Programa</th>
                      {currentYearCols.map((c) => (
                        <React.Fragment key={c.id}>
                          <th style={styles.th}>{c.label}</th>
                          <th
                            style={{
                              ...styles.th,
                              background: "#a30000",
                              fontSize: 16,
                            }}
                          >
                            % 
                          </th>
                        </React.Fragment>
                      ))}
                      <th style={styles.th}>TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentYearTable.rows.map((row) => (
                      <tr key={row.key}>
                        {renderNameCell(row)}
                        {currentYearCols.map((c) => {
                          const curr = row.perMonth[c.id] || 0;
                          const prevId = prevColById[c.id];
                          const prev = prevId ? row.allCounts?.[prevId] || 0 : 0;
                          
                          const variation = calcPct(curr, prev);

                          return (
                            <React.Fragment key={c.id}>
                              <td style={styles.td}>{curr}</td>
                              <td
                                style={{
                                  ...styles.td,
                                  background: "#fafafa",
                                  fontSize: 20,
                                }}
                              >
                                {renderVariationCell(variation)}
                              </td>
                            </React.Fragment>
                          );
                        })}
                        <td style={{ ...styles.td, fontWeight: 700, fontSize: 28 }}>
                          {row.total}
                        </td>
                      </tr>
                    ))}
                    <tr style={styles.footerRow}>
                      <td style={{ ...styles.td, ...styles.firstCol }}>TOTAL</td>
                      {currentYearCols.map((c) => {
                        const currTotal = currentYearTable.footer.perMonth[c.id] || 0;
                        const prevId = prevColById[c.id];
                        let prevTotal = 0;
                        if (prevId) {
                          prevTotal =
                            currentYearTable.footer.perMonth[prevId] ??
                            lastYearTable.footer.perMonth[prevId] ??
                            0;
                        }
                        const variation = calcPct(currTotal, prevTotal);

                        return (
                          <React.Fragment key={c.id}>
                            <td style={styles.td}>{currTotal}</td>
                            <td
                              style={{
                                ...styles.td,
                                fontWeight: 800,
                                fontSize: 20,
                              }}
                            >
                              {renderVariationCell(variation)}
                            </td>
                          </React.Fragment>
                        );
                      })}
                      <td style={styles.td}>{currentYearTable.footer.total}</td>
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