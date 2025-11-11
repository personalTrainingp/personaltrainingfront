import React, { useEffect, useMemo, useState } from "react";
import PTApi from "@/common/api/PTApi";
import TablaRenovaciones from "./TablaRenovaciones.jsx";

const toDateOnly = (s) => { if (!s) return null; const d = new Date(String(s)); if (isNaN(d)) return null; d.setHours(0,0,0,0); return d; };

function groupByClientSorted(timeline = []) {
  const byCli = new Map();
  for (const t of timeline) {
    const key = t?.id_cli ?? t?.cliente ?? Math.random();
    if (!byCli.has(key)) byCli.set(key, []);
    byCli.get(key).push(t);
  }
  for (const arr of byCli.values()) arr.sort((a,b)=> String(a.fechaVenta).localeCompare(String(b.fechaVenta)));
  return byCli;
}

function timelineToRenovacionesItems(timeline = [], { beforeDays, afterDays } = {}) {
  const items = [];
  const byCli = groupByClientSorted(timeline);

  for (const arr of byCli.values()) {
    for (let i = 0; i < arr.length; i++) {
      const curr = arr[i];
      const fin = toDateOnly(curr?.fechaFin);
      if (!fin) continue;

      const next = arr[i + 1] || null;
      let fechaRenovacion = null;
      if (next) {
        const nextSale = toDateOnly(next?.fechaVenta);
        if (nextSale) {
          // Esta es la lógica de la ventana:
          const left = new Date(fin);  left.setDate(left.getDate() - Number(beforeDays || 0));
          const right = new Date(fin); right.setDate(right.getDate() + Number(afterDays  || 0));
          
          if (nextSale >= left && nextSale <= right) {
            fechaRenovacion = nextSale.toISOString().slice(0, 10);
          }
        }
      }

      items.push({
        id_cli: curr?.id_cli ?? null,
        cliente: curr?.cliente || "SIN NOMBRE",
        plan: curr?.plan || "-",
        monto: Number(curr?.monto ?? 0),
        fechaFin: fin.toISOString().slice(0, 10),
        fechaRenovacion,
      });
    }
  }
  return items;
}

export default function RenovacionesPanel({
  id_empresa,
  baseDate = new Date(),
  months = 8,
  beforeDays = 0,   
  afterDays = 91,  
  title = "Renovaciones y Vencimientos",
}) {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const [bDays, setBDays] = useState(beforeDays);
  const [aDays, setADays] = useState(afterDays);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await PTApi.get("/parametros/membresias/linea-de-tiempo", {
          params: { empresa: id_empresa || 598, incluirMontoCero: 1 },
        });
        if (!mounted) return;
        setTimeline(Array.isArray(data?.timeline) ? data.timeline : []);
        setError(null);
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.detail || e?.message || "Error cargando timeline");
        setTimeline([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id_empresa]);

  const items = useMemo(
    // La lógica de 'items' ahora usará 0 y 91 por defecto
    () => timelineToRenovacionesItems(timeline, { beforeDays: bDays, afterDays: aDays }),
    [timeline, bDays, aDays]
  );

  if (loading) return <div>Cargando renovaciones…</div>;
  if (error) return <div style={{ color: "#c00000" }}>Error: {String(error)}</div>;

  return (
    <div>
      {/* Controles rápidos para probar ventanas */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <label>DIA DESPUES:</label>
        <input type="number" value={aDays} onChange={(e)=>setADays(Number(e.target.value))} style={{ width: 90 }} />
        <button onClick={()=>{ setBDays(0); setADays(365); }}>Sin ventana</button>
       
      </div>

      <TablaRenovaciones items={items} months={months} base={baseDate} title={title} />
    </div>
  );
}