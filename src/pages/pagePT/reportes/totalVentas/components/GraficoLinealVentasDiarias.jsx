import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";

/* ===== Helpers copiados / compatibles con VentasDiarias ===== */

function limaFromISO(iso) {
  if (!iso) return null;
  const s = String(iso).replace(" ", "T").replace(" -", "-");
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  return new Date(utc - 5 * 60 * 60000);
}

const DAY_ES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

const norm = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

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
      v?.createdAt ||
      v?.tb_ventum?.fecha_venta ||
      v?.tb_ventum?.createdAt
  );

const getIdCliente = (v) =>
  v?.id_cli ??
  v?.tb_ventum?.id_cli ??
  v?.tb_cliente?.id_cli ??
  v?.venta?.id_cli ??
  v?.tb_venta?.id_cli ??
  null;

const getItemsMembresia = (v) =>
  v?.detalle_ventaMembresia || v?.detalle_ventaMembresium || [];

const isProductItem = (it) =>
  !!(it?.tb_producto || it?.id_producto || it?.nombre_producto);

const isProgramItem = (it) =>
  !!(
    it?.id_pgm ||
    it?.tb_programa ||
    it?.tb_ProgramaTraining ||
    it?.tb_semana_training ||
    typeof it?.sesiones === "number"
  );

const itemImporte = (it) => {
  const cant = toNum(it?.cantidad ?? 1) || 1;
  const unit =
    toNum(it?.tarifa_monto) ||
    toNum(it?.precio_unitario) ||
    toNum(it?.tb_producto?.prec_venta) ||
    toNum(it?.tb_servicio?.prec_venta) ||
    0;
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
  const onlyPrograms = items.filter(
    (it) => isProgramItem(it) && !isProductItem(it)
  );
  if (onlyPrograms.length)
    return onlyPrograms.reduce((acc, it) => acc + itemImporte(it), 0);

  return (
    toNum(v?.monto_total) ||
    toNum(v?.tb_ventum?.monto_total) ||
    toNum(v?.monto)
  );
};

const getAsesor = (v) => {
  const full =
    v?.tb_empleado?.nombres_apellidos_empl ||
    v?.empleado ||
    v?.nombre_empl ||
    "";
  return norm((full.split(/\s+/)[0] || "").trim());
};


export const GraficoLinealVentasDiarias = ({
  ventas = [],
  year,
  month,
  initDay = 1,
  cutDay,
  asesores, // opcional: lista fija
}) => {
  const [mode, setMode] = useState("monto"); // "monto" | "socios"

  // Lista de asesores (primer nombre, como en la tabla)
  const listaAsesores = useMemo(() => {
    if (Array.isArray(asesores) && asesores.length) return asesores;
    const set = new Set();
    for (const v of ventas || []) {
      const full =
        v?.tb_empleado?.nombres_apellidos_empl ||
        v?.empleado ||
        v?.nombre_empl ||
        "";
      const first = (full.split(/\s+/)[0] || "").trim();
      if (first) set.add(first.toUpperCase());
    }
    return Array.from(set);
  }, [asesores, ventas]);

  const asesoresNorm = useMemo(
    () => (Array.isArray(listaAsesores) ? listaAsesores : []).map(norm),
    [listaAsesores]
  );

  const {
    days,
    labels,
    dataByAsesor, // { [asesorNorm]: { montoByDay: {d}, sociosByDay: {d:Set} } }
  } = useMemo(() => {
    const mIdx = Number(month) - 1;
    const lastDayOfMonth = new Date(Number(year), mIdx + 1, 0).getDate();
    const from = Math.max(1, Math.min(Number(initDay || 1), lastDayOfMonth));
    const to = Math.max(
      from,
      Math.min(Number(cutDay || lastDayOfMonth), lastDayOfMonth)
    );
    const days = Array.from({ length: to - from + 1 }, (_, i) => from + i);

    const labels = days.map((d) => {
      const dow = DAY_ES[new Date(Number(year), mIdx, d).getDay()];
      return `${dow.toUpperCase()} ${d}`;
    });

    const wanted = asesoresNorm;
    const dataByAsesor = {};

    for (const a of wanted) {
      dataByAsesor[a] = {
        montoByDay: Object.fromEntries(days.map((d) => [d, 0])),
        sociosByDay: Object.fromEntries(days.map((d) => [d, new Set()])),
      };
    }

    for (const v of Array.isArray(ventas) ? ventas : []) {
      const d = getVentaDate(v);
      if (!d || d.getFullYear() !== Number(year) || d.getMonth() !== mIdx)
        continue;
      const day = d.getDate();
      if (!days.includes(day)) continue;

      const a = getAsesor(v);
      const entry = dataByAsesor[a];
      if (!entry) continue; // asesor no incluido

      const monto = getImporteProgramas(v);
      if (monto > 0) {
        entry.montoByDay[day] += monto;
      }

      if (ventaEsPrograma(v)) {
        const idCli = getIdCliente(v);
        if (idCli != null) {
          entry.sociosByDay[day].add(String(idCli));
        }
      }
    }

    return { days, labels, dataByAsesor };
  }, [ventas, year, month, initDay, cutDay, asesoresNorm]);

  const labelFromNorm = (aNorm) => {
    const found = listaAsesores.find((x) => norm(x) === aNorm);
    return found || aNorm;
  };

  const asesoresActivos = useMemo(() => {
    const activos = [];
    for (const a of asesoresNorm) {
      const entry = dataByAsesor[a];
      if (!entry) continue;

      const sumMonto = Object.values(entry.montoByDay || {}).reduce(
        (acc, n) => acc + (n || 0),
        0
      );
      const sumSocios = Object.values(entry.sociosByDay || {}).reduce(
        (acc, set) => acc + (set?.size || 0),
        0
      );
      if (sumMonto > 0 || sumSocios > 0) activos.push(a);
    }
    return activos;
  }, [asesoresNorm, dataByAsesor]);

  const series = useMemo(() => {
    if (!days.length) return [];

    return asesoresActivos.map((aNorm) => {
      const entry = dataByAsesor[aNorm] || {};
      const data =
        mode === "monto"
          ? days.map((d) => {
              const val = entry.montoByDay?.[d] || 0;
              return Number(val.toFixed(2));
            })
          : days.map((d) => entry.sociosByDay?.[d]?.size || 0);

      return {
        name: labelFromNorm(aNorm),
        data,
      };
    });
  }, [asesoresActivos, dataByAsesor, days, mode]);

  const options = useMemo(
    () => ({
      chart: {
        type: "line",
        toolbar: { show: false },
        parentHeightOffset: 0,
      },
      stroke: { curve: "smooth", width: 3 },
      markers: { size: 4 },
      grid: {
        padding: { bottom: 80, left: 8, right: 8 },
      },
      xaxis: {
        categories: labels,
        labels: {
          rotate: -90,
          rotateAlways: true,
          hideOverlappingLabels: false,
          trim: false,
          style: { fontSize: "19px" },
          offsetY: 6,
          minHeight: 70,
          maxHeight: 90,
        },
      },
      yaxis: {
        title: {
          text: mode === "monto" ? "VENTA PROGRAMAS (S/)" : "SOCIOS NUEVOS",
        },
        labels: {
          formatter: (val) =>
            mode === "monto"
              ? `S/ ${Math.round(val).toLocaleString("es-PE")}`
              : `${Math.round(val)}`,
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "center",
        fontSize: "19px",
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (val) => {
            const n = Number(val) || 0;
            if (mode === "monto") {
              return `S/ ${n.toLocaleString("es-PE", {
                minimumFractionDigits: 0,
              })}`;
            }
            return `${n} socios`;
          },
        },
      },
    }),
    [labels, mode]
  );

  const tituloMes = useMemo(
    () =>
      `${new Date(year, month - 1)
        .toLocaleString("es-PE", { month: "long" })
        .toUpperCase()} ${year}`,
    [year, month]
  );

  if (!days.length) {
    return <div>No hay datos para el rango seleccionado.</div>;
  }

  return (
    <div
      style={{
        background: "#fff",
        padding: 12,
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,.06)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontWeight: 800,
          fontSize: 20,
          marginBottom: 8,
          letterSpacing: 0.5,
          color: "#c00000",
        }}
      >
        EVOLUCIÓN DIARIA POR ASESOR - {tituloMes}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "center",
          marginBottom: 6,
          flexWrap: "wrap",
          fontSize: 19,
        }}
      >
        <button
          onClick={() => setMode("monto")}
          style={{
            padding: "4px 10px",
            borderRadius: 999,
            border: "1px solid #c00000",
            background: mode === "monto" ? "#c00000" : "#fff",
            color: mode === "monto" ? "#fff" : "#c00000",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Ver VENTAS (S/)
        </button>
        <button
          onClick={() => setMode("socios")}
          style={{
            padding: "4px 10px",
            borderRadius: 999,
            border: "1px solid #333",
            background: mode === "socios" ? "#333" : "#fff",
            color: mode === "socios" ? "#fff" : "#333",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Ver SOCIOS
        </button>
      </div>

      <Chart type="line" height={420} options={options} series={series} />

      <div
        style={{
          marginTop: 4,
          fontSize: 20,
          textAlign: "center",
          opacity: 0.7,
        }}
      >
        Rango aplicado: {days[0]}–{days[days.length - 1]} / {tituloMes}
      </div>
    </div>
  );
};
