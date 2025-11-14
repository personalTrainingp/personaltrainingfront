import React, { useEffect, useState, useMemo } from "react";
import ResumenMembresias from "./index.jsx";
      import PTApi from '@/common/api/PTApi';

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
  let cancel = false;

  (async () => {
    try {
      const { data } = await PTApi.get('/venta/get-ventas/598'); 
      const ventas = Array.isArray(data)
        ? data
        : Array.isArray(data?.ventas)
        ? data.ventas
        : [];

      if (!cancel) setVentas(ventas);
    } catch (err) {
      console.error('Error cargando ventas:', err);
    }
  })();

  return () => {
    cancel = true;
  };
}, []); 

 return (
    <div className="container-fluid mt-3"> {/* Usa container-fluid para más espacio */}
      {/* Controles de mes / initDay / cutDay 
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

      {/* 1. Contenedor Flex con Scroll Horizontal */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          overflowX: 'auto',
          gap: '30px', // Espacio entre tablas
          padding: '10px 0' 
        }}
      >
        {/* Render de los últimos 8 meses */}
        {meses8.map(({ year, month }) => (
          <div 
            key={`${year}-${month}`} 
            // 2. Estilo de cada tabla individual
            style={{ 
              flex: '0 0 450px' // No crece, no se encoge, ancho base 450px
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: 20 }}>
              {new Date(year, month - 1)
                .toLocaleString("es-PE", { month: "long" })
                .toUpperCase()}{" "}
              {year}
            </h2>

            <ResumenMembresias
              ventas={ventas} 
              year={year}
              month={month}
              initDay={initDay}
              cutDay={cutDay}
            />
          </div>
        ))}
      </div>
    </div>
  );
}