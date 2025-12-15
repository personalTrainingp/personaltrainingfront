import React from "react";
import {
  buildExecutiveTableData,
  fmtMoney,
  fmtNum,
  getMetaPorMes
} from "../adapters/executibleLogic";
export const ExecutiveTable2 = (props) => {
  const {
    selectedMonthName,
    perMonth,
    monthOrderForOrigin,
    orderedMFPrograms,
  } = buildExecutiveTableData(props);

  const { cutDay } = props;

  const fmtUsd = (n) =>
    new Intl.NumberFormat("es-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(n || 0));

  // === estilos ===
  const cBlack = "#000000";
  const cWhite = "#ffffff";
  const cRed = "#c00000";
  const border = "1px solid #333";

  const sWrap = {
    fontFamily:
      "Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif",
    color: cBlack,
  };

  const sHeader = {
    background: cRed,
    color: cWhite,
    textAlign: "center",
    padding: "16px 12px",
    fontWeight: 700,
    letterSpacing: 0.2,
    fontSize: 40,
  };

  const sTable = {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
  };

  const sThMes = {
    color: cWhite,
    textAlign: "center",
    fontWeight: 700,
    fontSize: 23,
    padding: "10px",
  };

  const sThLeft = { ...sThMes, textAlign: "center", width: 260 };

  const sCell = {
    border,
    padding: "8px 10px",
    background: cWhite,
    fontSize: 28,
    textAlign: "center",
  };

  const sCellBold = {
    border,
    padding: "8px 10px",
    background: cWhite,
    fontWeight: 700,
    fontSize: 28,
    textAlign: "center",
  };

  const sRowRed = {
    background: cRed,
    color: cWhite,
    fontWeight: 800,
  };

  const sHeaderWrap = { textAlign: "center", margin: "8px 0" };

  const sHeaderChip = {
    display: "inline-block",
    background: cRed,
    color: cWhite,
    padding: "10px 24px",
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: 0.2,
    lineHeight: 1.1,
    borderRadius: 6,
  };

  const TitleChip = ({ children, style }) => (
    <div style={sHeaderWrap}>
      <span style={{ ...sHeaderChip, ...style }}>{children}</span>
    </div>
  );


  const TableHeadFor = ({ okey }) => {
    const months = monthOrderForOrigin(okey);
    return (
      <thead>
        <tr>
          <th style={{ ...sThLeft, background: cRed }} />
          {months.map((m, idx) => (
            <th key={`${okey}-h-${idx}`} style={{ ...sThMes, background: cRed }}>
              <div>{m.label}</div>
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  const renderRowsFor = (okey, rowsToRender) => {
    const months = monthOrderForOrigin(okey);

    return rowsToRender.map((r) => (
      <tr key={r.key + r.label}>
        <td
          style={{
            ...sCellBold,
            background: "#c00000",
            color: "#fff",
            fontWeight: 800,
          }}
        >
          {r.label}
        </td>

        {months.map((m, idx) => {
          let val = 0;
          let isPct = false;

          if (okey === "monkeyfit") {
            val = m.metrics?.[r.key] ?? 0;
          } else if (!isNaN(Number(okey))) {
            const [, pgmId, campo] = r.key.split(":");
            const mf = m.metrics?.mfByProg?.[pgmId] || {};
            if (campo === "venta") val = mf.venta ?? 0;
            else if (campo === "cant") val = mf.cant ?? 0;
            else if (campo === "ticket")
              val = mf.cant ? mf.venta / mf.cant : 0;
            else if (campo === "ventaF") val = mf.ventaFull ?? 0;
            else if (campo === "cantF") val = mf.cantFull ?? 0;
            else if (campo === "ticketF")
              val = mf.cantFull ? mf.ventaFull / mf.cantFull : 0;
          } else if (r.key.startsWith("o:")) {
            // (si algún día usas orígenes aquí)
            const [, _ok, campo] = r.key.split(":");
            const o = m.metrics?.byOrigin?.[_ok];
            if (campo === "total") val = o?.total ?? 0;
            else if (campo === "cant") val = o?.cant ?? 0;
            else if (campo === "ticket")
              val = o?.cant ? o.total / o.cant : 0;
            else if (campo === "pct") {
              const base = m.metrics?.totalServ || 0;
              val = base > 0 ? ((o?.total ?? 0) / base) * 100 : 0;
              isPct = true;
            }
          } else {
            // cualquier otro campo directo en metrics
            val = m.metrics?.[r.key] ?? 0;
          }

          const txt = isPct
            ? `${fmtNum(val, 2)} %`
            : r.type === "money"
              ? fmtMoney(val)
              : r.type === "float2"
                ? fmtNum(val, 2)
                : fmtNum(val, 0);

          const isSelectedCol = m.label === selectedMonthName;

          return (
            <td
              key={`${okey}-c-${r.key}-${idx}`}
              style={{
                ...sCell,
                ...(isSelectedCol
                  ? {
                    background: "#c00000",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 28,
                  }
                  : {}),
              }}
            >
              {txt}
            </td>
          );
        })}
      </tr>
    ));
  };

  const TableHead = () => (
    <thead>
      <tr>
        <th style={{ ...sThLeft, background: cRed }} />
        {perMonth.map((m, idx) => (
          <th key={idx} style={{ ...sThMes, background: cRed }}>
            <div>{m.label}</div>
          </th>
        ))}
      </tr>
    </thead>
  );

  const PGM_LABEL = {
    2: "CHANGE 45",
    3: "FS 45",
    4: "FISIO MUSCLE",
    5: "VERTIKAL CHANGE",
  };

  const labelPgm = (id) => PGM_LABEL[id] || `PGM ${id}`;

  const mfProgramKeys = Array.from(
    new Set(perMonth.flatMap((m) => Object.keys(m.metrics?.mfByProg || {})))
  ).sort();

  const rowsMFByProg = (pgmId) => [
    { key: `mf:${pgmId}:venta`, label: "VENTA ", type: "money" },
    { key: `mf:${pgmId}:cant`, label: " RESERVAS", type: "int" },
    { key: `mf:${pgmId}:ticket`, label: "TICKET MEDIO", type: "money" },
    { key: `mf:${pgmId}:ventaF`, label: "VENTA  MES COMPLETO", type: "money" },
    { key: `mf:${pgmId}:cantF`, label: " RESERVAS MES COMPLETO", type: "int" },
    {
      key: `mf:${pgmId}:ticketF`,
      label: "TICKET MEDIO MES COMPLETO",
      type: "money",
    },
  ];

  const ResumenCuotaTable = () => (
    <table style={sTable}>
      <thead>
        <tr>
          <th
            style={{
              ...sThLeft,
              background: cRed,
              color: "#fff",
              fontSize: 20,
              textTransform: "uppercase",
            }}
          />
          {perMonth.map((m, idx) => (
            <th
              key={idx}
              style={{
                ...sThMes,
                background: cRed,
                color: "#fff",
                fontSize: 24,
              }}
            >
              {m.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {/* CUOTA DEL MES */}
        <tr>
          <td
            style={{
              ...sCellBold,
              background: cRed,
              color: "#fff",
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            CUOTA DEL MES
          </td>
          {perMonth.map((m, idx) => {
            const meta = getMetaPorMes(m.mes, m.anio);
            return (
              <td key={idx} style={{ ...sCell, fontWeight: 700, color: "#000" }}>
                {fmtMoney(meta)}
              </td>
            );
          })}
        </tr>

        {/* MONTO RESTANTE DE CUOTA */}
        <tr>
          <td
            style={{
              ...sCellBold,
              background: cRed,
              color: "#fff",
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            MONTO RESTANTE DE CUOTA
          </td>
          {perMonth.map((m, idx) => {
            const meta = getMetaPorMes(m.mes, m.anio);
            const total = m.metrics?.totalMes || 0;
            const restante = meta - total;
            const esSurplus = restante < 0;
            const color = esSurplus ? "#007b00" : "#c00000";
            const prefix = esSurplus ? "+" : "-";
            const moneyStr = fmtNum(Math.abs(restante), 2);
            return (
              <td key={idx} style={{ ...sCellBold, fontWeight: 700, color }}>
                {prefix} S/ {moneyStr}
              </td>
            );
          })}
        </tr>

        {/* % RESTANTE PARA CUOTA */}
        <tr>
          <td
            style={{
              ...sCellBold,
              background: cRed,
              color: "#fff",
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            % RESTANTE PARA CUOTA
          </td>
          {perMonth.map((m, idx) => {
            const meta = getMetaPorMes(m.mes, m.anio);
            const total = m.metrics?.totalMes || 0;
            const alcancePct = meta > 0 ? (total / meta) * 100 : 0;
            const restantePct = 100 - alcancePct;
            const cumple = restantePct <= 0;
            const color = cumple ? "#007b00" : "#c00000";
            const prefix = cumple ? "+" : "-";
            const valAbs = Math.abs(restantePct);
            return (
              <td key={idx} style={{ ...sCell, fontWeight: 700, color }}>
                {prefix} {fmtNum(valAbs, 2)} %
              </td>
            );
          })}
        </tr>

        {/* MONTO DE AVANCE DE CUOTA */}
        <tr>
          <td
            style={{
              ...sCellBold,
              background: cRed,
              color: "#fff",
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            MONTO DE AVANCE DE CUOTA
          </td>
          {perMonth.map((m, idx) => {
            const meta = getMetaPorMes(m.mes, m.anio);
            const total = m.metrics?.totalMes || 0;
            const avanceSoles = Math.min(meta, total);
            return (
              <td key={idx} style={{ ...sCellBold, fontWeight: 700 }}>
                {fmtMoney(avanceSoles)}
              </td>
            );
          })}
        </tr>

        {/* % ALCANCE DE CUOTA */}
        <tr>
          <td
            style={{
              ...sCellBold,
              background: cRed,
              color: "#fff",
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            % ALCANCE DE CUOTA
          </td>
          {perMonth.map((m, idx) => {
            const meta = getMetaPorMes(m.mes, m.anio);
            const total = m.metrics?.totalMes || 0;
            const alcancePct = meta > 0 ? (total / meta) * 100 : 0;
            return (
              <td
                key={idx}
                style={{
                  ...sCell,
                  fontWeight: 700,
                  color: "#007b00",
                }}
              >
                + {fmtNum(Math.abs(alcancePct), 2)} %
              </td>
            );
          })}
        </tr>

        {/* VENTA TOTAL AL CORTE */}
        <tr style={{ background: "#000", color: "#fff", fontWeight: 700 }}>
          <td
            style={{
              ...sCellBold,
              background: "transparent",
              color: "#fff",
              fontWeight: 800,
            }}
          >
            {`VENTA TOTAL AL ${cutDay}`}
          </td>
          {perMonth.map((m, idx) => (
            <td
              key={idx}
              style={{ ...sCellBold, background: "transparent", color: "#fff" }}
            >
              {fmtMoney(m.metrics?.totalMes || 0)}
            </td>
          ))}
        </tr>

        {/* VENTA TOTAL MES FULL */}
        <tr style={sRowRed}>
          <td
            style={{
              ...sCellBold,
              background: "transparent",
              color: "#fff",
              fontWeight: 800,
            }}
          >
            VENTA TOTAL MES
          </td>
          {perMonth.map((m, idx) => (
            <td
              key={idx}
              style={{
                ...sCellBold,
                background: "transparent",
                color: "#fff",
                fontWeight: 800,
              }}
            >
              {fmtMoney(m.metrics?.totalMesFull || 0)}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );

  const otherMonths = perMonth.slice(0, perMonth.length - 1);
  const lastMonth = perMonth.length > 0 ? perMonth[perMonth.length - 1] : null;

  // ya tienes orderedMFPrograms desde la lógica, pero por si quieres recalcular aquí:
  const orderedMF = orderedMFPrograms.length ? orderedMFPrograms : [...mfProgramKeys].sort((a, b) => {
    const lastValA = lastMonth?.metrics?.mfByProg?.[a];
    const lastValB = lastMonth?.metrics?.mfByProg?.[b];
    const lastA = Number(lastValA?.cant || 0);
    const lastB = Number(lastValB?.cant || 0);
    if (lastA > lastB) return -1;
    if (lastA < lastB) return 1;
    const fallbackA = otherMonths.reduce(
      (acc, m) => acc + Number(m.metrics?.mfByProg?.[a]?.cant || 0),
      0
    );
    const fallbackB = otherMonths.reduce(
      (acc, m) => acc + Number(m.metrics?.mfByProg?.[b]?.cant || 0),
      0
    );
    if (fallbackA > fallbackB) return -1;
    if (fallbackA < fallbackB) return 1;
    return a.localeCompare(b);
  });

  return (
    <div style={sWrap}>
      {/* === MONKEYFIT POR PROGRAMA === */}
      <TitleChip style={{ marginTop: 32, background: "black" }}>
        MONKEYFIT
      </TitleChip>

      {orderedMF.length === 0 ? (
        <TitleChip style={{ background: "#444", fontSize: 28, padding: "8px 18px" }}>
          SIN RESERVAS MONKEYFIT EN EL PERIODO
        </TitleChip>
      ) : (
        orderedMF.map((pgmId) => (
          <div key={`mf-${pgmId}`} style={{ marginBottom: 24 }}>
            <div style={sHeader}>{` ${labelPgm(pgmId)}`}</div>
            <table style={sTable}>
              <TableHeadFor okey={pgmId} />
              <tbody>{renderRowsFor(pgmId, rowsMFByProg(pgmId))}</tbody>
            </table>
          </div>
        ))
      )}

      {/* === MONKEYFIT TOTAL === */}
      <TitleChip>MONKEYFIT (TOTAL)</TitleChip>
      <table style={sTable}>
        <TableHeadFor okey="monkeyfit" />
        <tbody>
          {renderRowsFor("monkeyfit", [
            { key: "venta_monkeyfit", label: "VENTA  AL CORTE", type: "money" },
            {
              key: "cantidad_reservas_monkeyfit",
              label: "CANTIDAD RESERVAS  AL CORTE",
              type: "int",
            },
            {
              key: "ticket_medio_monkeyfit",
              label: "TICKET MEDIO  AL CORTE",
              type: "money",
            },
            {
              key: "venta_monkeyfit_full",
              label: "VENTA  MES COMPLETO",
              type: "money",
            },
            {
              key: "cantidad_reservas_monkeyfit_full",
              label: "CANTIDAD RESERVAS  MES COMPLETO",
              type: "int",
            },
            {
              key: "ticket_medio_monkeyfit_full",
              label: "TICKET MEDIO  MES COMPLETO",
              type: "money",
            },
          ])}
        </tbody>
      </table>

      <div style={{ height: 32, marginTop: 50 }} />

      {/* === RESUMEN CUOTA VS VENTAS === */}
      <TitleChip style={{ fontSize: 28, padding: "8px 18px" }}>
        RESUMEN DE CUOTA VS VENTAS
      </TitleChip>
      <ResumenCuotaTable />

      <div style={{ height: 32 }} />

      {/* === MARKETING: INVERSIÓN VS LEADS === */}
      <TitleChip style={{ fontSize: 28, padding: "8px 18px" }}>
        DETALLE DE INVERSIÓN EN REDES VS RESULTADOS EN LEADS
      </TitleChip>

      <table style={sTable}>
        <TableHead />
        <tbody>
          {[

            { key: "mkInvMeta", label: "Inversion Meta", type: "money" },
            { key: "mkLeadsMeta", label: "CANTIDAD LEADS  META", type: "int" },
            { key: "mkCplMeta", label: "COSTO POR LEAD META", type: "float2" },
            {
              key: "mkCacMeta",
              label: "COSTO ADQUISICION DE CLIENTES META",
              type: "float2",
            },
            { key: "mkInvTikTok", label: "Inversion TikTok", type: "money" },
            { key: "mkLeadsTikTok", label: "CANTIDAD LEADS  TIKTOK", type: "int" },
            {
              key: "mkCplTikTok",
              label: "COSTO POR LEAD TIKTOK",
              type: "float2",
            },
            {
              key: "mkCacTikTok",
              label: "COSTO ADQUISICION CLIENTES TIKTOK",
              type: "float2",
            },
            { key: "mkInv", label: "INVERSIÓN TOTAL REDES", type: "money" },
            { key: "mkLeads", label: "TOTAL LEADS DE META + TIKTOK", type: "int" },
            {
              key: "mkCpl",
              label: "COSTO TOTAL POR LEAD DE META + TIKTOK",
              type: "float2",
            },
            {
              key: "mkCac",
              label: "COSTO ADQUISICION DE CLIENTES",
              type: "float2",
            },
          ].map((r, i) => (
            <tr
              key={r.key + r.label}
              style={{
                borderBottom: (i + 1) % 4 === 0 ? "8px solid #000" : "1px solid #000",
              }}
            >
              <td
                style={{
                  ...sCellBold,
                  background: "#c00000",
                  color: "#fff",
                  fontWeight: 800,
                }}
              >
                {r.label}
              </td>
              {perMonth.map((m, idx) => {
                const val = m.metrics?.[r.key] ?? 0;
                const txt =
                  r.type === "money"
                    ? r.key === "mkInvMeta"
                      ? fmtUsd(val)
                      : fmtMoney(val)
                    : r.type === "float2"
                      ? fmtNum(val, 2)
                      : fmtNum(val, 0);

                const isLast = idx === perMonth.length - 1;

                return (
                  <td
                    key={idx}
                    style={{
                      ...sCell,
                      ...(isLast
                        ? {
                          background: "#c00000",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 28,
                        }
                        : {}),
                    }}
                  >
                    {txt}
                  </td>
                );
              })}
            </tr>
          ))}
          {/* FILA DE MESES */}
          <tr>
            <td
              style={{
                ...sCellBold,
                background: "#c00000",
                color: "#fff",
                fontWeight: 800,
                fontSize: 24,
              }}
            >
              MESES
            </td>
            {perMonth.map((m) => (
              <td
                key={`mes-${m.label}`}
                style={{
                  background: "#c00000",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 25,
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                {m.label}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
