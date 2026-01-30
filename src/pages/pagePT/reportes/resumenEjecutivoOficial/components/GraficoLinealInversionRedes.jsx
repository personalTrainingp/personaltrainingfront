import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/es";
dayjs.extend(utc);
dayjs.locale("es");

export const GraficoLinealInversionRedes = ({ data = [] }) => {
  const [red, setRed] = useState("ambos");

  const norm = (s) =>
    String(s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const getId = (it) =>
    Number(
      it?.id_param ??
        it?.idRed ??
        it?.id_red ??
        it?.id_canal ??
        it?.canal_id ??
        it?.origen_id ??
        it?.id
    );

  const labelFrom = (it) =>
    it?.parametro?.label_param ??
    it?.label_param ??
    it?.nombre_param ??
    it?.canal ??
    it?.red ??
    it?.origen ??
    it?.origen_label ??
    it?.label ??
    "";

  const detectNetwork = (it) => {
    const id = getId(it);
    if (id === 1515) return "meta";
    if (id === 1514) return "tiktok";

    const L = norm(labelFrom(it));
    if (/(meta|facebook|instagram)/.test(L)) return "meta";
    if (/tiktok/.test(L)) return "tiktok";
    return "desconocido";
  };

  const keepByFilter = (it) => {
    if (red === "ambos") return true;
    return detectNetwork(it) === red;
  };

  const lastFour = (Array.isArray(data) ? data : []).slice(0, 4).reverse();

  const series = useMemo(() => {
    return lastFour.map((m, idx) => {
      const items = Array.isArray(m?.items) ? m.items.filter(keepByFilter) : [];
      const base = items[0] ? dayjs.utc(items[0].fecha) : dayjs();
      const daysInMonth = base.daysInMonth();
      const buckets = Array(daysInMonth).fill(0);

      for (const it of items) {
        const d = dayjs.utc(it?.fecha);
        if (!d.isValid()) continue;
        if (d.month() !== base.month() || d.year() !== base.year()) continue;

        const day = d.date();
        const raw =
          typeof it?.cantidad === "string" ? it.cantidad.trim() : it?.cantidad;
        const val = Number(raw);
        buckets[day - 1] += Number.isFinite(val) ? val : 0;
      }

      return {
        name: m?.fecha ?? `Serie ${idx + 1}`,
        data: buckets,
      };
    });
  }, [lastFour, red]);

  const baseMonthForAxis = useMemo(() => {
    const withItems = lastFour.find(
      (m) => Array.isArray(m?.items) && m.items.length > 0
    );
    const ref = withItems?.items?.[0]?.fecha;
    return ref ? dayjs(ref) : dayjs();
  }, [lastFour, red]);

  const daysInMonth = baseMonthForAxis.daysInMonth();
  const categories = useMemo(
    () =>
      Array.from({ length: daysInMonth }, (_, i) => {
        const d = baseMonthForAxis.date(i + 1);
        return `${d.format("dddd")} ${i + 1}`.toUpperCase();
      }),
    [baseMonthForAxis, daysInMonth]
  );

  const options = {
    chart: { type: "line", toolbar: { show: false }, parentHeightOffset: 0 },
    stroke: { curve: "smooth", width: 3 },
    markers: { size: 4 },
    grid: { padding: { bottom: 90, left: 8, right: 8 } },
    xaxis: {
      categories,
      labels: {
        rotate: -90,
        rotateAlways: true,
        hideOverlappingLabels: false,
        trim: false,
        style: { fontSize: "15px" },
        offsetY: 8,
        minHeight: 80,
        maxHeight: 120,
      },
    },
    yaxis: { title: { text: "Cantidad" } },
    legend: { position: "top", floating: true, offsetY: 8 },
    tooltip: { x: { show: true }, y: { formatter: (val) => `${val}` } },
  };

  const ICONS = {
    ambos: { src: "/Positivo-transparente.png", label: "Ambos" },
    meta: { src: "/meta.jpg", color: "#0d6efd", label: "Meta" },
    tiktok: { src: "/tiktok.png", color: "#000000", label: "TikTok" },
  };

  const IconFilter = ({ keyName }) => {
    const active = red === keyName;
    const { src, color, label } = ICONS[keyName];

    return (
      <button
        onClick={() => setRed(keyName)}
        aria-label={label}
        title={label}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 54,
          height: 54,
          borderRadius: "999px",
          border: `2px solid ${active ? color : "transparent"}`,
          background: "transparent",
          padding: 4,
          cursor: "pointer",
          transition: "all .15s ease",
          boxShadow: active ? `0 0 0 2px ${color}22` : "none",
        }}
      >
        <img
          src={src}
          alt={label}
          style={{
            width: 52,
            height: 52,
            objectFit: "contain",
            transform: active ? "scale(1.05)" : "scale(1)",
          }}
        />
      </button>
    );
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 14,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
          flexWrap: "wrap",
        }}
      >
        <span style={{fontSize:20}}></span>
        <IconFilter keyName="ambos" />
        <IconFilter keyName="meta" />
        <IconFilter keyName="tiktok" />
      </div>

      <Chart options={options} series={series} type="line" height={450} />
    </div>
  );
};
