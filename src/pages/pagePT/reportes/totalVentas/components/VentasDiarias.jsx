import React from "react";
import { useVentasDiariasLogic, fmtMoney } from "../hooks/useVentasDiariasLogic";

export default function VentasDiarias(props) {
  const { year, month, avatarByAdvisor } = props;

  const {
    days,
    labels,
    dataByAsesor,
    totalMontoMes,
    asesoresActivos,
    dayTotals,
    lastDay,
    from,
    to,
    norm
  } = useVentasDiariasLogic(props);

  const renderRow = (a, tipo) => {
    const isSocios = tipo === "SOCIOS";
    const isMonto = tipo === "MONTO";
    const socMap = dataByAsesor[a]?.sociosByDay || {};
    const monMap = dataByAsesor[a]?.montoByDay || {};

    const totalSocios = Object.values(socMap).reduce((acc, n) => acc + (n || 0), 0);
    const totalMonto = Object.values(monMap).reduce((acc, n) => acc + (n || 0), 0);
    const pct = totalMontoMes > 0 ? Math.round((totalMonto * 100) / totalMontoMes) : 0;

    return (
      <tr key={`${a}-${tipo}`} style={{ background: "#fff" }}>
        <td style={{ border: "1px solid #000", padding: "6px 10px", textAlign: "center" }}>
          {(() => {
            const url = avatarByAdvisor[norm(a)] || "";
            return url
              ? (
                <img
                  src={url}
                  alt={a}
                  style={{ width: 46, height: 64, objectFit: "cover", borderRadius: 8 }}
                />
              )
              : "—";
          })()}
        </td>
        <td style={{ border: "1px solid #000", padding: "6px 10px", fontWeight: 800, fontSize: 18 }}>
          {a}  <br />
          {isSocios ? "SOCIOS" : "VENTAS"}
        </td>

        {days.map((d) => (
          <td
            key={d}
            style={{
              border: "1px solid #000",
              padding: "6px 8px",
              textAlign: "center",
              fontSize: 22,
              fontWeight: isMonto ? ((monMap[d] || 0) > 0 ? 800 : 400) : ((socMap[d] || 0) > 0 ? 700 : 400),
              color: isMonto ? ((monMap[d] || 0) > 0 ? "#2e7d32" : "#000") : "#000",
            }}
          >
            {isSocios ? (socMap[d] ?? 0) : fmtMoney(monMap[d] ?? 0)}
          </td>
        ))}

        <td style={{ border: "1px solid #000", padding: "6px 10px", textAlign: "right", fontWeight: 800, fontSize: 25 }}>
          {isSocios ? (totalSocios ?? 0) : 0}
        </td>
        <td style={{ border: "1px solid #000", padding: "6px 10px", textAlign: "right", fontWeight: 800, fontSize: 25 }}>
          {isMonto ? fmtMoney(totalMonto ?? 0) : 0}
        </td>
        <td style={{ border: "1px solid #000", padding: "6px 10px", textAlign: "center", fontWeight: 800, fontSize: 25 }}>
          {isMonto ? `${pct.toFixed(2)}%` : "%0"}
        </td>
      </tr>
    );
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 900, background: "#fff" }}>
        <thead>
          <tr>
            <th
              colSpan={labels.length + 5}
              style={{
                background: "#c00000",
                color: "#fff",
                textAlign: "center",
                padding: "12px",
                fontSize: 26,
                fontWeight: 900,
                letterSpacing: .5
              }}
            >
              CALENDARIO DE VENTAS POR DIA
            </th>
          </tr>

          <tr style={{ background: "#c00000", color: "#fff" }}>

            <th style={{ border: "1px solid #000", padding: "8px 10px" }} >
              AVATAR
            </th>
            <th style={{ border: "1px solid #000", padding: "8px 10px", background: "#c00000", fontSize: 20 }}>
              ASESOR            </th>
            {labels.map((lab, i) => (
              <th key={i} style={{ border: "1px solid #000", padding: "8px 10px", fontSize: 20, textAlign: "center" }}>{lab}</th>
            ))}
            <th style={{ border: "1px solid #000", padding: "8px 10px", fontSize: 22 }}>TOTAL SOCIOS</th>
            <th style={{ border: "1px solid #000", padding: "8px 10px", fontSize: 22 }}>TOTAL VENTA</th>
            <th style={{ border: "1px solid #000", padding: "8px 10px", fontSize: 22 }}>%</th>
          </tr>
        </thead>
        <tbody>
          {asesoresActivos.length === 0 && (
            <tr>
              <td colSpan={labels.length + 5} style={{ padding: 12, textAlign: "center" }}>
                Sin datos
              </td>
            </tr>
          )}
          {asesoresActivos.map((a) => (
            <React.Fragment key={`${a}-monto`}>
              {renderRow(a, "MONTO")}
            </React.Fragment>
          ))}
          {asesoresActivos.map((a) => (
            <React.Fragment key={`${a}-socios`}>
              {renderRow(a, "SOCIOS")}
            </React.Fragment>
          ))}
          {asesoresActivos.length > 0 && (
            <tr style={{ background: "#f6f6f6", fontWeight: 800 }}>
              <td style={{ border: "1px solid #000", borderTop: "4px solid #000", padding: "8px 10px", textAlign: "center" }}></td>
              <td style={{ border: "1px solid #000", borderTop: "4px solid #000", padding: "8px 10px", fontSize: 20 }}>
                VENTA X DÍA
              </td>
              {days.map((d) => (
                <td
                  key={`tot-mon-${d}`}
                  style={{
                    border: "1px solid #000",
                    borderTop: "4px solid #000",
                    padding: "6px 8px",
                    textAlign: "center",
                    fontSize: 20,
                  }}
                >
                  {fmtMoney(dayTotals.totMon[d] || 0)}
                </td>
              ))}
              {/* columnas finales */}
              <td style={{ border: "1px solid #000", borderTop: "3px solid #000", padding: "8px 10px", textAlign: "center", fontSize: 22 }}>-
              </td>
              <td style={{ border: "1px solid #000", borderTop: "3px solid #000", padding: "8px 10px", textAlign: "center", fontSize: 25 }}>
                {fmtMoney(dayTotals.sumaMonto || 0)}   </td>
              <td style={{ border: "1px solid #000", borderTop: "3px solid #000", padding: "8px 10px", textAlign: "center", fontSize: 22 }}>
                -
              </td>
            </tr>
          )}
          {asesoresActivos.length > 0 && (
            <tr style={{ background: "#f6f6f6", fontWeight: 800 }}>
              <td style={{ border: "1px solid #000", padding: "8px 10px", textAlign: "center" }}></td>
              <td style={{ border: "1px solid #000", padding: "8px 10px", fontSize: 20 }}>
                SOCIOS X DÍA
              </td>
              {days.map((d) => (
                <td
                  key={`tot-soc-${d}`}
                  style={{
                    border: "1px solid #000",
                    padding: "6px 8px",
                    textAlign: "center",
                    fontSize: 20,
                  }}
                >
                  {dayTotals.totSoc[d] || 0}
                </td>
              ))}
              <td style={{ border: "1px solid #000", padding: "8px 10px", textAlign: "center", fontSize: 25 }}>
                {dayTotals.sumaSocios}
              </td>
              <td style={{ border: "1px solid #000", padding: "8px 10px", textAlign: "center", fontSize: 22 }}>
                -
              </td>
              <td style={{ border: "1px solid #000", padding: "8px 10px", textAlign: "center", fontSize: 22 }}>
                %100
              </td>
            </tr>

          )}
        </tbody>
      </table>
      <div style={{ marginTop: 6, fontSize: 12, opacity: .7 }}>
        Rango aplicado: {from}–{to} / {new Date(year, month - 1).toLocaleString("es-PE", { month: "long" }).toUpperCase()} {year}
      </div>
    </div>
  );
}
