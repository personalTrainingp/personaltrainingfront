import React from "react";
import Chart from "react-apexcharts";
import dayjs from "dayjs";
import "dayjs/locale/es"; // para días en español
dayjs.locale("es");

export const GraficoLinealInversionRedes = ({ data }) => {
  const firstFour = data.slice(0, 4).reverse();

  const series = firstFour.map((m, idx) => {
    const items = Array.isArray(m.items) ? m.items : [];
    const baseMonth = items[0] ? dayjs(items[0].fecha) : dayjs();
    const daysInMonth = baseMonth.daysInMonth();
    const buckets = Array(daysInMonth).fill(0);

    for (const it of items) {
      const d = dayjs(it.fecha);
      if (!d.isValid()) continue;
      if (d.month() !== baseMonth.month() || d.year() !== baseMonth.year())
        continue;

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

  // Generar categorías tipo "lunes 1"
  const baseMonth = firstFour[0]?.items?.[0]
    ? dayjs(firstFour[0].items[0].fecha)
    : dayjs();
  const daysInMonth = baseMonth.daysInMonth();

  const categories = Array.from({ length: daysInMonth }, (_, i) => {
    const d = baseMonth.date(i + 1);
    return `${d.format("dddd")}    ${i + 1}`;
  });
const options = {
  chart: { type: "line", toolbar: { show: false }, parentHeightOffset: 0 },
  stroke: { curve: "smooth", width: 3 },
  markers: { size: 4 },
  grid: {
    padding: { bottom: 90, left: 8, right: 8 }, // ⬅️ espacio extra para etiquetas verticales
  },
  xaxis: {
    categories,
    labels: {
      rotate: -90,
      rotateAlways: true,
      hideOverlappingLabels: false,
      trim: false,
      // si tienes muchas etiquetas, usa 9–10 px
      style: { fontSize: "10px" },
      offsetY: 8,
      // estos ayudan si tu versión los soporta:
      minHeight: 80,
      maxHeight: 120,
    },
  },
  yaxis: { title: { text: "Cantidad" } },
  legend: { position: "top", floating: true, offsetY: 8 }, // libera espacio abajo
};

  return <Chart options={options} series={series} type="line" height={450} />;
};

