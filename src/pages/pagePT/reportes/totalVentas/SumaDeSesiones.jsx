  import React, { useMemo } from "react";
  import { Row, Col } from "react-bootstrap";
import './SumaDeSesiones.css';

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

  // normalizador para comparar headers/keys
  const norm = (s) =>
    String(s ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();

  const getCells = (rowOrCells) => (Array.isArray(rowOrCells) ? rowOrCells : []);
// Normaliza una URL de imagen a string limpio
const normalizeImgUrl = (u) => {
  if (u == null) return "";
  try {
    const s = String(u).trim();

    return s.replace(/^['"]|['"]$/g, "");
  } catch {
    return "";
  }
};

  export function SumaDeSesiones({
    
    resumenArray,
    resumenTotales,                 // compat
    avataresDeProgramas = [],
    sociosOverride = {},
    originBreakdown = {},
    advisorOriginByProg = {},
      avatarByAdvisor = {},   
  }) {
     
    const progKeys = avataresDeProgramas.map(
      (p) => String(p?.name_image ?? "").trim().toUpperCase()
    );

    // asesores visibles
    const asesores = useMemo(() => {
      const fromResumen = Array.isArray(resumenArray)
        ? resumenArray
            .filter((f) => norm(f?.[0]?.value) !== "TOTAL")
            .map((f) => String(f?.[0]?.value ?? "").trim().toUpperCase())
        : [];
      const fromOverride = Object.values(sociosOverride).flatMap((porProg) =>
        Object.keys(porProg || {})
      );
      return Array.from(new Set([...fromResumen, ...fromOverride])).filter(Boolean);
    }, [resumenArray, sociosOverride]);

    // filas asesor × programa
    let filas = asesores.map((asesor) => {
      const row = [{ header: "NOMBRE", value: asesor, isPropiedad: true }];
      progKeys.forEach((pk) => {
        const val = sociosOverride?.[pk]?.[asesor] ?? 0;
        row.push({ header: pk, value: val });
      });
      return row;
    });

    // quitar asesores con total 0
    filas = filas.filter((fila) => {
      const totalRow = fila.slice(1).reduce((acc, c) => acc + toNumber(c.value), 0);
      return totalRow > 0;
    });

    // totales por programa (desde filas)
    const colTotalByProg = {};
    progKeys.forEach((pk, i) => {
      const colIdx = i + 1; // +1 por "NOMBRE"
      colTotalByProg[pk] = filas.reduce((acc, f) => acc + toNumber(f[colIdx]?.value), 0);
    });

    // ───── imágenes por asesor (extraídas de la misma data) ─────
   const imageByAdvisor = useMemo(() => {
  const map = {};
  if (!Array.isArray(resumenArray)) return map;

  for (const fila of resumenArray) {
    const name = norm(fila?.[0]?.value);
    if (!name || name === "TOTAL") continue;
    const cells = getCells(fila);

    let url = "";
    const imgCell = cells.find(c => {
      const h = norm(c?.header);
      return h.includes("IMAGEN") || h.includes("FOTO") || h === "IMG" || h.includes("IMAGE");
    });
    if (imgCell && typeof imgCell.value === "string") url = imgCell.value;

    if (!url) {
      const cand = cells.find(
        (c) =>
          typeof c?.img === "string" ||
          typeof c?.image === "string" ||
          typeof c?.image_url === "string" ||
          typeof c?.img_url === "string" ||
          typeof c?.foto === "string"
      );
      url = (cand?.img || cand?.image || cand?.image_url || cand?.img_url || cand?.foto) ?? "";
    }

    if (url) map[name] = normalizeImgUrl(url); // 👈 normaliza aquí
  }
  return map;
}, [resumenArray]);


    // dinero por asesor (y % si la data lo trae)
    const moneyByAdvisor = useMemo(() => {
      const map = {};
      if (!Array.isArray(resumenArray)) return map;

      for (const fila of resumenArray) {
        const name = norm(fila?.[0]?.value);
        if (!name || name === "TOTAL") continue;

        const cells = getCells(fila);
        const moneyCell = cells.find((c) => {
          const h = norm(c?.header);
          return h.includes("VENTA TOTAL") && h.includes("S/");
        });
        const pctCell = cells.find((c) => norm(c?.header).includes("% VENTA TOTAL"));

        const money = toNumber(moneyCell?.value);
        const pct = toNumber(pctCell?.value);
        map[name] = { money, pct };
      }
      return map;
    }, [resumenArray]);

    // ranking por S/.
    const rankByAdvisor = useMemo(() => {
      const order = [...asesores].sort(
        (a, b) =>
          (moneyByAdvisor[norm(b)]?.money || 0) - (moneyByAdvisor[norm(a)]?.money || 0)
      );
      const map = {};
      order.forEach((name, i) => (map[name] = i + 1));
      return map;
    }, [asesores, moneyByAdvisor]);

    // totales
    const sumCol = (idx) => filas.reduce((acc, f) => acc + toNumber(f[idx]?.value), 0);
    const totalGeneral = progKeys.reduce((acc, pk, i) => acc + sumCol(i + 1), 0);

    // estilos
    const C = {
      dark: "#5c6670",
      headText: "#ffffff",
      red: "#c00000",
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

    // mini-celdas (3 en 1)
 // wrapper 3-en-1: ocupa todo el alto del <td>
const cellBox = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  width: "100%",
  height: "100%",     // antes 38
  minHeight: 80,     // opcional para asegurar altura visible
  background: "#fff",
};

// sub-celdas estiradas a todo el alto
const cellItem = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  height: "100%",
};

const cellItemMiddle = {
  ...cellItem,
  borderLeft: "1px solid #000",
  borderRight: "1px solid #000",
};

const cellItemLast = { ...cellItem };
const cellItemLeftBorder = { ...cellItem, borderLeft: "1px solid #000" };
const cellValue = { fontSize: 19, lineHeight: 1, margin: 0 };

    const miniRow = {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 6,
      alignItems: "center",
      justifyItems: "center",
      background: "#e9eef6",
      padding: "10px 8px",
      borderRadius: 8,
      marginTop: 8,
    };
    const miniTitle = { color: C.red, fontWeight: 800, fontSize: 12, letterSpacing: 0.3 };

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
    
    // total S/. general (robusto)
    const grandMoney = useMemo(() => {
      const cellsFromResumenTotales = Array.isArray(resumenTotales) ? resumenTotales : null;
      const cellsFromResumenArrayTotal = Array.isArray(resumenArray)
        ? getCells(resumenArray.find((fila) => norm(fila?.[0]?.value) === "TOTAL"))
        : null;
      const resumen = cellsFromResumenTotales ?? cellsFromResumenArrayTotal ?? [];
      const totalCell = getCells(resumen).find((c) => {
        const h = norm(c?.header);
        return h.includes("VENTA TOTAL") && h.includes("S/");
      });
      const fromResumen = toNumber(totalCell?.value);
      if (fromResumen > 0) return fromResumen;
      return Object.values(moneyByAdvisor).reduce((acc, o) => acc + (o?.money || 0), 0);
    }, [resumenTotales, resumenArray, moneyByAdvisor]);
const totalOnlyByProg = (pk) => {
  const t = totalByProgAndOrigin(pk); // { nuevos, renovaciones, reinscripciones }
  return (Number(t.nuevos||0) + Number(t.renovaciones||0) + Number(t.reinscripciones||0));
  
};
// Filtrar solo programas con data (>0)
const allProg = avataresDeProgramas.map((img, idx) => ({
  img,
  key: (String(img?.name_image ?? "").trim().toUpperCase()),
}));

const visiblePrograms = allProg.filter(({ key }) => totalOnlyByProg(key) > 0);
// Columna "fantasma" para ranking
const rankHeadGhost = {
  width: 36,
  background: "transparent",
  color: "transparent",
  border: "none",
  padding: 0,
};

const rankCellGhost = {
  width: 36,
  border: "none",
  background: "transparent",
  textAlign: "center",
};

// Badge redondo para 1 y 2
const badgeStyle = (n) => ({
  display: n <= 2 ? "inline-flex" : "none",
  width: 24,
  height: 24,
  borderRadius: "50%",
  border: "2px solid #000",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
  fontSize: 14,
  color: "#000",
  background: n === 1 ? "#D4AF37" : "#C0C0C0", // 1 dorado, 2 plateado
});

return (
  <Row>
    <Col lg={12}>
      <div style={{ margin: "32px 0" }}>
        <table
          className="table text-center tabla-sesiones"
          style={{ borderCollapse: "collapse", width: "100%", border: "1px solid #000" }}
        >
          <thead className="bg-secondary text-white">
            <tr>
              {/* Columna de ranking: header fantasma (blanco para tapar el gris del thead) */}
              <th
                style={{
                  width: 36,
                  background: "#fff",
                  color: "transparent",
                  border: "none",
                  padding: 0,
                }}
              />
              
              <th style={{ width: 100, ...thName}}>IMAGEN</th>
              <th style={{ ...thName, border: "1px solid #000" }}>NOMBRE</th>

              {visiblePrograms.map(({ img }, idx) => {
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

              <th style={{ fontSize: 20, color: "#fff", border: "1px solid #000", minWidth: 90 }}>
                S/.
              </th>
              <th style={{ fontSize: 20, color: "#fff", border: "1px solid #000", minWidth: 90 }}>
                TOTAL
              </th>
            </tr>
          </thead>

          <tbody>
            {filas.map((fila, ridx) => {
              const asesor = fila[0]?.value ?? "";
              const totalFila = fila.slice(1).reduce((acc, c) => acc + toNumber(c?.value), 0);
              const rank = rankByAdvisor[asesor] ?? 0;
              const key = norm(asesor);
              const imgUrl = normalizeImgUrl(
                avatarByAdvisor[key] || imageByAdvisor[key] || ""
              );

              const badgeStyle = (n) => ({
                display: n <= 2 ? "inline-flex" : "none",
                width: 50,
                height: 50,
                borderRadius: "50%",
                border: "2px solid #000",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: 19,
                color: "#000",
                background: n === 1 ? "#D4AF37" : "#C0C0C0",
              });

              return (
                <tr key={ridx} style={{ background: "#fff", fontSize: 19 }}>
                  {/* Ranking (solo 1 y 2). Sin bordes. */}
                  <td
                    style={{
                      width: 36,
                      border: "none",
                      background: "transparent",
                      textAlign: "center",
                    }}
                  >
                    <span style={badgeStyle(rank)}>{rank}</span>
                  </td>

                  {/* IMAGEN */}
                  <td
                    style={{
                      width: 80,
                      background: "transparent",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: 80,
                        height: 100,
                        borderRadius: 10,
                        overflow: "hidden",
                        margin: "0 auto",
                        background: "#f3f3f3",
                      }}
                    >
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={asesor}
                          loading="lazy"
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      ) : null}
                    </div>
                  </td>

                  {/* NOMBRE */}
                  <td
                    className="fw-bold text-start"
                    style={{ border: "1px solid #000", paddingLeft: 12 }}
                  >
                    {asesor}
                  </td>

                  {/* Programas visibles */}
                 {visiblePrograms.map(({ key: pk }, cidx) => {
  const counts = advisorOriginByProg?.[pk]?.[asesor] || { nuevos:0, renovaciones:0, reinscripciones:0 };
  return (
     <td key={cidx} className="triptych" style={{ border: "1px solid #000" }}>
      <div className="tri-box">
        <div><p style={cellValue}>{fmt(counts.nuevos, true)}</p></div>
        <div><p style={cellValue}>{fmt(counts.renovaciones, true)}</p></div>
        <div><p style={cellValue}>{fmt(counts.reinscripciones, true)}</p></div>
      </div>
    </td>
  );
})}

                  {/* S/. */}
                  <td className="fw-bold" style={{ border: "1px solid #000", minWidth: 90 }}>
                    {fmt(moneyByAdvisor[norm(asesor)]?.money ?? 0, true)}
                  </td>

                  {/* TOTAL (conteo de socios) */}
                  <td style={{ border: "1px solid #000", minWidth: 90 }}>
                    {fmt(totalFila, true)}
                  </td>
                </tr>
              );
            })}

            {/* SOCIOS POR PROGRAMA */}
            <tr className="fw-bold" style={{ background: "#fff", fontSize: 19 }}>
              {/* Celda de ranking vacía para alinear */}
              <td style={{ width: 36, border: "none", background: "transparent" }} />
              <td style={{ width: 110, background: "transparent", border: "none" }}></td>

              <td className="text-start" style={{ border: "1px solid #000" }}>
                SOCIOS POR PROGRAMA
              </td>

              {visiblePrograms.map(({ key: pk }, idx) => {
                const s = totalByProgAndOrigin(pk);
                return (
                  <td key={idx} className="triptych" style={{ border: "1px solid #000" }}>
        <div className="tri-box">
          <div><p style={cellValue}>{fmt(s.nuevos, true)}</p></div>
          <div><p style={cellValue}>{fmt(s.renovaciones, true)}</p></div>
          <div><p style={cellValue}>{fmt(s.reinscripciones, true)}</p></div>
        </div>
      </td>
                );
              })}

              {/* S/. total */}
              <td className="fw-bold" style={{ border: "1px solid #000", minWidth: 90 }}>
                {fmt(grandMoney, true)}
              </td>

              {/* TOTAL GENERAL (conteo de socios) */}
              <td style={{ border: "1px solid #000", minWidth: 90 }}>
                {fmt(
                  visiblePrograms.reduce(
                    (acc, { key: pk }, i) =>
                      acc + filas.reduce((a, f) => a + toNumber(f[i + 1]?.value), 0),
                    0
                  ),
                  true
                )}
              </td>
            </tr>

            {/* TOTAL PROGRAMA */}
            <tr className="fw-bold" style={{ background: "#fff", fontSize: 19 }}>
              {/* Celda de ranking vacía para alinear */}
              <td style={{ width: 36, border: "none", background: "transparent" }} />
              <td style={{ width: 110, background: "transparent", border: "none" }}></td>

              <td className="text-start" style={{ border: "1px solid #000" }}>
                TOTAL
              </td>

              {visiblePrograms.map(({ key: pk }, idx) => (
                <td key={idx} style={{ border: "1px solid #000" }}>
                  {fmt(totalOnlyByProg(pk), true)}
                </td>
              ))}

              {/* columnas S/. y TOTAL vacías */}
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </Col>
  </Row>
);

  }