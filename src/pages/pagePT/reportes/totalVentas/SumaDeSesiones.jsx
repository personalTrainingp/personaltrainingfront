import React from "react";
import { Row, Col } from "react-bootstrap";
import './SumaDeSesiones.css';
import { useSumaSesionesLogic, fmt, normalizeImgUrl } from "./hooks/useSumaSesionesLogic";

export function SumaDeSesiones(props) {
  const { advisorOriginByProg, avatarByAdvisor } = props;

  const {
    filas,
    moneyByAdvisor,
    rankByAdvisor,
    totalGlobalItems,
    totalItemsByAdvisor,
    totalVisibleMoney,
    visiblePrograms,
    totalOnlyByProg,
    totalByProgAndOrigin,
    imageByAdvisor,
    norm
  } = useSumaSesionesLogic(props);

  // Render Helpers (Visuales)
  const isZero = (v) => Number(v) === 0;
  const cellBoldIf = (v) => ({ fontSize: isZero(v) ? 25 : 29, lineHeight: 1, margin: 0, fontWeight: isZero(v) ? 400 : 700, color: isZero(v) ? "#000" : "#c00000" });
  const tdBoldClassIf = (v) => (isZero(v) ? "" : "fw-bold");

  return (
    <Row>
      <Col lg={12}>
        <div style={{ margin: "32px 0" }}>
          <table className="table text-center tabla-sesiones with-traspasos">
            <thead style={{ backgroundColor: "#fff", color: "#fff" }}>
              <tr>
                <th style={{ width: 150, fontSize: 25, color: "#fff", verticalAlign: "middle" }}>ASESORES</th>
                {visiblePrograms.map(({ img }, idx) => (
                  <th key={idx} className={`avatar-col program-start ${idx === visiblePrograms.length - 1 ? "program-end" : ""}`} style={{ verticalAlign: "middle", background: "#fff", borderTop: "1px solid #c00000", borderBottom: "1px solid #c00000" }}>
                    <div style={{ width: 190, height: 100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, overflow: "hidden" }}>
                      <img src={img.urlImage} alt={img.name_image} style={{ width: "100%", height: "100%", objectFit: "contain", transform: `scale(${Number(img?.scale ?? 1)})` }} />
                    </div>
                  </th>
                ))}
                <th style={{ fontSize: 20, color: "#fff", minWidth: 80, verticalAlign: "middle" }}>TOTAL <br /> SOCIOS</th>
                <th style={{ fontSize: 20, color: "#fff", minWidth: 90, width: 60, verticalAlign: "middle" }}>S/.</th>
                <th style={{ fontSize: 20, color: "#fff", minWidth: 60, width: 60, verticalAlign: "middle" }}>%</th>
              </tr>
              <tr style={{ background: "#c00000" }}>
                <th style={{ border: "none", background: "#c00000" }} />
                {visiblePrograms.map((_, idx) => (
                  <th key={idx} className={`triptych-head program-start ${idx === visiblePrograms.length - 1 ? "program-end" : ""}`} style={{ padding: 0 }}>
                    <div className="tri-box-head">
                      <div><div className="miniTitle">NUEVOS</div></div>
                      <div><div className="miniTitle">RENOV.</div></div>
                      <div><div className="miniTitle">REINSC.</div></div>
                      <div><div className="miniTitle">CANJE</div></div>
                    </div>
                  </th>
                ))}
                <th /><th /><th />
              </tr>
            </thead>
            <tbody>
              {filas.map((fila, ridx) => {
                const asesor = fila[0]?.value ?? "";
                const key = norm(asesor);

                const totalFila = totalItemsByAdvisor[key] || 0;

                const rank = rankByAdvisor[asesor] ?? 0;
                const imgUrl = normalizeImgUrl(avatarByAdvisor[key] || imageByAdvisor[key] || "");

                return (
                  <tr key={ridx} style={{ background: "#fff", fontSize: 29 }}>
                    <td className="img-with-name">
                      <div className="img-cap">
                        {imgUrl && <img src={imgUrl} alt={asesor} loading="lazy" />}
                        <div className="cap">{asesor}</div>
                        {rank === 1 && (<div className="copa-champions" title="Primer lugar 🏆"><img src="/copa_1_lugar.jpg" alt="Copa" style={{ width: "45px", height: "70px", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }} /></div>)}
                      </div>
                    </td>
                    {visiblePrograms.map(({ key: pk }, cidx) => {
                      const counts = advisorOriginByProg?.[pk]?.[asesor] ?? { nuevos: 0, renovaciones: 0, reinscripciones: 0, o: 0 };
                      return (
                        <td key={cidx} className={`triptych program-start ${cidx === visiblePrograms.length - 1 ? "program-end" : ""}`}>
                          <div className="tri-box">
                            <div><p style={cellBoldIf(counts.nuevos)}>{fmt(counts.nuevos, true)}</p></div>
                            <div><p style={cellBoldIf(counts.renovaciones)}>{fmt(counts.renovaciones, true)}</p></div>
                            <div><p style={cellBoldIf(counts.reinscripciones)}>{fmt(counts.reinscripciones, true)}</p></div>
                            <div><p style={cellBoldIf(counts.o)}>{fmt(counts.o, true)}</p></div>
                          </div>
                        </td>
                      );
                    })}
                    {/* Renderizamos el Total de Items */}
                    <td className={tdBoldClassIf(totalFila)} style={{ minWidth: 90, verticalAlign: "middle" }}>{fmt(totalFila, true)}</td>

                    <td className={tdBoldClassIf(moneyByAdvisor[norm(asesor)]?.money ?? 0)} style={{ minWidth: 90, verticalAlign: "middle" }}>{fmt(moneyByAdvisor[norm(asesor)]?.money ?? 0, true)}</td>
                    <td className={tdBoldClassIf(Number(moneyByAdvisor[norm(asesor)]?.pct || 0))} style={{ minWidth: 80, verticalAlign: "middle" }}>{`${Number(moneyByAdvisor[norm(asesor)]?.pct || 0).toFixed(2)}%`}</td>
                  </tr>
                );
              })}

              {/* FILA DE TOTALES */}
              <tr className="fw-bold fila-secundaria fila-total" style={{ background: "#fff", fontSize: 32 }}>
                <td className="img-with-name"><div className="img-cap only-text"><div className="cap">TOTAL</div></div></td>
                {visiblePrograms.map(({ key: pk }, idx) => {
                  const t = totalByProgAndOrigin(pk);
                  return (
                    <td key={idx} className={`triptych program-start ${idx === visiblePrograms.length - 1 ? "program-end" : ""}`} style={{ verticalAlign: "middle" }}>
                      <div className="tri-box">
                        <div><p style={cellBoldIf(t.nuevos)}>{fmt(t.nuevos, true)}</p></div>
                        <div><p style={cellBoldIf(t.renovaciones)}>{fmt(t.renovaciones, true)}</p></div>
                        <div><p style={cellBoldIf(t.reinscripciones)}>{fmt(t.reinscripciones, true)}</p></div>
                        <div><p style={cellBoldIf(t.o)}>{fmt(t.o, true)}</p></div>
                      </div>
                    </td>
                  );
                })}

                {/* Total Socios General: Suma Global de Items */}
                <td className="fw-bold" style={{ minWidth: 80, width: 60, verticalAlign: "middle" }}>{fmt(totalGlobalItems, true)}</td>

                <td className="fw-bold" style={{ minWidth: 150, verticalAlign: "middle" }}>{fmt(totalVisibleMoney, true)}</td>
                <td className="fw-bold" style={{ minWidth: 80, verticalAlign: "middle" }}>100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Col>
    </Row>
  );
}