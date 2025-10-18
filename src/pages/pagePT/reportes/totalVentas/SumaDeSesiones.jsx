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
              resumenTotales,                 
              avataresDeProgramas = [],
              sociosOverride = {},
              originBreakdown = {},
              advisorOriginByProg = {},
                avatarByAdvisor = {},   
            }) {
       const filtrarAsesoresConProgramas = (filas, advisorOriginByProg) => {
  return filas.filter((fila) => {
    const asesor = fila[0]?.value ?? "";
    // recorrer todos los programas visibles
    for (const pk of Object.keys(advisorOriginByProg)) {
      const counts = advisorOriginByProg?.[pk]?.[asesor];
      if (counts && (
          Number(counts.nuevos) > 0 ||
          Number(counts.renovaciones) > 0 ||
          Number(counts.reinscripciones) > 0
        )) {
        return true; // 👈 tiene al menos un programa vendido
      }
    }
    return false; // 👈 eliminar asesores sin programas
  });
};
       
              const progKeys = avataresDeProgramas.map(
                (p) => String(p?.name_image ?? "").trim().toUpperCase()
              );
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

              let filas = asesores.map((asesor) => {
                const row = [{ header: "NOMBRE", value: asesor, isPropiedad: true }];
                progKeys.forEach((pk) => {
                  const val = sociosOverride?.[pk]?.[asesor] ?? 0;
                  row.push({ header: pk, value: val });
                });
                return row;
              });

              filas = filas.filter((fila) => {
                const totalRow = fila.slice(1).reduce((acc, c) => acc + toNumber(c.value), 0);
                return totalRow > 0;
              });
              filas = filtrarAsesoresConProgramas(filas, advisorOriginByProg);
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

              if (url) map[name] = normalizeImgUrl(url); 
            }
            return map;
          }, [resumenArray]);

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

              const rankByAdvisor = useMemo(() => {
                const order = [...asesores].sort(
                  (a, b) =>
                    (moneyByAdvisor[norm(b)]?.money || 0) - (moneyByAdvisor[norm(a)]?.money || 0)
                );
                const map = {};
                order.forEach((name, i) => (map[name] = i + 1));
                return map;
              }, [asesores, moneyByAdvisor]);

const totalVisibleMoney = filas.reduce((acc, fila) => {
  const asesor = fila[0]?.value ?? "";
  return acc + (moneyByAdvisor[norm(asesor)]?.money || 0);
}, 0);

Object.keys(moneyByAdvisor).forEach((key) => {
  const visible = filas.find((f) => norm(f[0]?.value) === key);
  if (!visible) return; // si no está visible, no recalcular
  const m = moneyByAdvisor[key]?.money || 0;
  moneyByAdvisor[key].pct = totalVisibleMoney > 0 ? (m * 100) / totalVisibleMoney : 0;
});
              // estilos
              const C = {
                dark: "#5c6670",
                headText: "#ffffff",
                red: "#c00000",
              };
              const thName = { width: 180, fontSize: 25, color: C.headText };
              const avatarBox = {
                width: 190,
                height: 100,
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                overflow: "hidden",
              };
              const isZero = (v) => Number(v) === 0;
    const cellBoldIf = (v) => ({
  fontSize: isZero(v) ? 25 : 29,  
      lineHeight: 1,
      margin: 0,
      fontWeight: isZero(v) ? 400 : 700,
        color: isZero(v) ? "#000" : "#c00000", 

    });
    const tdBoldClassIf = (v) => (isZero(v) ? "" : "fw-bold");

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
            const t = totalByProgAndOrigin(pk); 
            return (Number(t.nuevos||0) + Number(t.renovaciones||0) + Number(t.reinscripciones||0));
            
          };
          // Filtrar solo programas con data (>0)
          const allProg = avataresDeProgramas.map((img, idx) => ({
            img,
            key: (String(img?.name_image ?? "").trim().toUpperCase()),
          }));

          const visiblePrograms = allProg
          // arriba del return
          const DashCell = ({ min = 90 }) => (
            <td
              style={{
                border: "1px solid #000",
                minWidth: min,
                textAlign: "center",
                fontWeight: 700,
  color: "#c00000", // <- rojo si es bold
                
              }}
            >
              -
            </td>
          );


        return (
      <Row>
        <Col lg={12}>
          <div style={{ margin: "32px 0" }}>
            <table
              className="table text-center tabla-sesiones"
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
<thead style={{ backgroundColor: "#C00000", color: "#fff" }}>
                {/* Fila 1: IMAGEN + Avatares */}
                <tr>
                  <th style={{ width: 150, ...thName }}>ASESORES</th>

                  {visiblePrograms.map(({ img }, idx) => {
                    const scale = Number(img?.scale ?? 1);
                    const isLast = idx === visiblePrograms.length - 1;
                    return (
                      <th 
                        key={idx}
                        className={` avatar-col program-start  ${isLast ? "program-end" : ""}`}
                        style={{
                          verticalAlign: "middle"
                        }}
                      >
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
                            }}
                          />
                        </div>
                      </th>
                    );
                  })}

                  <th style={{ fontSize: 20, color: "#fff", minWidth: 80 }}>
                    TOTAL SOCIOS
                  </th>
                  <th style={{ fontSize: 20, color: "#fff", minWidth: 90,width:60 }}>S/.</th>
                  <th  style={{ fontSize: 20, color: "#fff", minWidth: 60,width:60 }}>%</th>
                </tr>

                <tr>
                  <th  style={{ border: "none", background: "#fff" }} />

                  {visiblePrograms.map((_, idx) => {
                    const isLast = idx === visiblePrograms.length - 1;
                    return (
                      <th key={idx} className={`triptych-head program-start ${isLast ? "program-end" : ""}`}>
                        <div className="tri-box-head">
                          <div><div className="miniTitle">NUEVOS</div></div>
                          <div><div className="miniTitle">RENOV.</div></div>
                          <div><div className="miniTitle">REINSC.</div></div>
                        </div>
                      </th>
                    );
                  })}

                  <th style={{ background: "#5c6670" }} />
                  <th style={{ background: "#5c6670" }} />
                  <th style={{ background: "#5c6670" }} />
                </tr>
              </thead>

              <tbody>
                {filas.map((fila, ridx) => {
                  const asesor = fila[0]?.value ?? "";
                  const totalFila = fila.slice(1).reduce((acc, c) => acc + toNumber(c?.value), 0);
                  const rank = rankByAdvisor[asesor] ?? 0;
                  const key = norm(asesor);
                  const imgUrl = normalizeImgUrl(avatarByAdvisor[key] || imageByAdvisor[key] || "");
                  return (
                    <tr key={ridx} style={{ background: "#fff", fontSize: 29 }}>
                      <td className="img-with-name">
                        <div className="img-cap">
                          {imgUrl && <img src={imgUrl} alt={asesor} loading="lazy" />}
                          <div className="cap">{asesor}</div>
                          {rank === 1 && (
                            <div className="copa-champions" title="Primer lugar 🏆">
                              <img
                                src="/copa_1_lugar.jpg"
                                alt="Copa Champions"
                                style={{
                                  width: "45px",
                                  height: "70px",
                                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      {visiblePrograms.map(({ key: pk }, cidx) => {
                        const isLast = cidx === visiblePrograms.length - 1;
                        const counts = advisorOriginByProg?.[pk]?.[asesor] ?? {
                          nuevos: 0,
                          renovaciones: 0,
                          reinscripciones: 0,
                        };
                        return (
                          <td key={cidx} className={`triptych program-start ${isLast ? "program-end" : ""}`}>
                            <div className="tri-box">
                        <div><p style={cellBoldIf(counts.nuevos)}>{fmt(counts.nuevos, true)}</p></div>
    <div><p style={cellBoldIf(counts.renovaciones)}>{fmt(counts.renovaciones, true)}</p></div>
    <div><p style={cellBoldIf(counts.reinscripciones)}>{fmt(counts.reinscripciones, true)}</p></div>

                            </div>
                          </td>
                        );
                      })}
    <td className={tdBoldClassIf(totalFila)} style={{ minWidth: 90 }}>
      {fmt(totalFila, true)}
    </td>

    <td className={tdBoldClassIf(moneyByAdvisor[norm(asesor)]?.money ?? 0)} style={{ minWidth: 90 }}>
      {fmt(moneyByAdvisor[norm(asesor)]?.money ?? 0, true)}
    </td>

    <td className={tdBoldClassIf(Number(moneyByAdvisor[norm(asesor)]?.pct || 0))} style={{ minWidth: 80 }}>
      {`${Number(moneyByAdvisor[norm(asesor)]?.pct || 0).toFixed(0)}`}
    </td>

                    </tr>
                  );
                })}
                {/* SOCIOS POR CANAL */}
                <tr className=" fila-secundaria" style={{ background: "#fff", fontSize: 29 }}>
                  <td className="img-with-name">
                    <div className="img-cap only-text">
                      <div className="cap">SOCIOS POR CANAL DE VENTA</div>
                    </div>
                  </td>

                  {visiblePrograms.map(({ key: pk }, idx) => {
                    const isLast = idx === visiblePrograms.length - 1;
                    const s = totalByProgAndOrigin(pk);
                    return (
                      <td key={idx} className={`triptych program-start ${isLast ? "program-end" : ""}`}>
                        <div className="tri-box">
                        <div><p style={cellBoldIf(s.nuevos)}>{fmt(s.nuevos, true)}</p></div>
    <div><p style={cellBoldIf(s.renovaciones)}>{fmt(s.renovaciones, true)}</p></div>
    <div><p style={cellBoldIf(s.reinscripciones)}>{fmt(s.reinscripciones, true)}</p></div>

                        </div>
                      </td>
                    );
                  })}

              {(() => {
   const totalSociosTabla = visiblePrograms.reduce(
     (acc, _prog, i) => acc + filas.reduce((a, f) => a + toNumber(f[i + 1]?.value), 0),
    0
   );
   return (
    <td className={tdBoldClassIf(totalSociosTabla)} style={{ minWidth: 80, width: 60 }}>
       {fmt(totalSociosTabla, true)}
     </td>
   );
 })()}
                  <DashCell />
                  <DashCell />
                </tr>

                {/* TOTAL */}
                <tr className="fw-bold fila-secundaria fila-total" style={{ background: "#fff", fontSize: 29 }}>
                  <td className="img-with-name">
                    <div className="img-cap only-text">
                      <div className="cap">TOTAL</div>
                    </div>
                  </td>

                  {visiblePrograms.map(({ key: pk }, idx) => {
                    const isLast = idx === visiblePrograms.length - 1;
                    return (
                      <td key={idx} className={`program-start ${isLast ? "program-end" : ""}`}>
                        {fmt(totalOnlyByProg(pk), true)}
                      </td>
                    );
                  })}
                  <DashCell />
                  <td className="fw-bold" style={{ minWidth: 150 }}>{fmt(grandMoney, true)}</td>
                  <td className="fw-bold" style={{ minWidth: 80 }}>100%</td>


                </tr>
              </tbody>
            </table>
          </div>
        </Col>
      </Row>
    );
            }
            