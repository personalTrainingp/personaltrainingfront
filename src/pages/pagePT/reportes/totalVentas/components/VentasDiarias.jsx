import React, { useMemo } from "react";

/* ===== Zona horaria Lima (UTC-5) ===== */
function limaFromISO(iso) {
  if (!iso) return null;
  const s = String(iso).replace(" ", "T").replace(" -", "-");
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  return new Date(utc - 5 * 60 * 60000);
}
const DAY_ES = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
const fmtMoney = (n) => (Number(n)||0).toLocaleString("es-PE", { minimumFractionDigits: 0 });
const sumMonto  = (map = {}) => Object.values(map).reduce((a, n)   => a + (n || 0), 0);
const sumSocios = (map = {}) => Object.values(map).reduce((a, s)   => a + ((s?.size) || 0), 0);

const toNum = (v) => {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const s = String(v ?? "0").trim().replace(/[^\d,.-]/g, "");
  const commaDecimal = /,\d{1,2}$/.test(s);
  let t = s;
  if (commaDecimal) t = t.replace(/\./g, "").replace(",", ".");
  else t = t.replace(/,/g, "");
  const n = Number(t);
  return Number.isFinite(n) ? n : 0;
};
const norm = (s) => String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase();

const getVentaDate = (v) =>
  limaFromISO(
    v?.fecha_venta || v?.fecha || v?.createdAt ||
    v?.tb_ventum?.fecha_venta || v?.tb_ventum?.createdAt
  );

const getIdCliente = (v) =>
  v?.id_cli ?? v?.tb_ventum?.id_cli ?? v?.tb_cliente?.id_cli ??
  v?.venta?.id_cli ?? v?.tb_venta?.id_cli ?? null;

const getItemsProductos = (v) => (v?.detalle_ventaProductos || v?.detalle_ventaproductos || v?.detalle_venta_productos || []);
const getItemsServicios = (v) => (v?.detalle_ventaservicios || v?.detalle_ventaServicios || []);
const getItemsMembresia = (v) => (v?.detalle_ventaMembresia || v?.detalle_ventaMembresium || []);

const isProductItem = (it) => !!(it?.tb_producto || it?.id_producto || it?.nombre_producto);
const isProgramItem = (it) =>
  !!(it?.id_pgm || it?.tb_programa || it?.tb_ProgramaTraining || it?.tb_semana_training || typeof it?.sesiones === "number");

const itemImporte = (it) => {
  const cant = toNum(it?.cantidad ?? 1) || 1;
  const unit =
    toNum(it?.tarifa_monto) ||
    toNum(it?.precio_unitario) ||
    toNum(it?.tb_producto?.prec_venta) ||
    toNum(it?.tb_servicio?.prec_venta) || 0;
  return cant * unit;
};

const ventaEsPrograma = (v) => {
  const mems = getItemsMembresia(v);
  return Array.isArray(mems) && mems.length > 0;
};

const getImporteProgramas = (v) => {
  const items = [
    ...getItemsMembresia(v),
    ...(Array.isArray(v?.items) ? v.items : []),
  ];
  const onlyPrograms = items.filter((it) => isProgramItem(it) && !isProductItem(it));
  if (onlyPrograms.length) return onlyPrograms.reduce((acc, it) => acc + itemImporte(it), 0);
  // fallback si llegan ventas “planas” de programa
  return toNum(v?.monto_total) || toNum(v?.tb_ventum?.monto_total) || toNum(v?.monto);
};

const getAsesor = (v) => {
  const full = v?.tb_empleado?.nombres_apellidos_empl || v?.empleado || v?.nombre_empl || "";
  return norm((full.split(/\s+/)[0] || ""));
};

export default function VentasDiarias({
  ventas = [],
  year,
  month,        
  initDay = 1,
  cutDay,        
  asesores,     
}) {
  const listaAsesores = useMemo(() => {
    if (Array.isArray(asesores) && asesores.length) return asesores;
    const set = new Set();
    for (const v of ventas || []) {
      const full = v?.tb_empleado?.nombres_apellidos_empl || v?.empleado || v?.nombre_empl || "";
      const first = (full.split(/\s+/)[0] || "").trim();
      if (first) set.add(first.toUpperCase());
    }
    return Array.from(set);
  }, [asesores, ventas]);

  const {
    days, labels, dataByAsesor, totalMontoMes,
    lastDay, from, to
  } = useMemo(() => {
    const mIdx = Number(month) - 1;
    const lastDay = new Date(Number(year), mIdx + 1, 0).getDate();
    const from = Math.max(1, Math.min(Number(initDay||1), lastDay));
    const to   = Math.max(from, Math.min(Number(cutDay||lastDay), lastDay));
    const days = Array.from({length: to-from+1}, (_,i)=> from + i);
    const labels = days.map(d => {
      const dow = DAY_ES[new Date(Number(year), mIdx, d).getDay()];
      return ` \n${dow.toUpperCase()} ${d}`; 
    });

    const wanted = (Array.isArray(listaAsesores) ? listaAsesores : []).map(norm);
    const dataByAsesor = {};
    for (const a of wanted) {
      dataByAsesor[a] = {
        sociosByDay: Object.fromEntries(days.map(d => [d, new Set()])),
        montoByDay:  Object.fromEntries(days.map(d => [d, 0])),
      };
    }

    for (const v of Array.isArray(ventas) ? ventas : []) {
      const d = getVentaDate(v);
      if (!d || d.getFullYear()!==Number(year) || d.getMonth()!==mIdx) continue;
      const day = d.getDate();
      if (day < from || day > to) continue;

      const a = getAsesor(v);
      if (!dataByAsesor[a]) continue; // ignorar otros asesores

      const monto = getImporteProgramas(v);
      if (monto > 0) dataByAsesor[a].montoByDay[day] += monto;

      if (ventaEsPrograma(v)) {
        const idCli = getIdCliente(v);
        if (idCli != null) dataByAsesor[a].sociosByDay[day].add(String(idCli));
      }
    }

    let totalMontoMes = 0;
    for (const a of Object.keys(dataByAsesor)) {
      for (const d of days) totalMontoMes += dataByAsesor[a].montoByDay[d];
    }

    return { days, labels, dataByAsesor, totalMontoMes, lastDay, from, to };
  }, [ventas, year, month, initDay, cutDay, listaAsesores]);

  /* 3) Render de filas por asesor y tipo (SOCIOS/MONTO) */
  const renderRow = (a, tipo) => {
    const isSocios = tipo === "SOCIOS";
    const isMonto  = tipo === "MONTO";
    const socMap = dataByAsesor[a]?.sociosByDay || {};
    const monMap = dataByAsesor[a]?.montoByDay  || {};

    const totalSocios = Object.values(socMap).reduce((acc, set) => acc + (set?.size || 0), 0);
    const totalMonto  = Object.values(monMap).reduce((acc, n) => acc + (n || 0), 0);
    const pct = totalMontoMes > 0 ? Math.round((totalMonto*100)/totalMontoMes) : 0;

    return (
      <tr key={`${a}-${tipo}`} style={{ background: "#fff" }}>
        <td style={{ border:"1px solid #000", padding:"6px 10px", fontWeight:800,fontSize:18 }}>
          {a}  {isSocios ? "SOCIOS" : "TOTAL S/."}
        </td>

        {days.map((d) => (
          <td
            key={d}
            style={{
              border:"1px solid #000",
              padding:"6px 8px",
              textAlign:"CENTER",
              fontSize:22,
              fontWeight: isMonto ? ((monMap[d] || 0) > 0 ? 800 : 400) : ((socMap[d]?.size || 0) > 0 ? 700 : 400),
              color: isMonto ? ((monMap[d] || 0) > 0 ? "#c00000" : "#000") : "#000",
            }}
          >
            {isSocios ? (socMap[d]?.size || "") : ((monMap[d] || 0) ? fmtMoney(monMap[d]) : "")}
          </td>
        ))}

        <td style={{ border:"1px solid #000", padding:"6px 10px", textAlign:"right", fontWeight:800, fontSize:25 }}>
          {isSocios ? (totalSocios || "") : ""}
        </td>
        <td style={{ border:"1px solid #000", padding:"6px 10px", textAlign:"right", fontWeight:800 ,fontSize:25}}>
          {isMonto ? fmtMoney(totalMonto) : ""}
        </td>
        <td style={{ border:"1px solid #000", padding:"6px 10px", textAlign:"center", fontWeight:800 , fontSize:25}}>
          {isMonto ? `${pct}%` : ""}
        </td>
      </tr>
    );
  };

const asesoresNorm = (Array.isArray(listaAsesores) ? listaAsesores : []).map(norm);

// Mostrar solo asesores con data (>0 en monto o socios)
const asesoresActivos = asesoresNorm.filter((a) => {
  const monMap = dataByAsesor[a]?.montoByDay  || {};
  const socMap = dataByAsesor[a]?.sociosByDay || {};
  return sumMonto(monMap) > 0 || sumSocios(socMap) > 0;
});

  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ borderCollapse:"collapse", width:"100%", minWidth: 900, background:"#fff" }}>
        <thead>
          <tr style={{ background:"#c00000", color:"#fff" }}>
            <th style={{ border:"1px solid #000", padding:"8px 10px", position:"sticky", left:0, background:"#c00000" ,fontSize:20}}>
              ASESOR / CONCEPTO
            </th>
            {labels.map((lab, i) => (
              <th key={i} style={{ border:"1px solid #000", padding:"8px 10px" ,fontSize:20}}>{lab}</th>
            ))}
            <th style={{ border:"1px solid #000", padding:"8px 10px", fontSize:22 }}>TOTAL</th>
            <th style={{ border:"1px solid #000", padding:"8px 10px" , fontSize:22 }}>S/.</th>
            <th style={{ border:"1px solid #000", padding:"8px 10px", fontSize:22  }}>%</th>
          </tr>
        </thead>

        <tbody>
          {asesoresActivos.length === 0 && (
            <tr><td colSpan={labels.length + 3} style={{ padding:12, textAlign:"center" }}>Sin datos</td></tr>
          )}

          {asesoresActivos.map((a) => (
            <React.Fragment key={a}>
              {renderRow(a, "SOCIOS")}
              {renderRow(a, "MONTO")}
            </React.Fragment>
          ))}

          {/* Fila TOTAL MES */}
          {asesoresActivos.length > 0 && (() => {
            const totalSociosMes = asesoresActivos.reduce((acc, a) => {
              const map = dataByAsesor[a]?.sociosByDay || {};
              return acc + Object.values(map).reduce((s, set)=> s + (set?.size || 0), 0);
            }, 0);
            const totalMonto = asesoresActivos.reduce((acc, a) => {
              const map = dataByAsesor[a]?.montoByDay || {};
              return acc + Object.values(map).reduce((s, n)=> s + (n || 0), 0);
            }, 0);
            return (
              <tr style={{ background:"#fff", fontWeight:800 }}>
                <td style={{ border:"1px solid #000", padding:"8px 10px",fontSize:22 }}>TOTAL</td>
                {days.map((_, i) => <td key={i} style={{ border:"1px solid #000" }} />)}
                <td style={{ border:"1px solid #000", padding:"8px 10px", textAlign:"right",fontSize:25 }}>
                  {totalSociosMes ? totalSociosMes.toLocaleString("es-PE") : ""}
                </td>
                <td style={{ border:"1px solid #000", padding:"8px 10px", textAlign:"right",fontSize:25 }}>
                  {fmtMoney(totalMonto)}
                </td>
                <td style={{ border:"1px solid #000", padding:"8px 10px", textAlign:"center",fontSize:25 }}>100%</td>
              </tr>
            );
          })()}
        </tbody>
      </table>

      <div style={{ marginTop: 6, fontSize: 12, opacity: .7 }}>
        Rango aplicado: {from}–{to} / {new Date(year, month-1).toLocaleString("es-PE", { month:"long" }).toUpperCase()} {year}
      </div>
    </div>
  );
}
