import React, { useMemo, useState } from "react";
import { NumberFormatMoney } from "@/components/CurrencyMask";
import { InputNumber } from "primereact/inputnumber";
//import { TopControls } from "../resumenEjecutivo/components/TopControls";

const round2 = (x) =>
  Math.round((Number(x || 0) + Number.EPSILON) * 100) / 100;

function limaFromISO(iso) {
  if (!iso) return null;
  const s = String(iso).replace(" ", "T").replace(" -", "-");
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  return new Date(utc - 5 * 60 * 60000);
}

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

const getVentaDate = (v) =>
  limaFromISO(
    v?.fecha_venta ||
      v?.fecha ||
      v?.tb_ventum?.fecha_venta 
  );

const getItemsMembresia = (v) =>
  v?.detalleVenta_pagoVenta ||
  v?.detalle_ventaMembresia ||
  v?.detalle_ventaMembresium ||
  [];

const isProductItem = (it) =>
  !!(it?.tb_producto || it?.id_producto || it?.nombre_producto);

const isProgramItem = (it) =>
  it?.parcial_monto !== undefined;

const itemImporte = (it) => {
  if (it?.parcial_monto) return toNum(it.parcial_monto);
  return 0;
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
  const onlyPrograms = items.filter(
    (it) => isProgramItem(it) && !isProductItem(it)
  );
  if (onlyPrograms.length) {
    return onlyPrograms.reduce((acc, it) => acc + itemImporte(it), 0);
  }
  return (
    toNum(v?.monto_total) ||
    toNum(v?.tb_ventum?.monto_total) ||
    toNum(v?.monto)
  );
};


export default function ResumenMembresias({
  ventas = [],
  year,
  month,
  initDay = 1,
  cutDay,
  defaultRateIgv = 0.18,
  defaultRateRenta = 0.03,
  defaultRateTarjeta = 0.045,
  defaultRateComisionEstilista = 0.3,
}) {
  const [rateIgv, setRateIgv] = useState(defaultRateIgv);
  const [rateRenta, setRateRenta] = useState(defaultRateRenta);
  const [rateTarjeta, setRateTarjeta] = useState(defaultRateTarjeta);
  const [rateComisionEstilista, setRateComisionEstilista] = useState(
    defaultRateComisionEstilista
  );
  const [activeRateEditor, setActiveRateEditor] = useState(null);

  const { bruto, from, to } = useMemo(() => {
    if (!year || !month) return { bruto: 0, from: 1, to: 1 };

    const mIdx = Number(month) - 1;
    const lastDay = new Date(Number(year), mIdx + 1, 0).getDate();
    const from = Math.max(1, Math.min(Number(initDay || 1), lastDay));
    const to = Math.max(from, Math.min(Number(cutDay || lastDay), lastDay));

    let bruto = 0;

    for (const v of Array.isArray(ventas) ? ventas : []) {
      const d = getVentaDate(v);
      if (!d || d.getFullYear() !== Number(year) || d.getMonth() !== mIdx) {
        continue;
      }
      const day = d.getDate();
      if (day < from || day > to) continue;

      // Solo membresías / programas
      if (!ventaEsPrograma(v)) continue;

      const importe = getImporteProgramas(v);
      if (importe > 0) bruto += importe;
    }

    return { bruto, from, to };
  }, [ventas, year, month, initDay, cutDay]);

  const igvMonto = round2(bruto * rateIgv);
  const tarjetaMonto = round2(bruto * rateTarjeta);
  const rentaMonto = round2(bruto * rateRenta);
 // const comisionEstilistaMonto = round2(bruto * rateComisionEstilista);

  const ingresoNeto = round2(
    bruto - igvMonto - tarjetaMonto - rentaMonto 
  );

  const pctLabel = (v) => `${(v * 100).toFixed(2)}%`;

  const baseTableStyle = {
    borderCollapse: "collapse",
    margin: "24px auto 12px",
    fontSize: 22,
    minWidth: 900,
  };

  const thStyle = {
    border: "1px solid #fff",
    padding: "10px 16px",
    textAlign: "center",
    color: "#fff",
    fontWeight: 900,
    letterSpacing: 0.5,
    minWidth: 140,
  };

  const tdTotales = {
    border: "1px solid #ddd",
    padding: "10px 16px",
    textAlign: "center",
    fontSize: 26,
    fontWeight: 800,
    background: "#fff",
  };

  return (
    <div style={{ marginTop: 60 }}>
      <div
        style={{
          fontWeight: 700,
          marginBottom: 8,
          textAlign: "center",
          fontSize: 30,
        }}
      >
        VENTAS POR MEMBRESÍAS
      </div>

      <table style={baseTableStyle}>
        <thead>
          <tr style={{ fontSize: 22 }}>
            {/* VENTA BRUTA */}
            <th className="bg-primary" style={thStyle}>
              VENTA
              <br />
              BRUTA
            </th>

            {/* IGV */}
            <th className="bg-primary" style={thStyle}>
              IGV
              <br />
              <span
                style={{
                  cursor: "pointer",
                  textDecoration: "underline dotted",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveRateEditor(
                    activeRateEditor === "igv" ? null : "igv"
                  );
                }}
              >
                (-{pctLabel(rateIgv)})
              </span>
              {activeRateEditor === "igv" && (
                <div style={{ marginTop: 4 }}>
                  <InputNumber
                    value={rateIgv * 100}
                    onValueChange={(e) => setRateIgv((e.value || 0) / 100)}
                    mode="decimal"
                    minFractionDigits={0}
                    maxFractionDigits={2}
                    suffix="%"
                    inputStyle={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 12,
                    }}
                    style={{ width: 70 }}
                    onBlur={() => setActiveRateEditor(null)}
                  />
                </div>
              )}
            </th>

            {/* RENTA */}
            <th className="bg-primary" style={thStyle}>
              RENTA
              <br />
              <span
                style={{
                  cursor: "pointer",
                  textDecoration: "underline dotted",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveRateEditor(
                    activeRateEditor === "renta" ? null : "renta"
                  );
                }}
              >
                (-{pctLabel(rateRenta)})
              </span>
              {activeRateEditor === "renta" && (
                <div style={{ marginTop: 4 }}>
                  <InputNumber
                    value={rateRenta * 100}
                    onValueChange={(e) => setRateRenta((e.value || 0) / 100)}
                    mode="decimal"
                    minFractionDigits={0}
                    maxFractionDigits={2}
                    suffix="%"
                    inputStyle={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 12,
                    }}
                    style={{ width: 70 }}
                    onBlur={() => setActiveRateEditor(null)}
                  />
                </div>
              )}
            </th>

            {/* TARJETA */}
            <th className="bg-primary" style={thStyle}>
              TARJETA
              <br />
              <span
                style={{
                  cursor: "pointer",
                  textDecoration: "underline dotted",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveRateEditor(
                    activeRateEditor === "tarjeta" ? null : "tarjeta"
                  );
                }}
              >
                (-{pctLabel(rateTarjeta)})
              </span>
              {activeRateEditor === "tarjeta" && (
                <div style={{ marginTop: 4 }}>
                  <InputNumber
                    value={rateTarjeta * 100}
                    onValueChange={(e) =>
                      setRateTarjeta((e.value || 0) / 100)
                    }
                    mode="decimal"
                    minFractionDigits={0}
                    maxFractionDigits={2}
                    suffix="%"
                    inputStyle={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 12,
                    }}
                    style={{ width: 70 }}
                    onBlur={() => setActiveRateEditor(null)}
                  />
                </div>
              )}
            </th>

        

            {/* INGRESO NETO */}
            <th className="bg-primary" style={thStyle}>
              INGRESO
              <br />
              NETO
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            {/* VENTA BRUTA */}
            <td style={tdTotales}>
              <NumberFormatMoney amount={bruto} />
            </td>

            {/* IGV */}
            <td style={{ ...tdTotales, color: "red" }}>
              - <NumberFormatMoney amount={igvMonto} />
            </td>

            {/* RENTA */}
            <td style={{ ...tdTotales, color: "red" }}>
              - <NumberFormatMoney amount={rentaMonto} />
            </td>

            {/* TARJETA */}
            <td style={{ ...tdTotales, color: "red" }}>
              - <NumberFormatMoney amount={tarjetaMonto} />
            </td>

          

            {/* INGRESO NETO */}
            <td
              style={{
                ...tdTotales,
                fontWeight: 700,
                color: "#007b00",
              }}
            >
              <NumberFormatMoney amount={ingresoNeto} />
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7, textAlign: "center" }}>
        Rango aplicado a membresías: {from}–{to} /{" "}
        {year && month
          ? new Date(year, month - 1).toLocaleString("es-PE", {
              month: "long",
            }).toUpperCase()
          : ""}
        {year ? ` ${year}` : ""}
      </div>
    </div>
    
  );
}
