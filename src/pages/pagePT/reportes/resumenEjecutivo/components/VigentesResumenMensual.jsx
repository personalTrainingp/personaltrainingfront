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
      overflow: "hidden",
      background: "#fff",
      textAlign: "center",
      boxShadow: "0 8px 22px rgba(15,23,42,.08)",
      marginTop: 32,
    },
    header: {
      background: "#c00000",
      color: "#f8fafc",
      padding: "16px 20px",
      fontWeight: 800,
      textTransform: "uppercase",
      fontSize: 29,
    },
    table: { 
      width: "100%", 
      borderCollapse: "collapse" // Importante para que los bordes no se dupliquen
    },
    thead: { 
      background: "#c00000", 
      color:"#fff",
      textTransform: "uppercase", 
      fontSize: 27 
    },
    th: {
      padding: "10px 14px",
      border: "1px solid #000", // ANTES: borderBottom. AHORA: border completo
      fontWeight: 700,
      textAlign: "center",
      whiteSpace: "nowrap",
    },
    td: {
      padding: "8px 14px",
      border: "1px solid #000", // ANTES: borderBottom. AHORA: border completo
      fontSize: 25,
      textAlign: "center",
      verticalAlign: "middle",
    },
    firstCol: {
      textAlign: "left",
      fontWeight: 600,
      borderRight: "1px solid #000", // Opcional: Borde más grueso a la derecha de la 1ra columna para separar
    },
    footerRow: {
      background: "#f9fafb",
      fontWeight: 700,
      fontSize: 38,
      height:"65px"
    },
    programLogo: {
      height: "65px", 
      width: "auto",
      objectFit: "contain",
      display: "block"
    }
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
        avatar: obj.avatar, // Pasamos el avatar al row
        perMonth,
        total: rowTotal,
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
    avataresDeProgramas = [] // Recibimos los avatares aquí
  }) {
    const [loading, setLoading] = useState(false);
    const [progMatrix, setProgMatrix] = useState({});

    const { lastYearCols, currentYearCols } = useMemo(
      () => buildColumnsConfig(year, selectedMonth),
      [year, selectedMonth]
    );

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
    }, [id_empresa, year, selectedMonth, lastYearCols, currentYearCols, pgmNameById, avataresDeProgramas]);

    const lastYearTable = useMemo(
      () => buildTableData(lastYearCols, progMatrix),
      [lastYearCols, progMatrix]
    );
    const currentYearTable = useMemo(
      () => buildTableData(currentYearCols, progMatrix),
      [currentYearCols, progMatrix]
    );

    // Función auxiliar para renderizar la celda del nombre/avatar
    const renderNameCell = (row) => (
        <td style={{ ...styles.td, ...styles.firstCol }}>
          {row.avatar ? (
            <img 
              src={row.avatar} 
              alt={row.label} 
              style={styles.programLogo} 
              title={row.label} // Tooltip con el nombre al pasar el mouse
            />
          ) : (
            row.label
          )}
        </td>
    );

    return (
      <>
        {/* TABLA AÑO ANTERIOR */}
        <div style={styles.wrapper}>
          <div style={styles.header}>SOCIOS VIGENTES - ÚLTIMOS 4 MESES AÑO ANTERIOR</div>
          {loading && (
            <div style={{ padding: 16, textAlign: "center" }}>Cargando...</div>
          )}
          {!loading && lastYearTable.rows.length === 0 && (
            <div style={{ padding: 16, textAlign: "center" }}>
              No hay datos de socios vigentes para mostrar.
            </div>
          )}
          {!loading && lastYearTable.rows.length > 0 && (
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={{ ...styles.th, textAlign: "left" }}>Programa</th>
                  {lastYearCols.map((c) => (
                    <th key={c.id} style={styles.th}>
                      {c.label}
                    </th>
                  ))}
                  <th style={styles.th}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {lastYearTable.rows.map((row) => (
                  <tr key={row.key}>
                    {/* USAMOS LA NUEVA LÓGICA DE RENDERIZADO */}
                    {renderNameCell(row)} 
                    
                    {lastYearCols.map((c) => (
                      <td key={c.id} style={styles.td}>
                        {row.perMonth[c.id] || 0}
                      </td>
                    ))}
                    <td style={{ ...styles.td, fontWeight: 700 }}>
                      {row.total}
                    </td>
                  </tr>
                ))}
                <tr style={styles.footerRow}>
                  <td style={{ ...styles.td, ...styles.firstCol }}>
                    TOTAL
                  </td>
                  {lastYearCols.map((c) => (
                    <td key={c.id} style={styles.td}>
                      {lastYearTable.footer.perMonth[c.id] || 0}
                    </td>
                  ))}
                  <td style={styles.td}>{lastYearTable.footer.total}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <div style={{ height: 32 }} />

        {/* TABLA AÑO ACTUAL */}
        <div style={styles.wrapper}>
          <div style={styles.header}>
            SOCIOS VIGENTES - AÑO ACTUAL ({year})
          </div>
          {loading && (
            <div style={{ padding: 16, textAlign: "center" }}>Cargando...</div>
          )}
          {!loading && currentYearTable.rows.length === 0 && (
            <div style={{ padding: 16, textAlign: "center" }}>
              No hay datos de socios vigentes para mostrar.
            </div>
          )}
          {!loading && currentYearTable.rows.length > 0 && (
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={{ ...styles.th, textAlign: "left" }}>Programa</th>
                  {currentYearCols.map((c) => (
                    <th key={c.id} style={styles.th}>
                      {c.label}
                    </th>
                  ))}
                  <th style={styles.th}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {currentYearTable.rows.map((row) => (
                  <tr key={row.key}>
                    {/* USAMOS LA NUEVA LÓGICA DE RENDERIZADO */}
                    {renderNameCell(row)}

                    {currentYearCols.map((c) => (
                      <td key={c.id} style={styles.td}>
                        {row.perMonth[c.id] || 0}
                      </td>
                    ))}
                    <td style={{ ...styles.td, fontWeight: 700 }}>
                      {row.total}
                    </td>
                  </tr>
                ))}
                <tr style={styles.footerRow}>
                  <td style={{ ...styles.td, ...styles.firstCol }}>
                    TOTAL
                  </td>
                  {currentYearCols.map((c) => (
                    <td key={c.id} style={styles.td}>
                      {currentYearTable.footer.perMonth[c.id] || 0}
                    </td>
                  ))}
                  <td style={styles.td}>{currentYearTable.footer.total}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </>
    );
  }VigentesResumenMensual.propTypes = {
  id_empresa: PropTypes.number,
  year: PropTypes.number,
  selectedMonth: PropTypes.number,
  pgmNameById: PropTypes.object,
  avataresDeProgramas: PropTypes.array
};
  