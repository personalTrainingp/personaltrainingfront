import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import ResumenMembresias from "./index.jsx";

import { TopControls } from "@/pages/pagePT/reportes/resumenEjecutivo/components/TopControls.jsx";

export default function ResumenMembresiasPage() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  const [ventas, setVentas] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [initDay, setInitDay] = useState(1);
  const [cutDay, setCutDay] = useState(today.getDate());

  // === últimos 8 meses dinámicos ===
  const meses8 = useMemo(() => {
    const out = [];
    let y = currentYear;
    let m = currentMonth;
    for (let i = 0; i < 8; i++) {
      out.push({ year: y, month: m });
      m--;
      if (m === 0) {
        m = 12;
        y--;
      }
    }
    return out;
  }, [currentYear, currentMonth]);

  // === Cargar ventas desde tu API ===
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/venta/get-ventas/598")
      .then((r) => {
        const data = Array.isArray(r.data)
          ? r.data
          : Array.isArray(r.data?.ventas)
          ? r.data.ventas
          : [];
        setVentas(data);
      })
      .catch((err) => console.error("Error cargando ventas:", err));
  }, []);

  return (
    <div className="container mt-3">
      {/* Controles de mes / initDay / cutDay */}
      <TopControls
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        initDay={initDay}
        setInitDay={setInitDay}
        cutDay={cutDay}
        setCutDay={setCutDay}
        year={currentYear}
      />

      <hr />

      {/* Render de los últimos 8 meses */}
      {meses8.map(({ year, month }) => (
        <div key={`${year}-${month}`} style={{ marginBottom: 50 }}>
          <h2 style={{ textAlign: "center", marginBottom: 20 }}>
            {new Date(year, month - 1)
              .toLocaleString("es-PE", { month: "long" })
              .toUpperCase()}{" "}
            {year}
          </h2>

          <ResumenMembresias
            ventas={ventas}   // ← TODAS LAS VENTAS, SIN FILTROS
            year={year}
            month={month}
            initDay={initDay}
            cutDay={cutDay}
          />
        </div>
      ))}
    </div>
  );
}
