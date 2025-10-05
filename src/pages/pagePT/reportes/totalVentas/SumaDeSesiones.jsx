import React, { useMemo } from "react";
import { Row, Col } from "react-bootstrap";

const toNumber = (v) => {
  const s = String(v ?? "0").trim();
  if (s.includes("%")) return Number(s.replace("%", "").trim());
  return Number(s.replace(/,/g, "")) || 0;
};
const fmt = (n, mostrarCero = false) => {
  const num = Number(n) || 0;
  if (num === 0 && !mostrarCero) return "";
  return num.toLocaleString("es-PE");
};

export function SumaDeSesiones({
  resumenArray,
  resumenTotales,            // compat
  avataresDeProgramas = [],
  sociosOverride = {},       
  originBreakdown = {}, 
   advisorOriginByProg = {},    
}) {
  // 1) claves de programas (EN MAYÚSCULAS) tal como están en los avatares
  const progKeys = avataresDeProgramas.map(
    (p) => String(p?.name_image ?? "").trim().toUpperCase()
  );

  // 2) asesores (resumen + override)
  const asesores = useMemo(() => {
    const fromResumen = Array.isArray(resumenArray)
      ? resumenArray
          .filter((f) => f?.[0]?.value !== "TOTAL")
          .map((f) => String(f?.[0]?.value ?? "").trim().toUpperCase())
      : [];
    const fromOverride = Object.values(sociosOverride).flatMap((porProg) =>
      Object.keys(porProg || {})
    );
    return Array.from(new Set([...fromResumen, ...fromOverride])).filter(Boolean);
  }, [resumenArray, sociosOverride]);

  // 3) si no hay override, no pintamos
  const hasOverrideData =
    Object.keys(sociosOverride || {}).length > 0 &&
    progKeys.some((k) => sociosOverride[k] && Object.keys(sociosOverride[k]).length > 0);

  // 4) matriz asesor × programa (celdas)
  let filas = asesores.map((asesor) => {
    const row = [{ header: "NOMBRE", value: asesor, isPropiedad: true }];
    progKeys.forEach((pk) => {
      const val = sociosOverride?.[pk]?.[asesor] ?? 0;
      row.push({ header: pk, value: val });
    });
    return row;
  });

  // 5) filtra asesores con total 0
  filas = filas.filter((fila) => {
    const totalRow = fila.slice(1).reduce((acc, c) => acc + toNumber(c.value), 0);
    return totalRow > 0;
  });

  // 6) totales por PROGRAMA basados en las filas (fuente de verdad para cuadrar)
  const colTotalByProg = {};
  progKeys.forEach((pk, i) => {
    const colIdx = i + 1; // +1 por la columna "Nombre"
    colTotalByProg[pk] = filas.reduce((acc, f) => acc + toNumber(f[colIdx]?.value), 0);
  });

  // 7) normaliza originBreakdown (claves en MAYÚSCULAS) y AJUSTA si no cuadra
  const obUpper = Object.fromEntries(
    Object.entries(originBreakdown || {}).map(([k, v]) => [
      String(k).toUpperCase(),
      {
        nuevos: Number(v?.nuevos || 0),
        renovaciones: Number(v?.renovaciones || 0),
        reinscripciones: Number(v?.reinscripciones || 0),
      },
    ])
  );
// totales por PROGRAMA (desde los desgloses por asesor)
const totalProgFromAdvisorBreakdown = (pk) => {
  const asesoresObj = advisorOriginByProg?.[pk] || {};
  return Object.values(asesoresObj).reduce((acc, c) => {
    const n = Number(c?.nuevos || 0);
    const r = Number(c?.renovaciones || 0);
    const re = Number(c?.reinscripciones || 0);
    return acc + n + r + re;
  }, 0);
};

// total GENERAL (suma de todos los programas)
const totalGeneralFromAdvisor = progKeys.reduce(
  (acc, pk) => acc + totalProgFromAdvisorBreakdown(pk),
  0
);

  const correctedBreakdown = {};
  progKeys.forEach((pk) => {
    const base = obUpper[pk] || { nuevos: 0, renovaciones: 0, reinscripciones: 0 };
    const sumOB = base.nuevos + base.renovaciones + base.reinscripciones;
    const colTotal = colTotalByProg[pk] || 0;

    if (sumOB !== colTotal) {
      // Ajuste simple: muevo la diferencia a "NUEVOS" para que CUADRE con la columna
      const diff = colTotal - sumOB;
      correctedBreakdown[pk] = {
        nuevos: base.nuevos + diff,
        renovaciones: base.renovaciones,
        reinscripciones: base.reinscripciones,
      };
    } else {
      correctedBreakdown[pk] = base;
    }
  });
const norm = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

const getCells = (rowOrCells) => (Array.isArray(rowOrCells) ? rowOrCells : []);

  // 8) helpers de totales
  const sumCol = (idx) => filas.reduce((acc, f) => acc + toNumber(f[idx]?.value), 0);
  const totalGeneral = progKeys.reduce((acc, pk, i) => acc + sumCol(i + 1), 0);

  // 9) estilos
  const C = {
    dark: "#232b36",
    headText: "#ffffff",
    lightRow: "#e9eef6",
    red: "#c00000",
    border: "#333",
  };
  const thName = { width: 180, fontSize: 20, color: C.headText };
  const avatarBox = {
    width: 180,
    height: 80,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    overflow: "hidden",
  };
  const miniRow = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 6,
    alignItems: "center",
    justifyItems: "center",
    background: C.lightRow,
    padding: "10px 8px",
    borderRadius: 8,
    marginTop: 8,
  };
  const miniTitle = { color: C.red, fontWeight: 800, fontSize: 12, letterSpacing: 0.3 };
  const miniVal = { color: C.red, fontWeight: 900, fontSize: 18, lineHeight: 1.1 };
// ⬇️ estilos para las mini-celdas
const cellBox = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  width: "100%",
  height: 38,               // alto fijo bonito (ajústalo si quieres)
  border: "1px solid #000", // borde exterior del bloque de 3
  borderRadius: 4,
  overflow: "hidden",
  background: "#fff",
};

const cellItem = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  borderRight: "1px solid #000", // separador vertical
};

const cellItemLast = { ...cellItem, borderRight: "none" };

const cellValue = { fontSize: 16, lineHeight: 1, margin: 0 };


// totales por PROGRAMA (desglosados por origen)
const totalByProgAndOrigin = (pk) => {
  const asesoresObj = advisorOriginByProg?.[pk] || {};
  return Object.values(asesoresObj).reduce(
    (acc, c) => ({
      nuevos: acc.nuevos + Number(c?.nuevos || 0),
      renovaciones: acc.renovaciones + Number(c?.renovaciones || 0),
      reinscripciones: acc.reinscripciones + Number(c?.reinscripciones || 0),
    }),
    { nuevos: 0, renovaciones: 0, reinscripciones: 0 }
  );
};

// totales por ASESOR (sumando todos los programas), desglosados
const totalAdvisorAllPrograms = (asesor) => {
  return progKeys.reduce(
    (acc, pk) => {
      const c = advisorOriginByProg?.[pk]?.[asesor];
      if (c) {
        acc.nuevos += Number(c?.nuevos || 0);
        acc.renovaciones += Number(c?.renovaciones || 0);
        acc.reinscripciones += Number(c?.reinscripciones || 0);
      }
      return acc;
    },
    { nuevos: 0, renovaciones: 0, reinscripciones: 0 }
  );
};

// totales GENERALES (todos los programas), desglosados
const grandTotalsByOrigin = progKeys.reduce(
  (acc, pk) => {
    const s = totalByProgAndOrigin(pk);
    acc.nuevos += s.nuevos;
    acc.renovaciones += s.renovaciones;
    acc.reinscripciones += s.reinscripciones;
    return acc;
  },
  { nuevos: 0, renovaciones: 0, reinscripciones: 0 }
);

// ⇩ mapa: ASESOR → { money, pct }
// ASESOR -> { money, pct } robusto
const moneyByAdvisor = useMemo(() => {
  const map = {};
  if (!Array.isArray(resumenArray)) return map;

  for (const fila of resumenArray) {
    const name = norm(fila?.[0]?.value);
    if (!name || name === "TOTAL") continue;

    const cells = getCells(fila);
    // buscamos cabeceras tolerantes
    const moneyCell = cells.find((c) => {
      const h = norm(c?.header);
      // S/. VENTA TOTAL  | S/ VENTA TOTAL | VENTA TOTAL
      return h.includes("VENTA TOTAL") && (h.includes("S/") || h.includes("S /.") || h.includes("S ."));
    });
    const pctCell = cells.find((c) => norm(c?.header).includes("% VENTA TOTAL"));

    const money = toNumber(moneyCell?.value);
    const pct = toNumber(pctCell?.value);
    map[name] = { money, pct };
  }
  return map;
}, [resumenArray]);

// Total S/. GENERAL robusto
const grandMoney = useMemo(() => {
  // 1) si resumenTotales ya viene como arreglo de celdas
  const cellsFromResumenTotales = Array.isArray(resumenTotales) ? resumenTotales : null;

  // 2) si no, buscamos la FILA TOTAL dentro de resumenArray
  const cellsFromResumenArrayTotal = Array.isArray(resumenArray)
    ? getCells(resumenArray.find((fila) => norm(fila?.[0]?.value) === "TOTAL"))
    : null;

  // elegimos la mejor fuente disponible
  const resumen = cellsFromResumenTotales ?? cellsFromResumenArrayTotal ?? [];

  // intentamos extraer S/. del total
  const totalCell = getCells(resumen).find((c) => {
    const h = norm(c?.header);
    return h.includes("VENTA TOTAL") && (h.includes("S/") || h.includes("S /.") || h.includes("S ."));
  });

  const fromResumen = toNumber(totalCell?.value);
  if (fromResumen > 0) return fromResumen;

  // 3) fallback: sumar por asesor
  return Object.values(moneyByAdvisor).reduce((acc, o) => acc + (o?.money || 0), 0);
}, [resumenTotales, resumenArray, moneyByAdvisor]);

// Formato de porcentaje seguro (evita NaN)
const pctFmt = (v) =>
  `${(isFinite(v) ? Number(v) : 0).toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} %`;


return (
  <Row>
    <Col lg={12}>
      <div style={{ margin: "32px 0" }}>
        <table
          className="table text-center"
          style={{
            borderCollapse: "collapse",
            width: "100%",
            border: "1px solid #000",
          }}
        >
<thead className="bg-secondary text-white">
            <tr>
              <th style={{ ...thName, border: "1px solid #000" }}>NOMBRE</th>

              {avataresDeProgramas.map((img, idx) => {
                const scale = Number(img?.scale ?? 1);
                return (
                  <th key={idx} style={{ border: "1px solid #000" }}>
                    <div
                      style={{
                        ...avatarBox,
                        overflow: scale > 1 ? "visible" : "hidden",
                      }}
                    >
                      <img
                        src={img.urlImage}
                        alt={img.name_image}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          transform: `scale(${scale})`,
                          transformOrigin: "center",
                        }}
                      />
                    </div>

                    <div style={miniRow}>
                      <div><div style={miniTitle}>NUEVOS</div></div>
                      <div><div style={miniTitle}>RENOV.</div></div>
                      <div><div style={miniTitle}>REINSC.</div></div>
                    </div>
                  </th>
                );
              })}

              {/* nuevas columnas fijas */}
              <th style={{ fontSize: 20, color: C.headText, border: "1px solid #000", minWidth: 90 }}>S/.</th>
              <th style={{ fontSize: 20, color: C.headText, border: "1px solid #000", minWidth: 90 }}>%</th>

              {/* total SIEMPRE al final */}
              <th style={{ fontSize: 20, color: C.headText, border: "1px solid #000", minWidth: 90 }}>TOTAL</th>
            </tr>
          </thead>

          <tbody>
            {filas.map((fila, ridx) => {
              const asesor = fila[0]?.value ?? "";
              const totalFila = fila
                .slice(1)
                .reduce((acc, c) => acc + toNumber(c?.value), 0);

              return (
                <tr key={ridx} style={{ background: "#fff", fontSize: 18 }}>
                  <td className="fw-bold text-start" style={{ border: "1px solid #000" }}>
                    {asesor}
                  </td>

                  {/* celdas por PROGRAMA divididas en 3 */}
                  {progKeys.map((pk, cidx) => {
                    const counts = advisorOriginByProg?.[pk]?.[asesor] || {
                      nuevos: 0,
                      renovaciones: 0,
                      reinscripciones: 0,
                    };
                    return (
                      <td key={cidx} style={{ border: "1px solid #000" }}>
                        <div style={cellBox}>
                      <div style={{ ...cellItem, borderRight: "1px solid #000" }}>
                            <p style={cellValue}>{fmt(counts.nuevos, true)}</p>
                          </div>
                      <div style={{ ...cellItem, borderRight: "1px solid #000" }}>
                            <p style={cellValue}>{fmt(counts.renovaciones, true)}</p>
                          </div>
                          <div style={cellItemLast}>
                            <p style={cellValue}>{fmt(counts.reinscripciones, true)}</p>
                          </div>
                        </div>
                      </td>
                    );
                  })}

                  {/* S/. y % por ASESOR (si es 0 igual se muestra) */}
                  <td className="fw-bold" style={{ border: "1px solid #000", minWidth: 90 }}>
                    {fmt(moneyByAdvisor[asesor]?.money ?? 0, true)}
                  </td>
                  <td className="fw-bold" style={{ border: "1px solid #000", minWidth: 90 }}>
                    {(() => {
                      const pct =
                        moneyByAdvisor[asesor]?.pct ??
                        (grandMoney > 0
                          ? ((moneyByAdvisor[asesor]?.money || 0) * 100) / grandMoney
                          : 0);
                      return pctFmt(pct);
                    })()}
                  </td>

                  {/* TOTAL (conteo de socios) – última columna */}
                  <td style={{ border: "1px solid #000", minWidth: 90 }}>
                    {fmt(totalFila, true)}
                  </td>
                </tr>
              );
            })}

            {/* fila TOTAL */}
            <tr className="fw-bold" style={{ background: "#fff", fontSize: 18 }}>
              <td className="text-start" style={{ border: "1px solid #000" }}>TOTAL</td>

              {progKeys.map((pk, idx) => {
                const s = totalByProgAndOrigin(pk);
                return (
                  <td key={idx} style={{ border: "1px solid #000" }}>
                    <div style={cellBox}>
                      <div style={{ ...cellItem, borderRight: "1px solid #000" }}>
                        <p style={cellValue}>{fmt(s.nuevos, true)}</p>
                      </div>
                      <div style={{ ...cellItem, borderRight: "1px solid #000" }}>
                        <p style={cellValue}>{fmt(s.renovaciones, true)}</p>
                      </div>
                      <div style={cellItemLast}>
                        <p style={cellValue}>{fmt(s.reinscripciones, true)}</p>
                      </div>
                    </div>
                  </td>
                );
              })}

              {/* totales S/. y % */}
              <td className="fw-bold" style={{ border: "1px solid #000", minWidth: 90 }}>
                {fmt(grandMoney, true)}
              </td>
              <td className="fw-bold" style={{ border: "1px solid #000", minWidth: 90 }}>
                {pctFmt(100)}
              </td>

              {/* TOTAL GENERAL (conteo de socios) – última columna */}
              <td style={{ border: "1px solid #000", minWidth: 90 }}>
                {fmt(totalGeneralFromAdvisor, true)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Col>
  </Row>
);


}